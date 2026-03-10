from html_cleaner import extract_clean_text
from llm_structurer import structure_procedure
from update_json import add_procedure


def ingest_procedure(url):

    print("Fetching:", url)

    raw_text = extract_clean_text(url)
    print("RAW TEXT LENGTH:", len(raw_text))
    print(raw_text[:500])
    structured = structure_procedure(raw_text)

    if structured:
        add_procedure(structured)
    else:
        print("Failed to structure procedure")