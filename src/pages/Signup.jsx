import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import { User, Mail, Lock, Briefcase, ShoppingBag } from "lucide-react";
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    signup(name, email, password, passwordConfirmation, role)
      .then(() => navigate("/login"))
      .catch((err) => {
        const messages = err.response?.data?.errors?.join(", ") || err.message;
        setError(messages);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="signup-page">
      <div className="signup-showcase">
        <span className="signup-showcase__pattern" aria-hidden="true" />

        <div className="signup-showcase__tags" aria-hidden="true">
          <span className="signup-tag signup-tag--1">New listing</span>
          <span className="signup-tag signup-tag--2">Order placed</span>
          <span className="signup-tag signup-tag--3">In stock</span>
          <span className="signup-tag signup-tag--4">Fast checkout</span>
        </div>

        <div className="signup-showcase__copy">
          <span className="signup-showcase__icon">
            <ShoppingBag size={22} />
          </span>
          <h1>
            Join the
            <br />
            marketplace.
          </h1>
          <p>Buy what you need, or start selling in minutes.</p>
        </div>
      </div>

      <div className="signup-panel">
        <div className="signup-card">
          <h2>Create your account</h2>
          <p className="signup-sub">A few details and you're in.</p>

          {error && <p className="signup-error">{error}</p>}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-field">
              <label htmlFor="name">Name</label>
              <div className="signup-field__control">
                <User className="signup-field__icon" size={17} />
                <input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="signup-field">
              <label htmlFor="email">Email</label>
              <div className="signup-field__control">
                <Mail className="signup-field__icon" size={17} />
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

            <div className="signup-field-row">
              <div className="signup-field">
                <label htmlFor="password">Password</label>
                <div className="signup-field__control">
                  <Lock className="signup-field__icon" size={17} />
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

              <div className="signup-field">
                <label htmlFor="passwordConfirmation">Confirm</label>
                <div className="signup-field__control">
                  <Lock className="signup-field__icon" size={17} />
                  <input
                    id="passwordConfirmation"
                    type="password"
                    placeholder="••••••••"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="signup-field">
              <label htmlFor="role">I'm here to</label>
              <div className="signup-field__control">
                <Briefcase className="signup-field__icon" size={17} />
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="buyer">Buy products</option>
                  <option value="seller">Sell products</option>
                </select>
              </div>
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <p className="signup-footer">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;