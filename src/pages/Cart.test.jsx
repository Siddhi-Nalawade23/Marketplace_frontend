import Cart from "./Cart";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest"
import {
    getCartItems,
    updateCartItem,
    removeCartItem,
} from "../api/cart";
import { createOrder } from "../api/orders";
import { useToast } from "../components/Toast";
afterEach(() => {
    cleanup();
});
vi.mock("../api/cart", () => ({
    getCartItems: vi.fn(),
    updateCartItem: vi.fn(),
    removeCartItem: vi.fn(),
}));

vi.mock("../api/orders", () => ({
    createOrder: vi.fn(),
}));

vi.mock("../components/Toast", () => ({
    useToast: vi.fn(),
}));

vi.mock("../components/AddressModal", () => ({
    default: ({ onClose, onConfirm }) => (
        <div>
            <p>Address Modal</p>
            <button onClick={onClose}>Close</button>
            <button
                onClick={() =>
                    onConfirm({
                        shipping_name: "Siddhi",
                        shipping_phone: "9876543210",
                        shipping_address: "Pune",
                    })
                }
            >
                Confirm Address
            </button>
        </div>
    ),
}));

const mockNavigate = vi.fn();
const mockToast = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});
describe("Cart page", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        useToast.mockReturnValue(mockToast);

        getCartItems.mockResolvedValue({
            data: [
                {
                    id: 1,
                    quantity: 2,
                    product: {
                        id: 10,
                        name: "Laptop",
                        price: 50000,
                    },
                },
            ],
        });

        updateCartItem.mockResolvedValue({});
        removeCartItem.mockResolvedValue({});
        createOrder.mockResolvedValue({});
    });

    it("renders cart items and total", async () => {
        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        expect(await screen.findByText("Laptop")).toBeInTheDocument();

        expect(screen.getAllByText("₹100000.00")).toHaveLength(2);
        expect(screen.getAllByText("₹100000.00")).toHaveLength(2);
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("shows empty cart message and allows browsing products", async () => {
        const user = userEvent.setup();

        getCartItems.mockResolvedValue({
            data: [],
        });

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        expect(
            await screen.findByText("Your cart is empty.")
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", { name: "Browse products" })
        );

        expect(mockNavigate).toHaveBeenCalledWith("/products");
    });

    it("increases item quantity", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        await screen.findByText("Laptop");

        await user.click(
            screen.getByRole("button", { name: "Increase quantity" })
        );

        expect(updateCartItem).toHaveBeenCalledWith(1, 3);
    });

    it("decreases item quantity", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        await screen.findByText("Laptop");

        await user.click(
            screen.getByRole("button", { name: "Decrease quantity" })
        );

        expect(updateCartItem).toHaveBeenCalledWith(1, 1);
    });

    it("removes an item from the cart", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        await screen.findByText("Laptop");

        await user.click(
            screen.getByRole("button", { name: "Remove item" })
        );

        expect(removeCartItem).toHaveBeenCalledWith(1);
    });

    it("opens address modal when checkout is clicked", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        await screen.findByText("Laptop");

        await user.click(
            screen.getByRole("button", { name: "Checkout" })
        );

        expect(screen.getByText("Address Modal")).toBeInTheDocument();
    });

    it("creates order and navigates to orders after confirming address", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );
        await screen.findByText("Laptop");
        await user.click(
            screen.getByRole("button", { name: "Checkout" })
        );
        await user.click(
            screen.getByRole("button", { name: "Confirm Address" })
        );
        await waitFor(() => {
            expect(createOrder).toHaveBeenCalledWith({
                shipping_name: "Siddhi",
                shipping_phone: "9876543210",
                shipping_address: "Pune",
            });
        });
        expect(mockToast).toHaveBeenCalledWith(
            "Order placed successfully",
            "success"
        );

        expect(mockNavigate).toHaveBeenCalledWith("/orders");
    });
    it("shows error toast when checkout fails", async () => {
        const user = userEvent.setup();
        createOrder.mockRejectedValue({
            response: {
                data: {
                    error: "Unable to place order",
                },
            },
        });
        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );
        await screen.findByText("Laptop");
        await user.click(
            screen.getByRole("button", { name: "Checkout" })
        );
        await user.click(
            screen.getByRole("button", { name: "Confirm Address" })
        );
        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith(
                "Unable to place order",
                "error"
            );
        });
        expect(mockNavigate).not.toHaveBeenCalledWith("/orders");
    });
});

