import ollama
import json
import re


def structure_procedure(raw_text):

    prompt = f"""
You are a legal information extractor.

From the text below, extract a legal procedure.

Return ONLY JSON.
Do NOT explain anything.

Output format must be EXACTLY this:

{{
"title": "procedure title",
"summary": "short summary",
"steps": ["step1", "step2", "step3"],
"documentsRequired": ["doc1", "doc2"],
"whereToFile": ["portal or authority"],
"legalBasis": ["act or law"]
}}

Rules:
- steps must contain 3-8 items
- summary must be 1-2 sentences
- return valid JSON only
- no markdown
- no text before or after JSON

TEXT:
{raw_text[:3000]}
"""

    response = ollama.chat(
        model="phi3",
        messages=[{"role": "user", "content": prompt}]
    )

    content = response["message"]["content"]

    print("LLM RAW OUTPUT:\n", content)

    match = re.search(r"\{[\s\S]*\}", content)

    if not match:
        print("No JSON found")
        return None

    json_str = match.group()

    try:
        return json.loads(json_str)
    except Exception as e:
        print("JSON parse failed:", e)
        return None