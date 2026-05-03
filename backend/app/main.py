from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import contents, cron, stripe_router, admin

app = FastAPI(title="Smim Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

app.include_router(contents.router)
app.include_router(cron.router)
app.include_router(stripe_router.router)
app.include_router(admin.router)


@app.get("/health")
def health():
    return {"status": "ok", "version": "2025-05-02-whisper"}
