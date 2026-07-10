import { Link } from "react-router-dom";
import "./Style.css";

function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar__logo">
                Marketplace
            </Link>
            <div className="navbar__links">
                <Link to="/cart" className="navbar__link">
                    Cart
                </Link>
                <Link to="/login" className="navbar__link">
                    Login
                </Link>
                <Link to="/signup" className="navbar__link">
                    Signup
                </Link>
                <Link to="/orders" className="navbar__link">
                    Orders
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;