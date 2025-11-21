import fetchAPI from "./api";

export async function getCategories() {
  return fetchAPI("/categories", { method: "GET" });
}

export async function getCategoryById(id: string) {
  return fetchAPI(`/categories/${id}`, { method: "GET" });
}
