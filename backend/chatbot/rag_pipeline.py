from .retriever import retrieve_context
from .procedure_retriever import retrieve_procedure_context
from .generator import generate_answer, generate_procedure_answer
from .intent_classifier import is_procedure_query, is_case_query
from .case_handler import get_similar_cases


def ask_question(question: str):

    # 1️⃣ Procedure queries
    if is_procedure_query(question):

        procedure_context = retrieve_procedure_context(question)

        answer = generate_procedure_answer(
            question,
            procedure_context
        )

        return answer

    # 2️⃣ Similar case queries
    if is_case_query(question):

        cases = get_similar_cases(question)

        return cases

    # 3️⃣ Normal chatbot flow (RAG)

    context = retrieve_context(question)

    answer = generate_answer(question, context)

    return answer