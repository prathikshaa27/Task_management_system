import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword ,refreshAccessToken} from "../../services/auth"; 

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
      await refreshAccessToken();
      const res = await changePassword({
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setMessage("Password updated successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errMsg =
        err.response?.data?.error || "Something went wrong. Try again.";
      setError(Array.isArray(errMsg) ? errMsg.join(" ") : errMsg);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}>
        <h3 className="text-center mb-3">Change Password</h3>

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
      </div>
    </div>
  );
}
