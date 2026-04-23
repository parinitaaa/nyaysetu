from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from services.faiss_service import rank_cases
from services.query_refiner import refine_query
from services.indiankanoon_client import IndianKanoonClient
from services.text_utils import html_to_text
from services.case_summarizer import summarize_case
from config.settings import IK_PUBLIC_BASE
from concurrent.futures import ThreadPoolExecutor, as_completed

router = APIRouter(prefix="/cases", tags=["Case Search"])
ik = IndianKanoonClient(timeout=60)

class CaseSearchRequest(BaseModel):
    query: str
    case_number: Optional[str] = None
    court_doctypes: Optional[str] = None
    fromdate: Optional[str] = None
    todate: Optional[str] = None
    title: Optional[str] = None
    cite: Optional[str] = None
    page: int = 0
    max_results: int = 10
    mode: str = "exact_first"
    enrich: bool = False   # 👈 toggle: set True to fetch summaries

def _public_link(docid: str) -> str:
    return f"{IK_PUBLIC_BASE}/doc/{docid}/"

def _fetch_and_summarize(doc_id: str, query: str) -> Dict[str, Any]:
    """Fetch full doc text and return structured summary + verdict."""
    try:
        frag = ik.docfragment(doc_id, form_input=query)
        raw = (frag.get("doc") or "") + " " + (frag.get("headline") or "")
        if not raw.strip():
            doc = ik.doc(doc_id)
            raw = (
                doc.get("doc") or
                doc.get("judgment") or
                doc.get("content") or
                doc.get("headline") or
                ""
           )
        
        case_text = html_to_text(raw)
        print("CASE TEXT LENGTH:", len(case_text))
        print("CASE TEXT SAMPLE:", case_text[:300])
        if not case_text:
            return {"summary": None, "verdict": "Not available"}
        
        summary = summarize_case(case_text)  # returns dict
        return {
            "summary": summary,
            "verdict": summary.get("verdict") or summary.get("final_verdict") or summary.get("outcome") or "Not found"
        }
    except Exception as e:
        return {"summary": None, "verdict": f"Error: {str(e)}"}

@router.post("/search")
def search_cases(req: CaseSearchRequest):

    # Step 1: Refine query
    try:
        refined_query = refine_query(req.query)
    except:
        refined_query = req.query

    form_input = refined_query.strip()
    print("FINAL QUERY SENT TO KANOON:", form_input)

    if req.case_number:
        form_input = f'"{req.case_number}" {form_input}'.strip()

    # Step 2: Fetch from Kanoon (with fallback)
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
    except Exception as e:
        print(f"Refined query failed ({e}), falling back to original query.")
        try:
            data = ik.search(
                form_input=req.query,
                pagenum=req.page,
                doctypes=req.court_doctypes,
                fromdate=req.fromdate,
                todate=req.todate,
                title=req.title,
                cite=req.cite
            )
        except Exception as e2:
            raise HTTPException(status_code=502, detail=f"Kanoon API error: {e2}")

    docs = data.get("docs", [])[:max(5, min(req.max_results, 20))]

    raw_results = []
    for d in docs:
        docid = str(d.get("tid", ""))
        title = d.get("title", "Not found")
        headline = html_to_text(d.get("headline", "") or "")
        docsource = d.get("docsource", "Not found")

        raw_results.append({
            "match_type": "similar",
            "similarity_score": None,
            "case_title": title,
            "court": docsource,
            "snippet": headline,
            "doc_id": docid,
            "public_link": _public_link(docid) if docid else None
        })

    if not raw_results:
        return {
            "original_query": req.query,
            "refined_query": refined_query,
            "exact_match_found": False,
            "results_count": 0,
            "results": []
        }

    # Step 3: FAISS Re-ranking
    ranked_results = rank_cases(refined_query, raw_results, top_k=req.max_results)

    # Step 4: Exact match detection
    for r in ranked_results:
        if req.case_number and req.case_number.lower() in r["case_title"].lower():
            r["match_type"] = "exact"

    exact_found = any(r["match_type"] == "exact" for r in ranked_results)

    # Step 5: Enrich with summaries in parallel (only if enrich=True)
    if req.enrich:
        with ThreadPoolExecutor(max_workers=5) as executor:
            future_to_case = {
                executor.submit(_fetch_and_summarize, r["doc_id"], refined_query): r
                for r in ranked_results
                if r.get("doc_id")
            }
            for future in as_completed(future_to_case):
                case = future_to_case[future]
                try:
                    enrichment = future.result()
                    case["summary"] = enrichment["summary"]
                    case["verdict"] = enrichment["verdict"]
                except Exception as e:
                    case["summary"] = None
                    case["verdict"] = f"Error: {str(e)}"
    else:
        # Just mark as not fetched
        for r in ranked_results:
            r["summary"] = None
            r["verdict"] = "Fetch with enrich=true"

    return {
        "original_query": req.query,
        "refined_query": refined_query,
        "exact_match_found": exact_found,
        "results_count": data.get("found"),
        "results": ranked_results
    }