import apiClient from "./client";

export const createOrder = (shippingDetails) => apiClient.post("/orders", shippingDetails);
export const getOrders = () => apiClient.get("/orders");