import { describe, it, vi, expect } from "vitest";
import apiClient from "./client";
import { signup, login } from "./auth"

vi.mock("./client");
describe("authapi API", () => {

    it("calls post sign up api", async () => {

        const name = "Test Seller";
        const email = "seller@test.com";
        const password = "password";
        const passwordConfirmation = password;
        const role = "seller";


        await signup(name, email, password, passwordConfirmation, role);
        expect(apiClient.post).toHaveBeenCalledWith(
            "/signup",
            {
                user: {
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                    role
                }
            }
        )
    })
})

describe("authapi API", () => {

    it("calls post Login api", async () => {
        const email = "seller@test.com";
        const password = "password";
        await login(email, password);
        expect(apiClient.post).toHaveBeenCalledWith(
            "/login",
            {
                user: {
                    email,
                    password,
                }
            }
        )
    })
}) 