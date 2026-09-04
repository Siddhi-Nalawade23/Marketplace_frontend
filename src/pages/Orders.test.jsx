import Orders from "./Orders";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { getOrders } from "../api/orders";

vi.mock("../api/orders", () => ({
    getOrders: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("Orders page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderOrders = () => {
        render(
            <MemoryRouter>
                <Orders />
            </MemoryRouter>
        );
    };

    it("renders Orders heading", () => {
        getOrders.mockResolvedValue({
            data: [],
        });

        renderOrders();

        expect(
            screen.getByRole("heading", { name: "Your Orders" })
        ).toBeInTheDocument();
    });

    it("shows no orders message when orders list is empty", async () => {
        getOrders.mockResolvedValue({
            data: [],
        });

        renderOrders();

        expect(
            await screen.findByText("No orders yet.")
        ).toBeInTheDocument();
    });

    it("renders orders with items and total", async () => {
        getOrders.mockResolvedValue({
            data: [
                {
                    id: 101,
                    status: "Delivered",
                    total: "1500",
                    order_items: [
                        {
                            id: 1,
                            quantity: 2,
                            price: 500,
                            product: {
                                name: "Laptop Bag",
                            },
                        },
                        {
                            id: 2,
                            quantity: 1,
                            price: 500,
                            product: {
                                name: "Mouse",
                            },
                        },
                    ],
                },
            ],
        });

        renderOrders();

        expect(
            await screen.findByText("Order #101")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Delivered")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Laptop Bag × 2 — ₹1000.00")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Mouse × 1 — ₹500.00")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Total: ₹1500.00")
        ).toBeInTheDocument();
    });

    it("redirects to login when API returns 401", async () => {
        getOrders.mockRejectedValue({
            response: {
                status: 401,
            },
        });

        renderOrders();

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });

    it("shows error message when fetching orders fails", async () => {
        getOrders.mockRejectedValue(
            new Error("Failed to fetch orders")
        );

        renderOrders();

        expect(
            await screen.findByText("Failed to fetch orders")
        ).toBeInTheDocument();
    });
});

