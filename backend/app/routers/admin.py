import asyncio

from fastapi import APIRouter, Depends

from app.auth import verify_internal_key
from app.db import get_db
from app.services import ai

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/backfill-cards", dependencies=[Depends(verify_internal_key)])
async def backfill_cards():
    db = get_db()

    result = db.table("contents").select("id, summary").is_("summary_cards", "null").execute()
    items = result.data or []

    updated = 0
    failed = 0

    for item in items:
        try:
            cards = await ai.generate_cards_from_summary(item["summary"])
            if cards:
                db.table("contents").update({"summary_cards": cards}).eq("id", item["id"]).execute()
                updated += 1
            else:
                failed += 1
        except Exception:
            failed += 1
        await asyncio.sleep(0.3)

    return {"total": len(items), "updated": updated, "failed": failed}
