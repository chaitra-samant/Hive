import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./landingpage.css";

const LandingPage1 = ({ onLoginSuccess }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for toggling password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        employee_id: employeeId,
        password: password,
      });

      // Validate response and store token
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        setMessage(`Welcome ${response.data.employee_name}`);
        onLoginSuccess();
        navigate("/kanban");
      } else {
        setMessage("Unexpected server response. Please try again.");
      }
    } catch (error) {
      setMessage(error.response ? error.response.data.message : "Server Error");
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <nav className="home-link">
          <a href="/">HOME</a> {/* Add clickable link */}
        </nav>

        <div className="content-wrapper">
          <h1>Hive</h1>
          <p>Seamless workforce collaboration at your fingertips.</p>
        </div>
      </div>

      <div className="right-section">
        <div className="login-form-container">
          <h2>Login</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Employee ID</label>
              <input
                type="text"
                placeholder="Enter employee ID"
                className="form-input"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">
              Log in
            </button>
          </form>

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default LandingPage1;
