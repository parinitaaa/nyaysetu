# backend/chatbot/retriever.py

from .embeddings import get_index


def retrieve_context(query: str, k: int = 3):
    index, model, data = get_index()

    q_embedding = model.encode([query])
    _, indices = index.search(q_embedding, k)

    context = []
    for i in indices[0]:
        context.append(
            f"Q: {data[i]['question']}\nA: {data[i]['answer']}"
        )

    return "\n\n".join(context)