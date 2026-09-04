import Search from "./Search";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { getProducts, deleteProduct } from "../api/products";
import { isSeller } from "../api/authHelpers";

vi.mock("../api/products", () => ({
    getProducts: vi.fn(),
    deleteProduct: vi.fn(),
}));

vi.mock("../api/authHelpers", () => ({
    isSeller: vi.fn(),
}));

vi.mock("../components/ProductCard", () => ({
    default: ({ product, showSellerControls, onDelete }) => (
        <div data-testid={`product-${product.id}`}>
            <span>{product.name}</span>
            <span>
                {showSellerControls
                    ? "Seller controls"
                    : "No seller controls"}
            </span>
            <button onClick={onDelete}>Delete</button>
        </div>
    ),
}));

describe("Search page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        isSeller.mockReturnValue(false);
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it("renders search page", () => {
        render(<Search />);
        expect(
            screen.getByRole("heading", {
                name: "Find products across the marketplace",
            })
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(
                "Search for phones, laptops, cameras..."
            )
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Search" })
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Start typing above to search the catalog."
            )
        ).toBeInTheDocument();
    });
    it("searches products when user submits a query", async () => {
        const user = userEvent.setup();
        getProducts.mockResolvedValue({
            data: [
                { id: 1, name: "Laptop" },
                { id: 2, name: "Phone" },
            ],
        });
        render(<Search />);
        const input = screen.getByPlaceholderText(
            "Search for phones, laptops, cameras..."
        );
        await user.type(input, " laptop ");
        await user.click(screen.getByRole("button", { name: "Search" }));
        expect(getProducts).toHaveBeenCalledWith("laptop");
        await waitFor(() => {
            expect(screen.getByText("Laptop")).toBeInTheDocument();
            expect(screen.getByText("Phone")).toBeInTheDocument();
        });
        expect(
            screen.getByText('2 results for "laptop"')
        ).toBeInTheDocument();
    });
    it("does not search when query is empty", async () => {
        const user = userEvent.setup();

        render(<Search />);

        await user.click(
            screen.getByRole("button", { name: "Search" })
        );

        expect(getProducts).not.toHaveBeenCalled();
    });

    it("shows no products message when search returns empty result", async () => {
        const user = userEvent.setup();

        getProducts.mockResolvedValue({
            data: [],
        });

        render(<Search />);

        const input = screen.getByPlaceholderText(
            "Search for phones, laptops, cameras..."
        );

        await user.type(input, "xyz");
        await user.click(screen.getByRole("button", { name: "Search" }));

        await waitFor(() => {
            expect(
                screen.getByText('No products found for "xyz".')
            ).toBeInTheDocument();
        });
    });

    it("shows error when product search fails", async () => {
        const user = userEvent.setup();

        getProducts.mockRejectedValue({
            response: {
                data: {
                    error: "Unable to fetch products",
                },
            },
        });

        render(<Search />);

        const input = screen.getByPlaceholderText(
            "Search for phones, laptops, cameras..."
        );

        await user.type(input, "laptop");
        await user.click(screen.getByRole("button", { name: "Search" }));

        await waitFor(() => {
            expect(
                screen.getByText("Error: Unable to fetch products")
            ).toBeInTheDocument();
        });

        expect(
            screen.getByRole("button", { name: "Retry" })
        ).toBeInTheDocument();
    });

    it("clears search when clear button is clicked", async () => {
        const user = userEvent.setup();

        render(<Search />);

        const input = screen.getByPlaceholderText(
            "Search for phones, laptops, cameras..."
        );

        await user.type(input, "laptop");

        expect(
            screen.getByRole("button", { name: "Clear search" })
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", { name: "Clear search" })
        );

        expect(input).toHaveValue("");

        expect(
            screen.getByText(
                "Start typing above to search the catalog."
            )
        ).toBeInTheDocument();
    });

    it("shows seller controls for sellers", async () => {
        const user = userEvent.setup();

        isSeller.mockReturnValue(true);

        getProducts.mockResolvedValue({
            data: [{ id: 1, name: "Laptop" }],
        });

        render(<Search />);

        const input = screen.getByPlaceholderText(
            "Search for phones, laptops, cameras..."
        );

        await user.type(input, "laptop");
        await user.click(screen.getByRole("button", { name: "Search" }));

        await waitFor(() => {
            expect(
                screen.getByText("Seller controls")
            ).toBeInTheDocument();
        });
    });

    it("deletes product after confirmation", async () => {
        const user = userEvent.setup();

        vi.spyOn(window, "confirm").mockReturnValue(true);

        getProducts.mockResolvedValue({
            data: [{ id: 1, name: "Laptop" }],
        });

        deleteProduct.mockResolvedValue({});

        render(<Search />);

        const input = screen.getByPlaceholderText(
            "Search for phones, laptops, cameras..."
        );

        await user.type(input, "laptop");
        await user.click(screen.getByRole("button", { name: "Search" }));

        await waitFor(() => {
            expect(screen.getByText("Laptop")).toBeInTheDocument();
        });

        await user.click(
            screen.getByRole("button", { name: "Delete" })
        );

        expect(window.confirm).toHaveBeenCalledWith(
            "Delete this product?"
        );

        expect(deleteProduct).toHaveBeenCalledWith(1);

        await waitFor(() => {
            expect(getProducts).toHaveBeenCalledTimes(2);
        });
    });

    it("does not delete product when confirmation is cancelled", async () => {
        const user = userEvent.setup();

        vi.spyOn(window, "confirm").mockReturnValue(false);

        getProducts.mockResolvedValue({
            data: [{ id: 1, name: "Laptop" }],
        });

        render(<Search />);

        const input = screen.getByPlaceholderText(
            "Search for phones, laptops, cameras..."
        );

        await user.type(input, "laptop");
        await user.click(screen.getByRole("button", { name: "Search" }));

        await waitFor(() => {
            expect(screen.getByText("Laptop")).toBeInTheDocument();
        });

        await user.click(
            screen.getByRole("button", { name: "Delete" })
        );

        expect(deleteProduct).not.toHaveBeenCalled();
    });
});