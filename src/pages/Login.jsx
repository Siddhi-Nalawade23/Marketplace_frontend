import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { Mail, Lock, ShoppingBag } from "lucide-react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    login(email, password)
      .then((res) => {
        const token = res.headers["authorization"];
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        navigate("/");
      })
      .catch((err) => {
        setError("Invalid email or password");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="login-page">
      <div className="login-showcase">
        <span className="login-showcase__pattern" aria-hidden="true" />
        <div className="login-showcase__tags" aria-hidden="true">
          <span className="login-tag login-tag--1">₹1,453</span>
          <span className="login-tag login-tag--2">₹617.86</span>
          <span className="login-tag login-tag--3">₹265.60</span>
          <span className="login-tag login-tag--4">₹105.69</span>
        </div>
        <div className="login-showcase__copy">
          <span className="login-showcase__icon"><ShoppingBag size={22} /></span>
          <h1>Your whole store,<br />one login away.</h1>
          <p>Track listings, manage orders, and keep the marketplace moving.</p>
        </div>
      </div>

      <div className="login-panel">
        <div className="login-card">
          <h2>Welcome back</h2>
          <p className="login-sub">Log in to continue to your dashboard.</p>

          {error && <p className="login-error">{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">Email</label>
              <div className="login-field__control">
                <Mail className="login-field__icon" size={17} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-field__control">
                <Lock className="login-field__icon" size={17} />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;