import apiClient from "./client";

export const createProduct = (product) =>
  apiClient.post("/products", { product });

export const getCategories = () => apiClient.get("/categories");