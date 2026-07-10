import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import "./Auth.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    signup(name, email, password, passwordConfirmation)
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        const messages = err.response?.data?.errors?.join(", ") || err.message;
        setError(messages);
      });
  };

  return (
    <div className="auth">
      <h2>Sign Up</h2>
      {error && <p className="auth__error">{error}</p>}
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;