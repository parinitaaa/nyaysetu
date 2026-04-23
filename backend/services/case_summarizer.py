from typing import Dict, Any
from services.llm_service import LLMService

llm = LLMService()

SUMMARY_SYSTEM = (
    "You are a legal AI that produces detailed structured summaries of Indian court cases. "
    "Return ONLY valid JSON with no extra text."
)

def summarize_case(case_text: str) -> Dict[str, Any]:

    # 🔴 Step 1: Handle empty text
    if not case_text or len(case_text.strip()) < 100:
        return {
            "error": "Insufficient case text",
            "summary": "Not enough content to summarize"
        }

    prompt = f"""
Analyze this Indian court case and return a JSON object with EXACTLY these fields:

{{
  "case_name": "...",
  "court": "...",
  "date": "...",
  "facts": "Brief facts of the case in 3-4 sentences",
  "issues": ["Legal issue 1", "Legal issue 2"],
  "arguments_petitioner": "Summary of petitioner arguments",
  "arguments_respondent": "Summary of respondent arguments",
  "reasoning": "Court's reasoning in 3-4 sentences",
  "verdict": "FINAL VERDICT - exactly what the court decided",
  "key_sections": ["IPC 302", "CrPC 437"],
  "precedents_cited": ["Case name 1", "Case name 2"]
}}

CASE TEXT:
{case_text[:6000]}

Return ONLY the JSON object.
"""

    try:
        result = llm.generate_json(SUMMARY_SYSTEM, prompt)

        # 🔴 Step 2: Validate output
        if not result or not isinstance(result, dict):
            return {
                "error": "Invalid LLM output",
                "raw_output": result
            }

        # 🔴 Step 3: Ensure key fields exist
        if "verdict" not in result:
            result["verdict"] = "Not found"

        return result

    except Exception as e:
        return {
            "error": str(e),
            "summary": "LLM failed"
        }