from services.llm_service import LLMService

llm = LLMService()

REFINE_SYSTEM = (
    "You are a legal assistant. Convert user queries into precise Indian legal search queries."
)

import re

def clean_query(query: str) -> str:
    query = query.replace("\n", " ")
    query = re.sub(r"[*\"']", "", query)  # remove *, quotes
    query = re.sub(r"\s+", " ", query).strip()
    return query

def refine_query(user_query: str) -> str:
    prompt = f"""
Convert this into a short 5-10 word plain text search query for Indian Kanoon.
No AND, OR, quotes, symbols, or newlines. Just plain keywords.

User Query: {user_query}
Return ONLY the plain text query, nothing else.
"""
    refined = llm.generate_text(REFINE_SYSTEM, prompt)
    return clean_query(refined)