import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import login_img from "../../assets/images/login_img.svg";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin-login";

  const { login, user } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const loggedInUser = await login(formData);
      if (loggedInUser) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          const currentRole = loggedInUser?.role;
          if (currentRole === "admin") {
            navigate("/admin-dashboard");
          } else {
            if (isAdminRoute) {
              setError("You are not authorized as an admin.");
              return;
            }
            navigate("/dashboard");
          }
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="d-flex min-vh-100 w-100">
      <div
        className="d-none d-md-flex position-relative align-items-center justify-content-center"
        style={{ width: "50%", backgroundColor: "#f8f9fa" }}
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="d-flex align-items-center justify-content-center w-100 h-100"
        >
          <img
            src={login_img}
            alt="login_image"
            className="img-fluid p-4"
            style={{ maxHeight: "630px", width: "auto", objectFit: "contain" }}
          />
        </motion.div>
      </div>

      <div
        className="d-flex align-items-center justify-content-center p-4"
        style={{ width: "50%", backgroundColor: "#f8f9fa" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-100"
          style={{ maxWidth: "400px" }}
        >
          <h2 className="text-center mb-3 fw-bold">
            {isAdminRoute ? "Admin Login" : "Welcome Back"}
          </h2>
          <p className="text-muted text-center mb-4">
            Log in and let the productivity begin!
          </p>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className={`form-control ${
                  fieldErrors.username ? "is-invalid" : ""
                }`}
                id="username"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              <label htmlFor="username">Username</label>
              {fieldErrors.username && (
                <div className="invalid-feedback">{fieldErrors.username}</div>
              )}
            </div>

            <div className="form-floating mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${
                  fieldErrors.password ? "is-invalid" : ""
                }`}
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <label htmlFor="password">Password</label>
              <i
                className={`bi ${
                  showPassword ? "bi-eye-slash" : "bi-eye"
                } position-absolute top-50 end-0 translate-middle-y me-3`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              ></i>
            </div>

            <div className="mb-3 text-end">
              <Link
                to="/forgot-password"
                className="text-decoration-none small text-primary"
              >
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Log In
            </button>

            <p className="text-center small mt-3">
              New user?{" "}
              <Link to="/signup" className="text-decoration-none">
                Create an account
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
