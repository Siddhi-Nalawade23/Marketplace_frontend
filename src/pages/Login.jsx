import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    login(email, password)
      .then((res) => {
        const token = res.headers["authorization"];
        if (token) {
          localStorage.setItem("token", token);
        }
        navigate("/");
      })
      .catch((err) => {
        setError("Invalid email or password");
      });
  };

  return (
    <div className="auth">
      <h2>Login</h2>
      {error && <p className="auth__error">{error}</p>}
      <form className="auth__form" onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;