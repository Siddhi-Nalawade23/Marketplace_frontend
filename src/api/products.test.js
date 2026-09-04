import { describe, expect, it, vi, beforeEach } from "vitest";
import apiClient from "./client";
import { getProducts, getProduct, updateProduct, deleteProduct } from "./products"

vi.mock("./client")
beforeEach(() => {
    vi.clearAllMocks();
});
describe("productapi API ", () => {
    it("calls get all products", async () => {
        const id = 1;

        await getProduct(id);
        expect(apiClient.get).toHaveBeenCalledWith(
            `/products/${id}`
        )
    })
})

describe("productapi API ", () => {
    it("calls get searched product list ", async () => {
        const search = "laptop";

        await getProducts(search);
        expect(apiClient.get).toHaveBeenCalledWith(
            "/products",
            {
                params: {
                    search
                }
            }
        );
    })
})

describe("productapi API ", () => {
    it("calls delete product by id", async () => {
        const id = 2;

        await deleteProduct(id);
        expect(apiClient.delete).toHaveBeenCalledWith(
            `/products/${id}`
        )
    })
})
// updateProduct
describe("productapi API ", () => {
    it("calls update Product", async () => {
        const id = 1;
        const product={
            name: "Laptop",
            description: "Gaming laptop",
            price: 50000,
            stock: 10,
            // seller: seller,
            category: "electronics"
        }
        await updateProduct(id,product);
        expect(apiClient.patch).toHaveBeenCalledWith(
            `/products/${id}`,
              {product}
        )
    })
})