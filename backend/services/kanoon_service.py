import os
import requests
from dotenv import load_dotenv
load_dotenv()
KANOON_TOKEN = os.getenv("KANOON_API_TOKEN")
BASE_URL = "https://api.indiankanoon.org/search/"

def search_similar_cases(query: str):
    headers = {
        "Authorization": f"Token {KANOON_TOKEN}",
        "Accept": "application/json",
    }

    # cleaner query for search
    search_query = (
        query.lower()
        .replace("show similar cases for", "")
        .replace("similar cases for", "")
        .replace("similar cases", "")
        .replace("case law for", "")
        .replace("judgements for", "")
        .strip()
    )

    params = {
        "formInput": search_query,
        "pagenum": 0,
    }

    response = requests.post(BASE_URL, headers=headers, params=params, timeout=20)

    print("KANOON STATUS:", response.status_code)
    print("KANOON QUERY:", search_query)
    print("KANOON RAW:", response.text[:1500])

    if response.status_code != 200:
        return []

    data = response.json()
    print("KANOON JSON KEYS:", list(data.keys()))

    docs = data.get("docs", [])
    print("DOC COUNT:", len(docs))

    cases = []
    for doc in docs[:3]:
        cases.append({
            "title": doc.get("title", "Untitled"),
            "court": doc.get("docsource", "Unknown court"),
            "snippet": doc.get("headline", "No summary available"),
            "url": f"https://indiankanoon.org/doc/{doc.get('tid')}/" if doc.get("tid") else ""
        })

    return cases