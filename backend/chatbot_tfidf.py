import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load JSON dataset
with open("knowledge_base/chatbot_data/legal_chatbot_data.json", "r", encoding="utf-8") as f:
    chatbot_data = json.load(f)

# Extract all questions
questions = [item["question"] for item in chatbot_data]

# Create TF-IDF matrix
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(questions)

# Function to find the most similar question
def search(query):
    query_vec = vectorizer.transform([query])
    scores = cosine_similarity(query_vec, tfidf_matrix).flatten()
    best_idx = scores.argmax()
    best_score = float(scores[best_idx])
    best_answer = chatbot_data[best_idx]["answer"]
    best_category = chatbot_data[best_idx]["category"]
    return best_answer, best_category, best_score

# Command-line chatbot interface
def start_chat():
    print("Legal Chatbot 🤖 (type 'exit' to quit)")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            print("Chatbot: Goodbye!")
            break
        
        answer, category, score = search(user_input)
        
        if score < 0.2:
            # Optional threshold to avoid low similarity matches
            print("Chatbot: Sorry, I don't have an answer for that yet.")
        else:
            print(f"Chatbot ({category}): {answer} [score: {score:.2f}]")

if __name__ == "__main__":
    start_chat()