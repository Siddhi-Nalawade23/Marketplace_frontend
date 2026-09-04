import { describe, it, expect, vi } from "vitest";
import apiClient from "./client";
import { getCartItems, addToCart, updateCartItem, removeCartItem } from "./cart";


vi.mock("./client")
describe("cartapi API", () => {

    it("calls get cart item api", async () => {

        await getCartItems();
        expect(apiClient.get).toHaveBeenCalledWith(
            "/cart_items"
        )
    })

})

describe("cartapi API", () => {

    it("calls delete cart item api", async () => {
        const id = 1;
        await removeCartItem(id);
        expect(apiClient.delete).toHaveBeenCalledWith(
            `/cart_items/${id}`
        )
    })

})

describe("cartapi API", () => {

    it("calls add to cart api", async () => {
        const product_Id = 1;
        const quantity = 5;
        await addToCart(product_Id, quantity);
        expect(apiClient.post).toHaveBeenCalledWith(
            "/cart_items",
            {
                product_id: product_Id,
                quantity: quantity
            }
        )
    })

})
// update cart item api 
describe("cartapi API", () => {

    it("calls update to cart api", async () => {
        const id = 1;
        const quantity = 5;
        const product_Id=1;
        await updateCartItem(product_Id, quantity);
        expect(apiClient.patch).toHaveBeenCalledWith(
            `/cart_items/${id}`,
             {quantity}
            
        )
    })

})