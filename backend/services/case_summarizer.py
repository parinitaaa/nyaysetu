from typing import Dict, Any, List
from document_analyzer.llm import OllamaLLM

SUMMARY_SYSTEM = (
    "You are a legal AI that produces detailed, structured case summaries for clients. "
    "Use ONLY the provided CASE TEXT. If something is not available, say 'Not found'. "
    "Return ONLY valid JSON."
)

def build_case_summary_prompt(case_text: str) -> str:
    return f"""
CASE TEXT:
{case_text}

Return JSON exactly in this schema:
{{
  "case_title": "string",
  "court": "string",
  "case_number": "string",
  "date": "string",
  "parties": [{{"name":"string","role":"string"}}],

  "very_detailed_summary": {{
    "background_and_facts": ["bullet", "bullet", "bullet"],
    "issues": ["bullet", "bullet"],
    "arguments_appellant_or_petitioner": ["bullet"],
    "arguments_respondent": ["bullet"],
    "key_evidence_or_documents": ["bullet"],
    "legal_provisions_discussed": ["bullet e.g. Contract Act s.74"],
    "court_reasoning_step_by_step": ["bullet", "bullet", "bullet"],
    "final_verdict": {{
      "label": "Allowed|Dismissed|Partly allowed|Bail granted|Bail denied|Other",
      "order": "string"
    }},
    "what_this_means_for_client": ["bullet", "bullet"],
    "practical_next_steps": ["bullet", "bullet"]
  }}
}}
"""
def summarize_case(llm: OllamaLLM, case_text: str) -> Dict[str, Any]:
    user = build_case_summary_prompt(case_text)
    return llm.generate_json(SUMMARY_SYSTEM, user)