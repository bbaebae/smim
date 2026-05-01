"""
Cron endpoints — called by Railway Cron or an external scheduler.
Protected by the same internal API key.
"""
from datetime import date

from fastapi import APIRouter, Depends

from app.auth import verify_internal_key
from app.db import get_db
from app.services.email import send_weekly_report, send_review_reminder

router = APIRouter(prefix="/cron", tags=["cron"])


@router.post("/weekly-report", dependencies=[Depends(verify_internal_key)])
async def weekly_report():
    """
    Send weekly review summary to all Pro users.
    Railway Cron: 0 9 * * 1  (every Monday 09:00 UTC)
    """
    db = get_db()

    # fetch Pro users who have contents
    users_res = db.from_("contents") \
        .select("user_id, title, summary, category") \
        .execute()

    # group by user
    from collections import defaultdict
    user_contents: dict[str, list[dict]] = defaultdict(list)
    for row in users_res.data or []:
        user_contents[row["user_id"]].append({
            "title": row["title"],
            "summary": row["summary"] or "",
            "category": row["category"] or "",
        })

    sent = 0
    for user_id, items in user_contents.items():
        # get user email + plan from auth.users via service role
        user_res = db.auth.admin.get_user_by_id(user_id)
        user = user_res.user
        if not user:
            continue
        plan = (user.user_metadata or {}).get("plan", "free")
        if plan != "pro":
            continue

        email = user.email
        if not email:
            continue

        top_items = items[:5]
        send_weekly_report(email, top_items)
        sent += 1

    return {"sent": sent}


@router.post("/review-notify", dependencies=[Depends(verify_internal_key)])
async def review_notify():
    """
    Send review reminder to users who have items due today.
    Railway Cron: 0 8 * * *  (every day 08:00 UTC)
    """
    db = get_db()
    today = date.today().isoformat()

    due_res = db.from_("review_schedule") \
        .select("user_id, contents(title, summary, category)") \
        .lte("next_review_at", today) \
        .execute()

    from collections import defaultdict
    user_due: dict[str, list[dict]] = defaultdict(list)
    for row in due_res.data or []:
        content = row.get("contents") or {}
        user_due[row["user_id"]].append({
            "title": content.get("title", ""),
            "summary": content.get("summary", ""),
            "category": content.get("category", ""),
        })

    sent = 0
    for user_id, items in user_due.items():
        user_res = db.auth.admin.get_user_by_id(user_id)
        user = user_res.user
        if not user or not user.email:
            continue

        send_review_reminder(user.email, items)
        sent += 1

    return {"sent": sent}
