from .embeddings import get_index


def retrieve_context(query: str, k: int = 3):
    index, model, data = get_index()

    q_embedding = model.encode([query], convert_to_numpy=True)
    _, indices = index.search(q_embedding, min(k, len(data)))

    context = []
    for i in indices[0]:
        if 0 <= i < len(data):
            context.append(
                f"Q: {data[i]['question']}\nA: {data[i]['answer']}"
            )

    return "\n\n".join(context)