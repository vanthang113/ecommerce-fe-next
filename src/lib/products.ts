import fetchAPI from "./api";

export async function getProducts(queryParams?: string) {
  const url = queryParams ? `/products?${queryParams}` : "/products";
  return fetchAPI(url, { method: "GET" });
}

export async function getProductById(id: string) {
  return fetchAPI(`/products/${id}`, { method: "GET" });
}
