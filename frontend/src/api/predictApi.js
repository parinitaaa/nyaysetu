import axios from "./axios";

export const predictCase = async (formData) => {
  const response = await axios.post("/predict", formData);
  return response.data;
};