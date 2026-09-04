import Login from "./Login";
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
    login: vi.fn(),
}));
describe("Login page", () => {

    it("renders login page", () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        // expect(screen.getByRole("heading", { name: "Your whole store, one login away." })).toBeInTheDocument();
        expect(screen.getByText("Track listings, manage orders, and keep the marketplace moving.")).toBeInTheDocument();
        expect(screen.getByText("Welcome back")).toBeInTheDocument();
        expect(screen.getByText("Log in to continue to your dashboard.")).toBeInTheDocument();
    });
    it("should display input fields", () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText("you@company.com", { exact: true })).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    });
    it("shows login action performed by user", async () => {
        login.mockImplementation(() => new Promise(() => { }));

        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        await user.type(
            screen.getByLabelText("Email"),
            "test@example.com"
        );

        await user.type(
            screen.getByLabelText("Password"),
            "password123"
        );

        const loginButton = screen.getByRole("button", {
            name: "Log in",
        });

        await user.click(loginButton);

        expect(
            screen.getByRole("button", { name: "Logging in…" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Logging in…" })
        ).toBeDisabled();
    });
});