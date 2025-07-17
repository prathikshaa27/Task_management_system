import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword, refreshAccessToken } from "../../services/auth";
import { motion } from "framer-motion";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await changePassword({
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      if (res.status === 200) {
        setMessage("Password updated successfully!");
      }
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errMsg =
        err.response?.data?.error || "Something went wrong. Try again.";
      setError(Array.isArray(errMsg) ? errMsg.join(" ") : errMsg);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card-shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "1rem",
          backgroundColor: "#ffffffd9",
        }}
      >
        <h3 className="text-center fw-bold mb-2">Reset Your Password 🔐</h3>
        <p className="text-muted text-center mb-4 small">
          Just a few steps away from getting back in!
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label htmlFor="newPassword">New Password</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Update Password
          </button>
        </form>
        <p className="text-center text-muted mt-3 small">
          We will help you get back on track 🚀
        </p>
      </motion.div>
    </div>
  );
}
