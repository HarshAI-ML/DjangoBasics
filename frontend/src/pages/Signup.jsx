import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRole, registerCustomer, setRole, setUsername } from "../utils/auth";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const role = getRole();
    if (!role) return;
    navigate(role === "admin" ? "/products" : "/shop", { replace: true });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = registerCustomer({ username, email, password });
    if (!result.ok) {
      setError(result.error || "Signup failed");
      return;
    }

    setRole("customer");
    setUsername(username.trim());
    setError("");
    navigate("/shop", { replace: true });
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Create Account</h1>
        <p>Sign up as a customer to place orders.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="signup-error">{error}</p>}
          <button type="submit">Sign Up</button>
        </form>

        <p className="signup-help">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>

        <button className="back-home" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Signup;
