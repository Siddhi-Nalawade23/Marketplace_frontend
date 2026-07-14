import apiClient from "./client";

export const signup = (name, email, password, passwordConfirmation, role) =>
  apiClient.post("/signup", {
    user: { name, email, password, password_confirmation: passwordConfirmation, role },
  });

export const login = (email, password) =>
  apiClient.post("/login", { user: { email, password } });