const BASE_URL = "http://localhost:8000";

export async function fetchRightsIndex() {
  const response = await fetch(`${BASE_URL}/rights/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch rights index");
  }
  return response.json();
}