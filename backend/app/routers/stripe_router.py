from datetime import datetime, timezone

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

from app.auth import verify_internal_key
from app.config import settings
from app.db import get_db

router = APIRouter(prefix="/stripe", tags=["stripe"])
stripe.api_key = settings.stripe_secret_key


class CheckoutRequest(BaseModel):
    user_id: str
    user_email: str
    plan: str  # "pro" | "annual"


class PortalRequest(BaseModel):
    user_id: str


@router.post("/checkout", dependencies=[Depends(verify_internal_key)])
async def create_checkout(req: CheckoutRequest):
    price_id = (
        settings.stripe_price_pro if req.plan == "pro"
        else settings.stripe_price_annual
    )
    if not price_id:
        raise HTTPException(500, "결제 가격 설정이 없습니다")
    if not settings.stripe_secret_key:
        raise HTTPException(500, "Stripe 키가 설정되지 않았습니다")

    db = get_db()
    sub = db.table("user_subscriptions").select("stripe_customer_id").eq("user_id", req.user_id).maybe_single().execute()

    customer_id = sub.data["stripe_customer_id"] if sub.data else None
    if not customer_id:
        customer = stripe.Customer.create(
            email=req.user_email,
            metadata={"user_id": req.user_id},
        )
        customer_id = customer.id
        db.table("user_subscriptions").upsert({
            "user_id": req.user_id,
            "stripe_customer_id": customer_id,
        }).execute()

    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=f"{settings.frontend_url}/plan?success=true",
        cancel_url=f"{settings.frontend_url}/plan",
        metadata={"user_id": req.user_id, "plan": req.plan},
    )
    return {"url": session.url}


@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(payload, sig, settings.stripe_webhook_secret)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(400, "서명 검증 실패")

    db = get_db()
    etype = event["type"]

    if etype == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session["metadata"]["user_id"]
        plan = session["metadata"]["plan"]
        sub_id = session.get("subscription")
        period_end = None
        if sub_id:
            sub = stripe.Subscription.retrieve(sub_id)
            period_end = datetime.fromtimestamp(sub["current_period_end"], tz=timezone.utc).isoformat()
        db.table("user_subscriptions").upsert({
            "user_id": user_id,
            "stripe_subscription_id": sub_id,
            "plan": plan,
            "status": "active",
            "current_period_end": period_end,
        }).execute()

    elif etype == "customer.subscription.updated":
        sub = event["data"]["object"]
        period_end = datetime.fromtimestamp(sub["current_period_end"], tz=timezone.utc).isoformat()
        db.table("user_subscriptions").update({
            "status": sub["status"],
            "current_period_end": period_end,
        }).eq("stripe_subscription_id", sub["id"]).execute()

    elif etype == "customer.subscription.deleted":
        sub = event["data"]["object"]
        db.table("user_subscriptions").update({
            "plan": "free",
            "status": "cancelled",
            "stripe_subscription_id": None,
            "current_period_end": None,
        }).eq("stripe_subscription_id", sub["id"]).execute()

    return {"received": True}


@router.post("/portal", dependencies=[Depends(verify_internal_key)])
async def create_portal(req: PortalRequest):
    if not settings.stripe_secret_key:
        raise HTTPException(500, "Stripe 키가 설정되지 않았습니다")

    db = get_db()
    sub = db.table("user_subscriptions").select("stripe_customer_id").eq("user_id", req.user_id).maybe_single().execute()
    if not sub.data or not sub.data.get("stripe_customer_id"):
        raise HTTPException(404, "구독 정보가 없습니다")

    session = stripe.billing_portal.Session.create(
        customer=sub.data["stripe_customer_id"],
        return_url=f"{settings.frontend_url}/plan",
    )
    return {"url": session.url}
