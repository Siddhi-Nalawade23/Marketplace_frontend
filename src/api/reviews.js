import apiClient from "./client";

export const getReviews = (productId) => apiClient.get(`/products/${productId}/reviews`);
export const createReview = (productId, review) =>
  apiClient.post(`/products/${productId}/reviews`, { review });
export const updateReview = (productId, reviewId, review) =>
  apiClient.patch(`/products/${productId}/reviews/${reviewId}`, { review });

export const createReply = (reviewId, comment) =>
  apiClient.post(`/reviews/${reviewId}/reply`, { review_reply: { comment } });
export const updateReply = (reviewId, comment) =>
  apiClient.patch(`/reviews/${reviewId}/reply`, { review_reply: { comment } });