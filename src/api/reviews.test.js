import { describe, expect, it, vi, beforeEach } from "vitest";
import apiClient from "./client";
import { getReviews, createReview, updateReview, createReply, updateReply } from "./reviews"

vi.mock("./client");

describe("review API ", () => {
    it("calls get all Reviews", async () => {
        const productId = 1;

        await getReviews(productId);
        expect(apiClient.get).toHaveBeenCalledWith(
            `/products/${productId}/reviews`
        )
    })
})

describe("review API ", () => {
    it("calls get all Reviews", async () => {
        const productId = 1;
        const review = "nice";

        await createReview(productId, review);
        expect(apiClient.post).toHaveBeenCalledWith(
            `/products/${productId}/reviews`,
            {
                review: review
            }
        )
    })
})

describe("review API ", () => {
    it("calls update all Reviews", async () => {
        const productId = 1;
        const review = "nice";
        const reviewId = 1;
        await updateReview(productId, reviewId, review);
        expect(apiClient.patch).toHaveBeenCalledWith(
            `/products/${productId}/reviews/${reviewId}`,
            { review: review }
        )
    })
})

describe("review API ", () => {
    it("calls update all Reviews", async () => {
        const comment = "nice";
        const reviewId = 1;
        await createReply(reviewId, comment);
        expect(apiClient.post).toHaveBeenCalledWith(
            `/reviews/${reviewId}/reply`,
            {
                review_reply:{
                  comment:comment
                } 
            }
        )
    })
})

describe("review API ", () => {
    it("calls update all Reviews", async () => {
        const comment = "nice";
        const reviewId = 1;
        await updateReply(reviewId, comment);
        expect(apiClient.patch).toHaveBeenCalledWith(
            `/reviews/${reviewId}/reply`,
            {
                review_reply:{
                  comment:comment
                } 
            }
        )
    })
})

