from typing import Dict, List, Any
from .embeddings import Embedder
from .vector_store_faiss import FaissStore
from .llm import OllamaLLM
from .schemas import LegalReport

DOC_TYPE_SYSTEM = "You are a legal document classifier."

def format_sources(sources: List[Dict]) -> str:
    return "\n\n".join(
        [f"[Page {s['page']} | {s['chunk_id']}]\n{s['text']}" for s in sources]
    )

class DocumentAnalyzer:
    def __init__(self, embedder: Embedder, llm: OllamaLLM, store: FaissStore):
        self.embedder = embedder
        self.llm = llm
        self.store = store

    def retrieve(self, query: str, top_k: int = 8) -> List[Dict]:
        qv = self.embedder.embed([query])
        return self.store.search(qv, top_k=top_k)

    # ✅ LLM CALL #1
    def detect_doc_type(self) -> Dict[str, Any]:
        sources = self.retrieve(
            "Identify document type: judgment, contract/agreement, legal notice, FIR, policy. Use headings/format keywords.",
            top_k=8,
        )
        user = f"""
SOURCES:
{format_sources(sources)}

Return JSON:
{{
  "doc_type": "Judgment|Contract|Legal Notice|FIR|Policy|Unknown",
  "confidence": 0.0,
  "why": "short reason"
}}
"""
        return self.llm.generate_json(DOC_TYPE_SYSTEM, user)

    # ✅ LLM CALL #2 (ONE-SHOT extraction for everything)
    def extract_full_report(self, doc_type: str) -> Dict[str, Any]:
        # Broad retrieval to cover all important parts
        big_query = (
            "Extract: parties, dates, court/jurisdiction, case number, judge; "
            "facts/background, issues, arguments, decision/outcome, key reasons, sections/acts cited; "
            "clauses/obligations; "
            "for contracts: termination, penalty/liquidated damages, arbitration, jurisdiction, refund, "
            "liability limitation, payment obligations; "
            "identify red flags and missing essentials; "
            "provide actionables: confirm/ask, negotiate, evidence, consult lawyer triggers."
        )

        # Pull more chunks since we want to cover everything in one call
        sources = self.retrieve(big_query, top_k=14)

        schema = """
{
  "metadata": {
    "parties": [{"name":"Not found", "role":"Not found", "citations":[]}],
    "dates": [{"label":"Not found", "value":"Not found", "citations":[]}],
    "court_or_jurisdiction": {"text":"Not found", "citations":[]},
    "case_number": {"text":"Not found", "citations":[]},
    "judge": {"text":"Not found", "citations":[]}
  },
  "structured_summary": {
    "facts_background": {"text":"Not found", "citations":[]},
    "issues": {"text":"Not found", "citations":[]},
    "arguments": {"text":"Not found", "citations":[]},
    "decision_outcome": {"text":"Not found", "citations":[]},
    "key_reasons": {"text":"Not found", "citations":[]},
    "important_sections_acts": [{"name":"Not found", "context":"Not found", "citations":[]}],
    "clauses_obligations": {"text":"Not found", "citations":[]}
  },
  "clauses": {
    "termination": {"text":"Not found", "citations":[]},
    "penalty_liquidated_damages": {"text":"Not found", "citations":[]},
    "arbitration": {"text":"Not found", "citations":[]},
    "jurisdiction": {"text":"Not found", "citations":[]},
    "refund": {"text":"Not found", "citations":[]},
    "liability_limitation": {"text":"Not found", "citations":[]},
    "payment_obligations": {"text":"Not found", "citations":[]}
  },
  "red_flags": [
    {
      "title":"Not found",
      "risk_level":"low|medium|high",
      "why_it_matters":"Not found",
      "suggested_fix":"Not found",
      "citations":[]
    }
  ],
  "missing_essentials": [],
  "actionables": {
    "confirm_or_ask":[{"item":"Not found", "citations":[]}],
    "what_to_negotiate":[{"item":"Not found", "citations":[]}],
    "evidence_to_keep":[{"item":"Not found", "citations":[]}],
    "consult_lawyer_triggers":[{"item":"Not found", "citations":[]}]
  }
}
"""

        system = (
            "You are a legal document analysis assistant. "
            "You MUST use ONLY the provided SOURCES. "
            "If info is not present in SOURCES, return 'Not found' and keep citations empty. "
            "Return ONLY valid JSON matching the schema exactly. No markdown."
        )

        user = f"""
DOC_TYPE: {doc_type}

SOURCES:
{format_sources(sources)}

Fill the schema below.
Important rules:
- Use citations as a list of objects: {{ "page": <int>, "chunk_id": "<string>" }}
- If DOC_TYPE is not Contract, clauses/red_flags can remain Not found/empty.
- Return ONLY JSON.

SCHEMA:
{schema}
"""
        return self.llm.generate_json(system, user)

    # ✅ Now only 2 total LLM calls
    def run(self, doc_id: str) -> LegalReport:
        dt = self.detect_doc_type()
        doc_type = dt.get("doc_type", "Unknown")
        confidence = float(dt.get("confidence", 0.0))

        full = self.extract_full_report(doc_type)

        return LegalReport(
            doc_id=doc_id,
            doc_type=doc_type,
            confidence=confidence,
            metadata=full.get("metadata", {}),
            structured_summary=full.get("structured_summary", {}),
            clauses=full.get("clauses", {}),
            red_flags=full.get("red_flags", []),
            missing_essentials=full.get("missing_essentials", []),
            actionables=full.get("actionables", {}),
        )