import API from "./axios";

export const getOptions = async () => {
  const response = await API.get("/options");
  return response.data;
};