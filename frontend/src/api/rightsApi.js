import API from "./axios";

export const getCategories = async () => {
  const response = await API.get("/rights/categories");
  return response.data;
};

export const getRightsByCategory = async (slug) => {
  const response = await API.get(`/rights/${slug}`);
  return response.data;
};

export const getSingleRight = async (categorySlug, rightSlug) => {
  const response = await API.get(
    `/rights/${categorySlug}/${rightSlug}`
  );
  return response.data;
};