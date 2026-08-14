import { Link, useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import heroImg from "../assets/StoreLogo.png";
import { getCurrentUser, isSeller, logout } from "../api/authHelpers";
import "./Style.css";
import {House,TruckElectric,Search,ShoppingCart ,ShoppingBag }from 'lucide-react';

function Navbar() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate("/");
    }
  };
  return (
    <div className="navbar">
      <Link to="/products" className="navbar__logo">
        <span className="navbar__logo-text">
<img src={heroImg} alt="Logo" width="100%" height="60" style={{ height: "60px", width: "100%", objectFit: "contain" }} />        </span>
      </Link>
     

      <div className="navbar__links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar__link active" : "navbar__link"
          }
        ><House size={20} style={{ margin: "2px 8px 0px 0px", padding: "2px" }}  />
          Home
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "navbar__link active" : "navbar__link"
          }
        >  <TruckElectric size={20} style={{ margin: "2px 8px 0px 0px" }}/>
          Products
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            isActive ? "navbar__link active" : "navbar__link"
          }
        >  
        <Search  size={20} style={{ margin: "2px 8px 0px 0px" }}/>
          Search
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive ? "navbar__link active" : "navbar__link"
          }
        > 
        <ShoppingCart  size={20} style={{ margin: "2px 8px 0px 0px" }}/>
          Cart
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "navbar__link active" : "navbar__link"
          }
        >  <ShoppingBag size={20} style={{ margin: "2px 8px 0px 0px" }}/>
          Orders
        </NavLink>
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
    </div>
  );
}

export default Navbar;