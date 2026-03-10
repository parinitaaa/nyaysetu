from .procedure_embeddings import get_procedure_index


def retrieve_procedure_context(query: str, k: int = 1):
    index, model, data = get_procedure_index()

    q_embedding = model.encode([query], convert_to_numpy=True)
    _, indices = index.search(q_embedding, k)

    top_procedures = []
    for i in indices[0]:
        item = data[i]
        formatted = f"""
Title: {item['title']}
Category: {item['category']}
Summary: {item['summary']}

Steps:
{chr(10).join([f"{idx+1}. {step}" for idx, step in enumerate(item.get('steps', []))])}

Documents Required:
{chr(10).join([f"- {doc}" for doc in item.get('documentsRequired', [])])}

Where to File:
{chr(10).join([f"- {place}" for place in item.get('whereToFile', [])])}

Estimated Time:
{item.get('estimatedTime', 'Not specified')}

Legal Basis:
{chr(10).join([f"- {law}" for law in item.get('legalBasis', [])])}
"""
        top_procedures.append(formatted.strip())

    return "\n\n".join(top_procedures)