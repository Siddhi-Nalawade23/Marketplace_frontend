import { describe, it, expect, vi } from "vitest";
import apiClient from "./client";
import { createOrder, getOrders } from "./orders";

vi.mock("./client");
describe("orderapi API", () => {
      it("calls POST /products when creating a order", async () => {
            const shippingDetails = {
                  shipping_name: "Siddhi",
                  shipping_phone: "9876543210",
                  shipping_address: "Pune",
                  shipping_city: "Pune",
                  shipping_state: "Maharashtra",
                  shipping_pincode: "411001"
            }
            await createOrder(shippingDetails);
            expect(apiClient.post).toHaveBeenCalledWith(
                  "/orders",
                  shippingDetails
            );
      });
});

describe("orderapi API", () => {
      it("calls get orders ", async () => {

            await getOrders();
            expect(apiClient.get).toHaveBeenCalledWith(
                  "/orders"
            );
      });
});