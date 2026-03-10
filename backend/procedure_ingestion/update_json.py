import json
from pathlib import Path

DATA_PATH = Path(
    "../knowledge_base/chatbot_data/procedure_data.json"
)


def load_data():

    if not DATA_PATH.exists():
        return []

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def save_data(data):

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def add_procedure(procedure):

    data = load_data()
    if any(p["title"] == procedure["title"] for p in data):
     print("Skipping duplicate:", procedure["title"])
     return
    data.append(procedure)

    save_data(data)

    print("Procedure added:", procedure["title"])