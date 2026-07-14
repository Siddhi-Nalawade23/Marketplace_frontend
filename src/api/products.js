import apiClient from "./client";

export const getProducts = () => apiClient.get("/products");
export const getProduct = (id) => apiClient.get(`/products/${id}`);
export const updateProduct = (id, product) => apiClient.patch(`/products/${id}`, { product });

export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);