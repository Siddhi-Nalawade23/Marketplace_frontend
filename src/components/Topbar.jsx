import Profile from "./Profile";
import "./Topbar.css";

function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar__spacer" />
      <Profile />
    </header>
  );
}

export default Topbar;