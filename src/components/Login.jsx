import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Save user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("auth_token", data.auth_token);
        navigate("/home"); // Redirect to home page
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>Email</label>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "4px", padding: "5px" }}>
            <FaEnvelope style={{ marginRight: "8px", color: "#888" }} />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ border: "none", outline: "none", flex: 1 }}
              required
            />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>Password</label>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "4px", padding: "5px" }}>
            <FaLock style={{ marginRight: "8px", color: "#888" }} />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ border: "none", outline: "none", flex: 1 }}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer", color: "#888" }}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: "15px", textAlign: "center" }}>
          <ReCAPTCHA
            sitekey="6Ldcs-UqAAAAAFQmKnsBd78Ik7yjs1hMoFURi6Fu" // Replace with your reCAPTCHA site key
            onChange={(token) => setRecaptchaToken(token)}
          />
        </div>
        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#3face4", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;