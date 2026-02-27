from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

DB_PATH = "backend/chatbot/chroma_db"

def get_rag_chain():
    # 1️⃣ Embeddings
    embeddings = OllamaEmbeddings(model="mxbai-embed-large")

    # 2️⃣ Vector DB
    vectorstore = Chroma(
        persist_directory=DB_PATH,
        embedding_function=embeddings
    )

    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    # 3️⃣ LLM
    llm = OllamaLLM(model="llama3.1:8b")

    # 4️⃣ Prompt (LEGAL SAFE)
    prompt = ChatPromptTemplate.from_template(
        """
        You are NyaySetu, a legal assistant for Indian law.
        Answer strictly using the context below.
        If the answer is not present, say "I do not have enough information."

        Context:
        {context}

        Question:
        {question}

        Answer:
        """
    )

    # 5️⃣ RAG Chain (modern LangChain)
    rag_chain = (
        {
            "context": retriever,
            "question": RunnablePassthrough()
        }
        | prompt
        | llm
    )

    return rag_chain