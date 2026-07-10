import apiClient from "./client";

export const signup = (name, email, password, passwordConfirmation) =>
  apiClient.post("/signup", {
    user: {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    },
  });

export const login = (email, password) =>
  apiClient.post("/login", {
    user: { email, password },
  });