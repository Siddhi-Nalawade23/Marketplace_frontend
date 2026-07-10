import apiClient from "./client";

export const createOrder = () => apiClient.post("/orders");
export const getOrders = () => apiClient.get("/orders");