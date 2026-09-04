import AddProduct from "./AddProduct";
import { render, screen, waitFor,  cleanup, } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach,afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import { createProduct, getCategories } from "../api/adminProducts";
import { isSeller } from "../api/authHelpers";

const mockNavigate = vi.fn();

vi.mock("../api/adminProducts", () => ({
    createProduct: vi.fn(),
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
    };
});
afterEach(() => {
    cleanup();
});
describe("AddProduct page", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        isSeller.mockReturnValue(true);

        getCategories.mockResolvedValue({
            data: [
                { id: 1, name: "Electronics" },
                { id: 2, name: "Clothing" },
            ],
        });

        createProduct.mockResolvedValue({});
    });

    it("redirects non-seller users to home", () => {
        isSeller.mockReturnValue(false);

        render(
            <MemoryRouter>
                <AddProduct />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("renders the add product form and categories", async () => {
        render(
            <MemoryRouter>
                <AddProduct />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: "Add Product" }))
            .toBeInTheDocument();

        expect(
            screen.getByLabelText("Product Name")
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText("Description")
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText("Price")
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText("Stock")
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText("Category")
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText("Image URL (optional)")
        ).toBeInTheDocument();

        expect(
            await screen.findByRole("option", { name: "Electronics" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", { name: "Clothing" })
        ).toBeInTheDocument();
    });

    it("allows seller to fill the product form", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <AddProduct />
            </MemoryRouter>
        );

        await screen.findByRole("option", { name: "Electronics" });

        await user.type(
            screen.getByLabelText("Product Name"),
            "Laptop"
        );

        await user.type(
            screen.getByLabelText("Description"),
            "Gaming laptop"
        );

        await user.type(
            screen.getByLabelText("Price"),
            "50000"
        );

        await user.type(
            screen.getByLabelText("Stock"),
            "10"
        );

        await user.selectOptions(
            screen.getByLabelText("Category"),
            "1"
        );

        await user.type(
            screen.getByLabelText("Image URL (optional)"),
            "laptop.jpg"
        );

        expect(
            screen.getByLabelText("Product Name")
        ).toHaveValue("Laptop");

        expect(
            screen.getByLabelText("Description")
        ).toHaveValue("Gaming laptop");

        expect(
            screen.getByLabelText("Price")
        ).toHaveValue(50000);

        expect(
            screen.getByLabelText("Stock")
        ).toHaveValue(10);

        expect(
            screen.getByLabelText("Category")
        ).toHaveValue("1");

        expect(
            screen.getByLabelText("Image URL (optional)")
        ).toHaveValue("laptop.jpg");
    });

    it("creates the product and navigates to home", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <AddProduct />
            </MemoryRouter>
        );

        await screen.findByRole("option", { name: "Electronics" });

        await user.type(
            screen.getByLabelText("Product Name"),
            "Laptop"
        );

        await user.type(
            screen.getByLabelText("Description"),
            "Gaming laptop"
        );

        await user.type(
            screen.getByLabelText("Price"),
            "50000"
        );

        await user.type(
            screen.getByLabelText("Stock"),
            "10"
        );

        await user.selectOptions(
            screen.getByLabelText("Category"),
            "1"
        );

        await user.type(
            screen.getByLabelText("Image URL (optional)"),
            "laptop.jpg"
        );

        await user.click(
            screen.getByRole("button", { name: "Add Product" })
        );

        await waitFor(() => {
            expect(createProduct).toHaveBeenCalledWith({
                name: "Laptop",
                description: "Gaming laptop",
                price: 50000,
                stock: 10,
                category_id: "1",
                image_url: "laptop.jpg",
            });
        });

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("shows an error when product creation fails", async () => {
        const user = userEvent.setup();

        createProduct.mockRejectedValue({
            response: {
                data: {
                    errors: ["Price must be greater than 0", "Stock is invalid"],
                },
            },
        });

        render(
            <MemoryRouter>
                <AddProduct />
            </MemoryRouter>
        );

        await screen.findByRole("option", { name: "Electronics" });

        await user.type(
            screen.getByLabelText("Product Name"),
            "Laptop"
        );

        await user.type(
            screen.getByLabelText("Price"),
            "50000"
        );

        await user.type(
            screen.getByLabelText("Stock"),
            "10"
        );

        await user.selectOptions(
            screen.getByLabelText("Category"),
            "1"
        );

        await user.click(
            screen.getByRole("button", { name: "Add Product" })
        );

        expect(
            await screen.findByText(
                "Price must be greater than 0, Stock is invalid"
            )
        ).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalledWith("/");
    });
});

