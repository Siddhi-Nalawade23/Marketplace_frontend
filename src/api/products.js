import apiClient from "./client";

export const getProducts = (search) => apiClient.get("/products", { params: search ? { search } : {} });
export const getProduct = (id) => apiClient.get(`/products/${id}`);
export const updateProduct = (id, product) => apiClient.patch(`/products/${id}`, { product });

export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);