import { describe,it,expect,vi } from "vitest";
import apiClient from "./client";
import { createProduct,getCategories } from "./adminProducts";

vi.mock("./client");

describe("adminProducts API",()=>{
     it("calls POST /products when creating a product", async () => {
    const product = {
      name: "Laptop",
      price: 50000,
      stock: 10
    };
    await createProduct(product);
    expect(apiClient.post).toHaveBeenCalledWith(
          "/products",
      { product }  
    );
});
});

describe("adminProducts API",()=>{
     it("calls get /products when getting product", async () => {
    
    await getCategories();
    expect(apiClient.get).toHaveBeenCalledWith(
          "/categories"
    );
});
});