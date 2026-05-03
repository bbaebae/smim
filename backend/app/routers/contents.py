from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from pydantic import BaseModel

from app.auth import verify_internal_key
from app.services import scraper, youtube, ai

router = APIRouter(prefix="/contents", tags=["contents"])


class ProcessRequest(BaseModel):
    type: str
    url: str | None = None
    title: str | None = None
    text: str | None = None


class ProcessResponse(BaseModel):
    title: str
    full_text: str
    thumbnail_url: str | None
    summary: str
    category: str
    tags: list[str]
    summary_cards: list[dict]


@router.post("/process", response_model=ProcessResponse, dependencies=[Depends(verify_internal_key)])
async def process_content(req: ProcessRequest):
    title = ""
    full_text = ""
    thumbnail_url = None

    if req.type == "article":
        if not req.url:
            raise HTTPException(400, "url이 필요합니다")
        result = await scraper.scrape_article(req.url)
        title = result["title"]
        full_text = result["text"]

    elif req.type == "youtube":
        if not req.url:
            raise HTTPException(400, "url이 필요합니다")
        try:
            result = await youtube.get_youtube_info(req.url)
        except Exception as e:
            raise HTTPException(400, str(e))
        title = result["title"] or req.url
        full_text = result["transcript"]
        thumbnail_url = result["thumbnail_url"]

    elif req.type == "text":
        if not req.title or not req.text:
            raise HTTPException(400, "title과 text가 필요합니다")
        title = req.title
        full_text = req.text

    else:
        raise HTTPException(400, f"지원하지 않는 type: {req.type}")

    if not full_text.strip():
        raise HTTPException(422, "콘텐츠를 추출할 수 없습니다")

    analysis = await ai.analyze_content(full_text, req.type)

    return ProcessResponse(
        title=title,
        full_text=full_text,
        thumbnail_url=thumbnail_url,
        summary=analysis["summary"],
        category=analysis["category"],
        tags=analysis["tags"],
        summary_cards=analysis["summary_cards"],
    )


@router.post("/process-file", response_model=ProcessResponse, dependencies=[Depends(verify_internal_key)])
async def process_file(file: UploadFile = File(...)):
    data = await file.read()
    filename = file.filename or ""
    title = filename.rsplit(".", 1)[0] or filename
    full_text = ""

    if filename.endswith(".pdf"):
        import fitz  # PyMuPDF
        doc = fitz.open(stream=data, filetype="pdf")
        full_text = "\n".join(page.get_text("text") for page in doc)
        doc.close()
    elif filename.endswith((".txt", ".md")):
        full_text = data.decode("utf-8", errors="replace")
    else:
        raise HTTPException(400, "PDF, TXT, MD 파일만 지원합니다")

    if not full_text.strip():
        raise HTTPException(422, "파일에서 텍스트를 추출할 수 없습니다")

    analysis = await ai.analyze_content(full_text, "file")

    return ProcessResponse(
        title=title,
        full_text=full_text,
        thumbnail_url=None,
        summary=analysis["summary"],
        category=analysis["category"],
        tags=analysis["tags"],
        summary_cards=analysis["summary_cards"],
    )
