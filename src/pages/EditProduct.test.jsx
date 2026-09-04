import EditProduct from "./EditProduct";
import { render, screen, waitFor,cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach,afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest"
import { getProduct, updateProduct } from "../api/products";
import { getCategories } from "../api/adminProducts";
import { isSeller } from "../api/authHelpers";

afterEach(()=>{
    cleanup()
})
const mockNavigate = vi.fn();

vi.mock("../api/products", () => ({
    getProduct: vi.fn(),
    updateProduct: vi.fn(),
}));

vi.mock("../api/adminProducts", () => ({
    getCategories: vi.fn(),
}));

vi.mock("../api/authHelpers", () => ({
    isSeller: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: "1" }),
    };
});

describe("EditProduct page", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        isSeller.mockReturnValue(true);

        getProduct.mockResolvedValue({
            data: {
                id: 1,
                name: "Laptop",
                description: "Gaming laptop",
                price: 50000,
                stock: 10,
                category_id: 2,
                image_url: "laptop.jpg",
            },
        });

        getCategories.mockResolvedValue({
            data: [
                { id: 1, name: "Electronics" },
                { id: 2, name: "Computers" },
            ],
        });

        updateProduct.mockResolvedValue({});
    });

    it("redirects non-seller users to home", () => {
        isSeller.mockReturnValue(false);

        render(
            <MemoryRouter>
                <EditProduct />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("loads and displays product details and categories", async () => {
        render(
            <MemoryRouter>
                <EditProduct />
            </MemoryRouter>
        );

        expect(screen.getByText("Loading...")).toBeInTheDocument();

        expect(await screen.findByDisplayValue("Laptop")).toBeInTheDocument();
        expect(
            screen.getByDisplayValue("Gaming laptop")
        ).toBeInTheDocument();

        expect(screen.getByDisplayValue("50000")).toBeInTheDocument();
        expect(screen.getByDisplayValue("10")).toBeInTheDocument();

        expect(screen.getByRole("option", { name: "Electronics" }))
            .toBeInTheDocument();

        expect(screen.getByRole("option", { name: "Computers" }))
            .toBeInTheDocument();
    });

    it("allows seller to edit product details", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <EditProduct />
            </MemoryRouter>
        );

        const nameInput = await screen.findByDisplayValue("Laptop");
        const priceInput = screen.getByDisplayValue("50000");

        await user.clear(nameInput);
        await user.type(nameInput, "Updated Laptop");

        await user.clear(priceInput);
        await user.type(priceInput, "60000");

        expect(nameInput).toHaveValue("Updated Laptop");
        expect(priceInput).toHaveValue(60000);
    });

    it("updates the product and navigates to home", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <EditProduct />
            </MemoryRouter>
        );

        const nameInput = await screen.findByDisplayValue("Laptop");

        await user.clear(nameInput);
        await user.type(nameInput, "Updated Laptop");

        await user.click(
            screen.getByRole("button", { name: "Save Changes" })
        );

        await waitFor(() => {
            expect(updateProduct).toHaveBeenCalledWith("1", {
                name: "Updated Laptop",
                description: "Gaming laptop",
                price: 50000,
                stock: 10,
                category_id: 2,
                image_url: "laptop.jpg",
            });
        });

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("shows an error when updating the product fails", async () => {
        const user = userEvent.setup();

        updateProduct.mockRejectedValue({
            response: {
                data: {
                    errors: ["Price must be greater than 0"],
                },
            },
        });

        render(
            <MemoryRouter>
                <EditProduct />
            </MemoryRouter>
        );

        await screen.findByDisplayValue("Laptop");

        await user.click(
            screen.getByRole("button", { name: "Save Changes" })
        );

        expect(
            await screen.findByText("Price must be greater than 0")
        ).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalledWith("/");
    });
});
