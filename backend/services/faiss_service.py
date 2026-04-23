import faiss
import numpy as np
from typing import List, Dict, Any
from services.embedding_service import embed_texts

def rank_cases(query: str, cases: List[Dict[str, Any]], top_k: int = 5):
    if not cases:
        return []

    # Combine title + snippet
    texts = [
        (c.get("case_title", "") or "") + " " + (c.get("snippet", "") or "")
        for c in cases
    ]

    case_embeddings = embed_texts(texts)
    query_embedding = embed_texts([query])

    dim = case_embeddings.shape[1]

    index = faiss.IndexFlatL2(dim)
    index.add(np.array(case_embeddings))

    distances, indices = index.search(np.array(query_embedding), top_k)

    ranked = []
    for rank, i in enumerate(indices[0]):
        case = cases[i]
        score = float(distances[0][rank])

# Convert distance → similarity
        similarity = 1 / (1 + score)

        case["similarity_score"] = similarity
        ranked.append(case)

    ranked = sorted(ranked, key=lambda x: x["similarity_score"], reverse=True)
    return ranked 