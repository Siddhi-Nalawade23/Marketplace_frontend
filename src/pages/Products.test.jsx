import Products from "./Products";
import {render,screen,} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {describe,it,expect,vi,beforeEach,} from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { getProducts, deleteProduct } from "../api/products";
import { isSeller } from "../api/authHelpers";
import { use } from "react";

vi.mock("../api/products", () => ({
    getProducts: vi.fn(),
    deleteProduct: vi.fn(),
}));

vi.mock("../api/authHelpers", () => ({
    isSeller: vi.fn(),
}));
vi.mock("../components/ProductCard", () => ({
    default: vi.fn(({ product, showSellerControls, onDelete }) => (
        <div>
            <p>{product.name}</p>

            {showSellerControls && (
                <button onClick={onDelete}>
                    Delete {product.name}
                </button>
            )}
        </div>
    )),

}));

describe("products page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        isSeller.mockReturnValue(false);
        getProducts.mockResolvedValue({
            data: [],
        });
    });

    it("renders loading state initially", () => {
        getProducts.mockImplementation(
            () => new Promise(() => { })
        );

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        expect(
            document.querySelectorAll(
                ".products__skeleton-card"
            )
        ).toHaveLength(8);
    });

    it("renders heading as Marketplace", async () => {
        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        expect(
            await screen.findByText("Marketplace")
        ).toBeInTheDocument();
    });
    it("renders product details page when user click on product",async()=>{
        isSeller.mockReturnValue(true);
        render(
            <MemoryRouter>
                <Products/>
            </MemoryRouter>
        )
        const user=userEvent.setup();
        await user.click(button);
        expect(
            screen.getByText("").toBeInTheDocument()
        )
    })
});

