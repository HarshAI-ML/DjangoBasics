import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authenticateUser, getRole, setRole, setUsername } from "../utils/auth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const role = getRole();
    if (!role) return;
    navigate(role === "admin" ? "/products" : "/", { replace: true });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = authenticateUser(email, password);

    if (!result.ok) {
      setError("Invalid email or password");
      return;
    }

    setRole(result.role);
    setUsername(result.username);
    setError("");
    navigate(result.role === "admin" ? "/products" : "/", { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Sign In</h1>
        <p>Single login for admin and customers.</p>

        <form onSubmit={handleSubmit}>
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
          {error && <p className="login-error">{error}</p>}
          <button type="submit">Login</button>
        </form>

        <div className="login-help">
          <p>Admin: harshshinde@gmail.com / password</p>
          <p>Customer: customer@milkman.com / password</p>
          <p>
            New customer? <Link to="/signup">Sign Up</Link>
          </p>
        </div>

        <button className="back-home" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Login;
