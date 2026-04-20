from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from nyaysetu.backend.services.kanoon_service import IndianKanoonClient
from services.text_utils import html_to_text
from services.case_summarizer import summarize_case
from config.settings import IK_PUBLIC_BASE

from document_analyzer.llm import OllamaLLM

router = APIRouter(prefix="/cases", tags=["Case Search"])

ik = IndianKanoonClient(timeout=60)

# Use your existing Ollama wrapper
llm = OllamaLLM(
    base_url="http://localhost:11434",
    model="llama3.1:8b-instruct-q4_K_M"  # change if you want
)

class CaseSearchRequest(BaseModel):
    query: str
    case_number: Optional[str] = None
    court_doctypes: Optional[str] = None   # e.g. "karnataka" "supremecourt" etc.
    fromdate: Optional[str] = None         # DD-MM-YYYY
    todate: Optional[str] = None           # DD-MM-YYYY
    title: Optional[str] = None
    cite: Optional[str] = None
    page: int = 0
    max_results: int = 10
    mode: str = "exact_first"              # future use

def _public_link(docid: str) -> str:
    return f"{IK_PUBLIC_BASE}/doc/{docid}/"

@router.post("/search")
def search_cases(req: CaseSearchRequest):
    """
    Returns exact match if strong match exists; otherwise returns similar cases ranked.
    """
    # If user gave case_number, strengthen query
    form_input = req.query.strip()
    if req.case_number:
        form_input = f'"{req.case_number}" {form_input}'.strip()

    try:
        data = ik.search(
            form_input=form_input,
            pagenum=req.page,
            doctypes=req.court_doctypes,
            fromdate=req.fromdate,
            todate=req.todate,
            title=req.title,
            cite=req.cite
        )
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Indian Kanoon API error: {e}")

    docs = data.get("docs", [])[: max(1, min(req.max_results, 20))]

    results: List[Dict[str, Any]] = []
    for d in docs:
        docid = str(d.get("tid", ""))
        title = d.get("title", "Not found")
        headline = html_to_text(d.get("headline", "") or "")
        docsource = d.get("docsource", "Not found")

        # Heuristic: exact if case_number appears in title or query very specifically matches
        match_type = "similar"
        if req.case_number and req.case_number.lower() in (title or "").lower():
            match_type = "exact"

        results.append({
            "match_type": match_type,
            "similarity_score": None,  # IK doesn't return a simple score; you can add one later if needed
            "case_title": title,
            "court": docsource,
            "snippet": headline,
            "doc_id": docid,
            "public_link": _public_link(docid) if docid else None
        })

    exact_found = any(r["match_type"] == "exact" for r in results)

    return {
        "query_used": form_input,
        "exact_match_found": exact_found,
        "results_count": data.get("found"),
        "results": results
    }

@router.get("/{doc_id}")
def case_detail(doc_id: str, q: Optional[str] = None):
    """
    Returns: meta + very detailed summary.
    If q is provided, uses docfragment for relevance; otherwise uses full doc.
    """
    try:
        meta = ik.docmeta(doc_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"docmeta error: {e}")

    # Get text: fragment (best) if query provided, else full doc
    try:
        if q:
            frag = ik.docfragment(doc_id, form_input=q)
            # commonly has title/headline + fragment html; we grab doc (if present) + headline
            raw = (frag.get("doc") or "") + " " + (frag.get("headline") or "")
        else:
            doc = ik.doc(doc_id)
            raw = doc.get("doc") or doc.get("headline") or ""
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"doc/docfragment error: {e}")

    case_text = html_to_text(raw)
    if not case_text:
        case_text = "Not found"

    # Very detailed summary (LLM)
    try:
        summary = summarize_case(llm, case_text)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM summary error: {e}")

    return {
        "doc_id": doc_id,
        "public_link": _public_link(doc_id),
        "meta": meta,
        "summary": summary
    }

@router.get("/{doc_id}/timeline")
def case_timeline(doc_id: str):
    """
    Timeline is tricky because "full appeal chain" isn't guaranteed by public APIs.
    We return whatever docmeta provides + placeholders for UI.
    """
    try:
        meta = ik.docmeta(doc_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"docmeta error: {e}")

    # Return meta and any known related fields if present
    possible_keys = ["cites", "citedby", "related", "bench", "docsource", "date", "citation"]
    extracted = {k: meta.get(k) for k in possible_keys if k in meta}

    return {
        "doc_id": doc_id,
        "public_link": _public_link(doc_id),
        "timeline_note": (
            "Automatic end-to-end case history depends on source availability. "
            "Showing metadata and related references when present."
        ),
        "meta_excerpt": extracted,
        "raw_meta": meta
    }