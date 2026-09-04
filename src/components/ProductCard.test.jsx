import { render, screen, cleanup } from '@testing-library/react';
import ProductCard from './ProductCard';
import { getCurrentUser, isSeller, logout } from '../api/authHelpers';
import { useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import { useToast } from "./Toast";
import { addToCart } from "../api/cart";

vi.mock('../api/authHelpers', () => ({
    getCurrentUser: vi.fn(),
    isSeller: vi.fn(),
    logout: vi.fn(),
}));
vi.mock("./Toast", () => ({
    useToast: vi.fn(),
}));
vi.mock("../api/cart", () => ({
    addToCart: vi.fn(),
}));

const user = userEvent.setup();
const product = {
    id: 1,
    name: "Test Product",
    description: "This is a test product",
    price: 100,
    stock: 10,
    image_url: "https://example.com/test-product.jpg",
    seller_id: 1,
}
const renderProductCard = (props = {}) => {
    return render(
        <MemoryRouter>
            <ProductCard product={product} {...props} />
        </MemoryRouter>
    );
}


afterEach(() => {
    cleanup();
});
const stock = 3;

describe("ProductCard", () => {

    it("renders product card ", () => {
        useToast.mockReturnValue(vi.fn());

        renderProductCard();
        expect(screen.getByRole("heading", { name: "Test Product" })).toBeInTheDocument();
        expect(screen.getByText("This is a test product")).toBeInTheDocument();
        expect(screen.getByText("₹100")).toBeInTheDocument();

    })
    // it("renders sellers options when Role is seller",()=>{
    //     isSeller.mockReturnValue(true);

    //     renderProductCard();
    //     expect(
    //         screen.getByRole("link",{name:"Edit"})
    //     ).toBeInTheDocument();
    //     expect(
    //         screen.getByRole("button",{name:"Delete"})
    //     )

    // })
    it("show in stock when produt is in stock", () => {
        renderProductCard();
        expect(
            screen.getByText(("In Stock"), { exact: true })
        ).toBeInTheDocument();
    })

    it("shows add to cart option to the buyer", () => {
        isSeller.mockReturnValue(false);
        renderProductCard();
        expect(
            screen.getByRole("button", { name: "Add to Cart" })
        ).toBeInTheDocument();
    })
    it("shows add to cart option to the buyer", () => {
        renderProductCard({
            showSellerControls: false,
        });

        expect(
            screen.getByRole("button", { name: "Add to Cart" })
        ).toBeInTheDocument();
    })
    it("shows seller controls to the seller", () => {
        renderProductCard({
            showSellerControls: true,
            onDelete: vi.fn()
        });

        expect(
            screen.getByRole("link", { name: "Edit" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Delete" })
        ).toBeInTheDocument();
    });
    it("dont shows seller controls to the buyer", () => {
        renderProductCard({
            showSellerControls: false,
            onDelete: vi.fn()
        });

        expect(
            screen.queryByRole("button", { name: "Edit" })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Delete" })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Add to Cart" })
        ).toBeInTheDocument();
    });

    it("renders when few items in the stock ", () => {
        renderProductCard({
            product: { stock: 3 }
        })
        expect(
            screen.getByText(`Only 3 left`, { exact: true })
        ).toBeInTheDocument();
    })

    it("renders not in stock ", () => {
        renderProductCard({
            product: { stock: 0 }
        })
        expect(
            screen.getByText(`Sold Out`, { exact: true })
        ).toBeInTheDocument();
    })
    it("adds product to cart and shows success toast", async () => {
        const user = userEvent.setup();
        const showToast = vi.fn();

        useToast.mockReturnValue(showToast);
        addToCart.mockResolvedValue();

        renderProductCard({
            showSellerControls: false,
        });

        await user.click(
            screen.getByRole("button", { name: "Add to Cart" })
        );

        expect(addToCart).toHaveBeenCalledWith(1, 1);

        expect(showToast).toHaveBeenCalledWith(
            "Test Product added to cart",
            "success"
        );
    });
});