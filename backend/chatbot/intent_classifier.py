PROCEDURE_KEYWORDS = [
    "how to file",
    "how do i file",
    "procedure",
    "steps to",
    "how to complain",
    "where to complain",
    "where to file",
    "how do i report",
    "how can i report",
    "documents required",
    "complaint process",
    "filing process",
    "legal procedure",
    "how to apply",
    "what should i do"
]

CASE_KEYWORDS = [
    "similar case",
    "similar cases",
    "case law",
    "judgement",
    "judgment",
    "court decision",
    "precedent",
    "previous cases",
    "related cases"
]


def is_procedure_query(query: str) -> bool:
    query = query.lower().strip()
    return any(keyword in query for keyword in PROCEDURE_KEYWORDS)


def is_case_query(query: str) -> bool:
    query = query.lower().strip()
    return any(keyword in query for keyword in CASE_KEYWORDS)