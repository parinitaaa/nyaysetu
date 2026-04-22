import asyncio
import io
import json
import os
import sys

from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from groq import Groq
import pdfplumber
from docx import Document as DocxDocument
from datetime import datetime

from database import Analysis, get_db
from utils.legal_pdf_export import generate_pdf_bytes

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

router = APIRouter(prefix="/legal", tags=["Legal Analyzer"])

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL_1 = "llama-3.1-8b-instant"
MODEL_2 = "llama-3.3-70b-versatile"

document_store = {}


class LegalChatRequest(BaseModel):
    session_id: str
    message: str
    history: list


class ExportRequest(BaseModel):
    final_summary: dict
    risky_clauses: list
    doc_filename: str = "document"


def extract_text(file_bytes: bytes, filename: str) -> str:
    if filename.endswith(".pdf"):
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            return "\n".join(page.extract_text() or "" for page in pdf.pages)
    elif filename.endswith(".docx"):
        doc = DocxDocument(io.BytesIO(file_bytes))
        return "\n".join(p.text for p in doc.paragraphs)
    return ""


def parse_json(raw: str) -> dict:
    start = raw.find("{")
    end = raw.rfind("}") + 1
    return json.loads(raw[start:end])


def parse_json_list(raw: str) -> list:
    start = raw.find("[")
    end = raw.rfind("]") + 1
    return json.loads(raw[start:end])


async def call_model_1(prompt: str) -> dict:
    try:
        loop = asyncio.get_event_loop()
        res = await loop.run_in_executor(
            None,
            lambda: groq_client.chat.completions.create(
                model=MODEL_1,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
            ),
        )
        return {"model": "LLaMA", "result": parse_json(res.choices[0].message.content)}
    except Exception as e:
        return {"model": "LLaMA", "error": str(e)}


async def call_model_2(prompt: str) -> dict:
    try:
        loop = asyncio.get_event_loop()
        res = await loop.run_in_executor(
            None,
            lambda: groq_client.chat.completions.create(
                model=MODEL_2,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
            ),
        )
        return {
            "model": "LLaMA-70b",
            "result": parse_json(res.choices[0].message.content),
        }
    except Exception as e:
        return {"model": "LLaMA-70b", "error": str(e)}


async def merge_results(responses: list) -> dict:
    valid = [r for r in responses if "result" in r]
    if not valid:
        return {"error": "All models failed"}
    if len(valid) == 1:
        return valid[0]["result"]

    summaries = "\n\n".join(
        f"=== {r['model']} ===\n{json.dumps(r['result'], indent=2)}" for r in valid
    )
    merge_prompt = f"""
Merge these two AI summaries of a legal document into ONE best response.
Combine all unique action items and red flags. Use plain English.
Respond ONLY in this exact JSON format, no other text:

{{
  "what_is_it": "...",
  "simple_summary": "...",
  "action_items": ["..."],
  "red_flags": ["..."],
  "key_dates": ["..."],
  "severity": "low | medium | high",
  "one_line_verdict": "..."
}}

Summaries to merge:
{summaries}
"""
    try:
        loop = asyncio.get_event_loop()
        res = await loop.run_in_executor(
            None,
            lambda: groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": merge_prompt}],
                temperature=0.2,
            ),
        )
        return parse_json(res.choices[0].message.content)
    except Exception:
        return valid[0]["result"]


async def extract_risky_clauses(text: str) -> list:
    prompt = f"""
Find risky, unusual, or important clauses in this legal document.
Return ONLY a JSON array, no other text:
[
  {{
    "clause": "exact sentence from document",
    "risk_level": "high | medium | low",
    "reason": "why this is risky in simple words",
    "category": "termination | payment | liability | privacy | non-compete | other"
  }}
]

Document:
{text[:6000]}
"""
    try:
        loop = asyncio.get_event_loop()
        res = await loop.run_in_executor(
            None,
            lambda: groq_client.chat.completions.create(
                model=MODEL_2,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
            ),
        )
        return parse_json_list(res.choices[0].message.content)
    except Exception:
        return []


def detect_doc_type(text: str) -> str:
    prompt = f"""
Identify the document type. Return ONLY one of these exact strings with no other text:
rental_agreement, employment_contract, loan_agreement, nda, terms_of_service, other

Document (first 1000 chars):
{text[:1000]}
"""
    try:
        res = groq_client.chat.completions.create(
            model=MODEL_1,
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
        )
        t = res.choices[0].message.content.strip().lower()
        valid = [
            "rental_agreement",
            "employment_contract",
            "loan_agreement",
            "nda",
            "terms_of_service",
        ]
        return t if t in valid else "other"
    except Exception:
        return "other"


@router.post("/analyze")
async def analyze_document(
    file: UploadFile = File(...),
    user_profile: str = Form("first_timer"),
    session_id: str = Form(...),
    db: AsyncSession = Depends(get_db),
):
    file_bytes = await file.read()
    text = extract_text(file_bytes, file.filename)

    if not text.strip():
        return {"error": "Could not extract text from this file"}

    document_store[session_id] = text
    doc_type = detect_doc_type(text)

    prompt = f"""
Analyze this legal document for a {user_profile}. 
Respond ONLY in this exact JSON format, no other text:
{{
  "what_is_it": "1-2 sentences on what type of document this is",
  "simple_summary": "3-4 sentences explaining what this means in plain English",
  "action_items": ["action 1", "action 2"],
  "red_flags": ["red flag 1", "red flag 2"],
  "key_dates": ["date 1", "date 2"],
  "severity": "low or medium or high",
  "one_line_verdict": "one sentence: should they sign this or be careful?"
}}

Document:
{text[:5000]}
"""

    responses, risky_clauses = await asyncio.gather(
        asyncio.gather(call_model_1(prompt), call_model_2(prompt)),
        extract_risky_clauses(text),
    )

    final = await merge_results(list(responses))

    record = Analysis(
        filename=file.filename,
        doc_type=doc_type,
        severity=final.get("severity"),
        one_liner=final.get("one_line_verdict"),
        summary=final,
        clauses=risky_clauses,
    )
    db.add(record)
    await db.commit()

    return {
        "analysis_id": record.id,
        "doc_type": doc_type,
        "final_summary": final,
        "risky_clauses": risky_clauses,
        "individual_responses": responses,
    }


@router.post("/chat")
async def legal_chat(req: LegalChatRequest):
    doc_text = document_store.get(req.session_id)
    if not doc_text:
        return {"reply": "Sorry, I can't find your document. Please re-upload it."}

    messages = [
        {
            "role": "user",
            "content": (
                "You are a legal assistant. Answer questions about this document "
                "in plain English. Be concise and helpful. "
                "If something is risky, warn them clearly.\n\n"
                f"Document:\n{doc_text[:5000]}\n\n"
                "The user's first question follows."
            ),
        }
    ]
    for msg in req.history:
        messages.append({"role": msg["role"], "content": msg["content"]})
    messages.append({"role": "user", "content": req.message})

    loop = asyncio.get_event_loop()
    res = await loop.run_in_executor(
        None,
        lambda: groq_client.chat.completions.create(
            model=MODEL_1,
            messages=messages,
            temperature=0.4,
        ),
    )
    return {"reply": res.choices[0].message.content}


@router.get("/history")
async def get_history(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Analysis).order_by(desc(Analysis.created_at)).limit(50)
    )
    records = result.scalars().all()
    return [
        {
            "id": r.id,
            "filename": r.filename,
            "doc_type": r.doc_type,
            "severity": r.severity,
            "one_liner": r.one_liner,
            "created_at": r.created_at.isoformat(),
        }
        for r in records
    ]


@router.get("/history/{analysis_id}")
async def get_analysis(analysis_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Analysis).where(Analysis.id == analysis_id))
    record = result.scalar_one_or_none()
    if not record:
        return {"error": "Analysis not found"}
    return {
        "id": record.id,
        "filename": record.filename,
        "doc_type": record.doc_type,
        "severity": record.severity,
        "one_liner": record.one_liner,
        "final_summary": record.summary,
        "risky_clauses": record.clauses,
        "created_at": record.created_at.isoformat(),
    }


@router.delete("/history/{analysis_id}")
async def delete_analysis(analysis_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Analysis).where(Analysis.id == analysis_id))
    record = result.scalar_one_or_none()
    if not record:
        return {"error": "Analysis not found"}
    await db.delete(record)
    await db.commit()
    return {"deleted": True}


@router.post("/export-pdf")
async def export_pdf(req: ExportRequest):
    pdf_bytes = generate_pdf_bytes(
        req.final_summary, req.risky_clauses, req.doc_filename
    )
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=legal_report_{datetime.now().strftime('%Y%m%d_%H%M')}.pdf"
        },
    )


@router.get("/history/{analysis_id}/pdf")
async def export_history_pdf(analysis_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Analysis).where(Analysis.id == analysis_id))
    record = result.scalar_one_or_none()
    if not record:
        return {"error": "Analysis not found"}
    pdf_bytes = generate_pdf_bytes(
        record.summary, record.clauses or [], record.filename
    )
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=legal_report_{record.id[:8]}.pdf"
        },
    )
