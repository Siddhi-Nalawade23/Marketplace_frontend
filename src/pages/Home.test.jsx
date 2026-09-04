import Home from "./Home";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest"
import { getCurrentUser, isSeller } from "../api/authHelpers";

const mockNavigate = vi.fn();
afterEach(() => {
    cleanup();
})
vi.mock("../api/authHelpers", () => ({
    getCurrentUser: vi.fn(),
    isSeller: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("Home page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderHome = () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
    };

    it("renders buyer home page", () => {
        getCurrentUser.mockReturnValue({
            id: 1,
            name: "John",
            role: "buyer",
        });

        isSeller.mockReturnValue(false);

        renderHome();

        expect(
            screen.getByText("Welcome to Marketplace")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "My Collections",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Get Started",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText("Products")
        ).toBeInTheDocument();

        expect(
            screen.getByText("My Cart")
        ).toBeInTheDocument();
    });

    it("renders seller home page", () => {
        getCurrentUser.mockReturnValue({
            id: 2,
            name: "Seller",
            role: "seller",
        });

        isSeller.mockReturnValue(true);

        renderHome();

        expect(
            screen.getByText("Welcome back, Seller")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Your Storefront",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Quick Actions",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText("Manage your listings")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Add Product")
        ).toBeInTheDocument();

        expect(
            screen.getByText("My Listings")
        ).toBeInTheDocument();
    });

    it("dismisses the welcome banner", async () => {
        const user = userEvent.setup();

        getCurrentUser.mockReturnValue({
            id: 1,
            name: "John",
            role: "buyer",
        });

        isSeller.mockReturnValue(false);

        renderHome();

        expect(
            screen.getByText("Welcome to Marketplace")
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", {
                name: "Dismiss welcome banner",
            })
        );

        expect(
            screen.queryByText("Welcome to Marketplace")
        ).not.toBeInTheDocument();
    });

   it("navigates buyer to Products when Products is clicked", async () => {
    const user = userEvent.setup();

    isSeller.mockReturnValue(false);

    render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    );

    await user.click(
        screen.getByRole("button", {
            name: /^Products/,
        })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/products");
});

    it("navigates buyer to Cart when My Cart is clicked", async () => {
        const user = userEvent.setup();

        getCurrentUser.mockReturnValue({
            id: 1,
            role: "buyer",
        });

        isSeller.mockReturnValue(false);

        renderHome();

        await user.click(
            screen.getByRole("button", {
                name: /My Cart/i,
            })
        );

        expect(mockNavigate).toHaveBeenCalledWith("/cart");
    });

    it("navigates seller to Manage Listings", async () => {
        const user = userEvent.setup();

        getCurrentUser.mockReturnValue({
            id: 2,
            name: "Seller",
            role: "seller",
        });

        isSeller.mockReturnValue(true);

        renderHome();

        await user.click(
            screen.getByRole("button", {
                name: /Manage your listings/i,
            })
        );

        expect(mockNavigate).toHaveBeenCalledWith(
            "/admin/products"
        );
    });

    it("does not show seller-specific actions for buyer", () => {
        getCurrentUser.mockReturnValue({
            id: 1,
            name: "John",
            role: "buyer",
        });

        isSeller.mockReturnValue(false);

        renderHome();

        expect(
            screen.queryByText("Manage your listings")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText("Add Product")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText("My Listings")
        ).not.toBeInTheDocument();
    });
});
