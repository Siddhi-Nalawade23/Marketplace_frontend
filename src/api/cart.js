import apiClient from "./client";

export const getCartItems = () => apiClient.get("/cart_items");

export const addToCart = (productId, quantity = 1) =>
  apiClient.post("/cart_items", { product_id: productId, quantity });

export const updateCartItem = (id, quantity) =>
  apiClient.patch(`/cart_items/${id}`, { quantity });

export const removeCartItem = (id) => apiClient.delete(`/cart_items/${id}`);