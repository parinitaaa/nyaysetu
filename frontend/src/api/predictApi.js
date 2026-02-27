import API from "./axios";

export const predictCase = async (params) => {
  const response = await API.post("/predict", null, {
    params: params,
  });

  return response.data;
};