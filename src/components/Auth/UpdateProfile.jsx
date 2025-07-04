import React, { useState, useEffect } from "react";
import { fetchUserProfile, updateUserProfile } from "../../services/auth";

export default function UpdateProfile() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setFormData({ username: profile.username, email: profile.email, password: "" });
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile.");
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        username: formData.username,
        email: formData.email,
      };
      if (formData.password) {
        dataToSend.password = formData.password;
      }
      await updateUserProfile(dataToSend);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      const msg = err.response?.data?.error || "Update failed. Try again.";
      setError(msg);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center bg-light py-5">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">
              New Password <span className="text-muted">(Optional)</span>
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}