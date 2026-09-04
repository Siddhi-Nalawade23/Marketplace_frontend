import ProductDetail from "./ProductDetail";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import { getProduct } from "../api/products";
import { getReviews, createReview,updateReview, createReply,} from "../api/reviews";
import { addToCart } from "../api/cart";
import { getCurrentUser } from "../api/authHelpers";
import { useToast } from "../components/Toast";

vi.mock("../api/products", () => ({
    getProduct: vi.fn(),
}));

vi.mock("../api/reviews", () => ({
    getReviews: vi.fn(),
    createReview: vi.fn(),
    updateReview: vi.fn(),
    createReply: vi.fn(),
    updateReply: vi.fn(),
}));

vi.mock("../api/cart", () => ({
    addToCart: vi.fn(),
}));
vi.mock("../api/authHelpers", () => ({
    getCurrentUser: vi.fn(),
}));
vi.mock("../components/Toast", () => ({
    useToast: vi.fn(),
}));
afterEach(() => {
    cleanup();
});
const renderProductDetail = () => {
    render(
        <MemoryRouter initialEntries={["/products/1"]}>
            <Routes>
                <Route path="/products/:id" element={<ProductDetail />} />
            </Routes>
        </MemoryRouter>
    );
};
describe("ProductDetail", () => {
    const product = {
        id: 1,
        name: "Laptop",
        description: "Powerful laptop",
        price: 50000,
        stock: 10,
        image_url: "laptop.jpg",
        user_id: 2,
    };
    beforeEach(() => {
        vi.clearAllMocks();

        getCurrentUser.mockReturnValue({
            id: 5,
            role: "buyer",
        });
        getProduct.mockResolvedValue({
            data: product,
        });
        getReviews.mockResolvedValue({
            data: [],
        });
        useToast.mockReturnValue(vi.fn());
    });

    it("shows loading state while product is loading", () => {
        getProduct.mockReturnValue(new Promise(() => {}));
        renderProductDetail();
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
    it("renders product details after loading", async () => {
        renderProductDetail();
        expect(
            await screen.findByRole("heading", { name: "Laptop" })
        ).toBeInTheDocument();

        expect(screen.getByText("Powerful laptop")).toBeInTheDocument();
        expect(screen.getByText("₹50000")).toBeInTheDocument();
        expect(screen.getByText("In Stock")).toBeInTheDocument();
    });
    it("shows sold out state when product is out of stock", async () => {
        getProduct.mockResolvedValue({
            data: {
                ...product,
                stock: 0,
            },
        });
        renderProductDetail();
        const button = await screen.findByRole("button", {
            name: "Sold Out",
        });
        expect(button).toBeDisabled();
    });
    it("adds product to cart", async () => {
        const user = userEvent.setup();
        const toast = vi.fn();
        useToast.mockReturnValue(toast);
        addToCart.mockResolvedValue({});
        renderProductDetail();
        await screen.findByRole("heading", { name: "Laptop" });
        await user.click(
            screen.getByRole("button", { name: "Add to Cart" })
        );
        expect(addToCart).toHaveBeenCalledWith(1, 1);

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith(
                "Laptop added to cart",
                "success"
            );
        });
    });

    it("shows error toast when adding product to cart fails", async () => {
        const user = userEvent.setup();
        const toast = vi.fn();

        useToast.mockReturnValue(toast);

        addToCart.mockRejectedValue({
            response: {
                status: 401,
            },
        });

        renderProductDetail();

        await screen.findByRole("heading", { name: "Laptop" });

        await user.click(
            screen.getByRole("button", { name: "Add to Cart" })
        );

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith(
                "Please log in first",
                "error"
            );
        });
    });

    it("allows logged-in buyer to post a review", async () => {
        const user = userEvent.setup();
        const toast = vi.fn();

        useToast.mockReturnValue(toast);
        createReview.mockResolvedValue({});

        renderProductDetail();

        await screen.findByRole("heading", { name: "Laptop" });

        const textarea = screen.getByPlaceholderText(
            "Share your thoughts about this product..."
        );

        await user.type(textarea, "Great laptop!");

        await user.click(
            screen.getByRole("button", { name: "Post Review" })
        );

        expect(createReview).toHaveBeenCalledWith("1", {
            rating: 5,
            comment: "Great laptop!",
        });

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith(
                "Review posted",
                "success"
            );
        });
    });

    it("shows existing review and allows user to update it", async () => {
        const user = userEvent.setup();
        const toast = vi.fn();

        useToast.mockReturnValue(toast);

        getReviews.mockResolvedValue({
            data: [
                {
                    id: 10,
                    rating: 4,
                    comment: "Good laptop",
                    user: {
                        id: 5,
                        name: "John",
                    },
                },
            ],
        });

        updateReview.mockResolvedValue({});

        renderProductDetail();

        await screen.findByText("Good laptop");

        const textarea = screen.getByPlaceholderText(
            "Share your thoughts about this product..."
        );

        await user.clear(textarea);
        await user.type(textarea, "Excellent laptop!");

        await user.click(
            screen.getByRole("button", { name: "Update Review" })
        );

        expect(updateReview).toHaveBeenCalledWith("1", 10, {
            rating: 4,
            comment: "Excellent laptop!",
        });

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith(
                "Review updated",
                "success"
            );
        });
    });

   
});

