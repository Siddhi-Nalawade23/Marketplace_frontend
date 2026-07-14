import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, isSeller, logout } from "../api/authHelpers";
import "./Style.css";

function Navbar() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        Marketplace
      </Link>
      <div className="navbar__links">
        <Link to="/" className="navbar__link">Products</Link>
        <Link to="/cart" className="navbar__link">Cart</Link>
        <Link to="/orders" className="navbar__link">Orders</Link>
        {isSeller() && (
          <Link to="/admin/products" className="navbar__link">
            Add Product
          </Link>
        )}
        {user ? (
          <>
            <span className="navbar__user">Hi, {user.name}</span>
            <button className="navbar__logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__link">Login</Link>
            <Link to="/signup" className="navbar__link">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;