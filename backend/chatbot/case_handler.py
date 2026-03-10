from services.kanoon_service import search_similar_cases


def get_similar_cases(query: str):

    cases = search_similar_cases(query)

    if not cases:
        return "No similar cases found."

    response = "Here are some relevant court cases:\n\n"

    for case in cases:

        response += f"Case: {case['title']}\n"
        response += f"Court: {case['court']}\n"
        response += f"Summary: {case['snippet']}\n"
        response += f"Read more: {case['url']}\n\n"

    return response