import React from "react";
import { describe, it, expect, vi, beforeEach,afterEach  } from "vitest";
import Profile from "./Profile";
import "@testing-library/jest-dom/vitest"
import { render, screen,cleanup  } from "@testing-library/react";
import * as authHelpers from "../api/authHelpers";
import userEvent from "@testing-library/user-event";
import { getCurrentUser, isSeller, logout } from "../api/authHelpers";
import { useNavigate } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("../api/authHelpers", () => ({
    getCurrentUser: vi.fn(),
    isSeller: vi.fn(),
    logout: vi.fn(),
}));
vi.mock("react-router-dom", () => ({
    Link: ({ children, to, ...props }) => (
        <a href={to} {...props}>
            {children}
        </a>
    ),
    useNavigate: () => mockNavigate,
}));
describe("Profile", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })
    afterEach(() => {
    cleanup();
});

    it("opens dropdown when profile button is clicked", async () => {
        const user = userEvent.setup();
        getCurrentUser.mockReturnValue(null);
        render(<Profile />)

        await user.click(
            screen.getByRole("button", { name: /account/i })
        );
        expect(
            screen.getByRole("link", { name: "Log in" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Sign up" })
        ).toBeInTheDocument();
    });
    // close dropdown when profile buttom get clicked again
    it("close dropdown when profile button is clicked", async () => {
        const user = userEvent.setup();
        getCurrentUser.mockReturnValue(null);
        render(<Profile />)
        const button = screen.getByRole("button", {
            name: /account/i,
        });
        await user.click(button);
        expect(
            screen.queryByRole("link", { name: "Log in" })
        ).toBeInTheDocument();
        await user.click(button);
        expect(
            screen.queryByRole("link", { name: "Log in" })
        ).not.toBeInTheDocument();
    });
    // it shows logged-in user's name
    it("shows logged-in user's name", () => {
        getCurrentUser.mockReturnValue({
            name: "Siddhi Nalawade"
        })
        render(<Profile />)
        expect(
            screen.getByRole("button", {
                name: /Siddhi Nalawade/i,
            })
        ).toBeInTheDocument();
    });
    it("shows logged-in initial name", () => {
        getCurrentUser.mockReturnValue({
          name: "Siddhi Nalawade",
        })
        render(<Profile />)
        expect(screen.getByText("SN")).toBeInTheDocument();
    });




})