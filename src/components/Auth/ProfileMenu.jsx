import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../services/auth";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUser(profile);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    loadProfile();
  }, []);

  return (
    <div className="d-flex align-items-center gap-2">
      <button
        onClick={() => navigate("/update-profile")}
        className="btn btn-light shadow-sm border rounded-circle mb-1"
        style={{ width: "3rem", height: "3rem" }}
        title="Profile"
      >
        <span className="fs-4">👤</span>
      </button>
      {user ? (
        <small className="fw-semibold text-white">{user.username}</small>
      ) : (
        <small className="text-muted">Loading...</small>
      )}
    </div>
  );
}
