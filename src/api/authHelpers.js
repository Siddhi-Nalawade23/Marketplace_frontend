export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isSeller = () => {
  const user = getCurrentUser();
  return user?.role === "seller";
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};