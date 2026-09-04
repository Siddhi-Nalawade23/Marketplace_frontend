import Signup from "./Signup";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { getProducts, deleteProduct } from "../api/products";
import { isSeller } from "../api/authHelpers";
import { use } from "react";
import { TruckElectric } from "lucide-react";
beforeEach(() => {
    vi.clearAllMocks();
});
afterEach(() => {
    cleanup();
});
import { login } from "../api/auth";
vi.mock("../api/auth", () => ({
    signup: vi.fn(),
}));


describe("Signup page", () => {

    it("renders signup page", () => {
        render(
            <MemoryRouter>
                <Signup />
            </MemoryRouter>
        );
        expect(screen.getByText("Buy what you need, or start selling in minutes.")).toBeInTheDocument();
        expect(screen.getByText("Create your account")).toBeInTheDocument();
    });
    it("should display input fields and labels", () => {
        render(
            <MemoryRouter>
                <Signup />
            </MemoryRouter>
        );
        // name field 
        expect(screen.getByLabelText("Name")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Your full name", { exact: true })).toBeInTheDocument();
        // Email field
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText("you@company.com", { exact: true })).toBeInTheDocument();
        // password
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        // confirm password 
        expect(screen.getByLabelText("Confirm")).toBeInTheDocument();


    });
});