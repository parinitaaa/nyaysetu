import API from "./axios";

export const askQuestion = async (question) => {
  const response = await API.post("/chatbot/ask", {
    question,
  });

  return response.data;
};