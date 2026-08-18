import { useState } from "react";
import { getCurrentUser, isSeller, logout } from "../api/authHelpers";
import { CircleUserRound, ChevronDown, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const toggleDropdown = () => setOpen((prev) => !prev);

  const initials = user?.name
    ? user.name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

  return (
    <div className="profile">
      <button
        className="profile__trigger"
        onClick={toggleDropdown}
        aria-expanded={open}
      >
        <span className="profile__avatar">
          {initials || <CircleUserRound size={18} />}
        </span>
        <span className="profile__label">{user ? user.name : "Account"}</span>
        <ChevronDown
          size={15}
          className={`profile__chevron ${open ? "profile__chevron--open" : ""}`}
        />
      </button>

      {open && (
        <div className="profile__dropdown">
          {user ? (
            <>
              <div className="profile__dropdown-header">
                <span className="profile__dropdown-name">{user.name}</span>
                <span className="profile__dropdown-role">
                  {isSeller() ? "Seller" : "Buyer"}
                </span>
              </div>
              <button className="profile__logout" onClick={handleLogout}>
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="profile__link" onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link to="/signup" className="profile__link" onClick={() => setOpen(false)}>
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;