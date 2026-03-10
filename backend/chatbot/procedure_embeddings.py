import json
import faiss
from sentence_transformers import SentenceTransformer
from pathlib import Path
import numpy as np

BASE_DIR = Path(__file__).resolve().parent
PROCEDURE_DATA_PATH = BASE_DIR / "../knowledge_base/chatbot_data/procedure_data.json"

_procedure_index = None
_procedure_model = None
_procedure_data = None


def build_procedure_index():
    print("📦 Loading procedure embedding model...")
    model = SentenceTransformer(
        "all-MiniLM-L6-v2",
        device="cpu"
    )

    with open(PROCEDURE_DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    texts = []
    for item in data:
        combined_text = f"""
Title: {item['title']}
Category: {item['category']}
Summary: {item['summary']}
Keywords: {', '.join(item.get('keywords', []))}
Steps: {' '.join(item.get('steps', []))}
Documents: {', '.join(item.get('documentsRequired', []))}
Where to File: {', '.join(item.get('whereToFile', []))}
Legal Basis: {', '.join(item.get('legalBasis', []))}
"""
        texts.append(combined_text.strip())

    print(f"🔢 Encoding {len(texts)} procedures...")
    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        batch_size=16,
        show_progress_bar=True
    )

    embeddings = np.array(embeddings, dtype="float32")

    print("📐 Building procedure FAISS index...")
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)

    print("✅ Procedure index ready")
    return index, model, data


def get_procedure_index():
    global _procedure_index, _procedure_model, _procedure_data

    if _procedure_index is None:
        _procedure_index, _procedure_model, _procedure_data = build_procedure_index()

    return _procedure_index, _procedure_model, _procedure_data