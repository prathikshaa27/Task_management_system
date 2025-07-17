import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../services/auth";
import { Spinner } from "react-bootstrap";

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
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      role="button"
      title="Update Profile"
      onClick={() => navigate("/update-profile")}
      style={{ cursor: "pointer" }}
    >
      <div
        className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm border"
        style={{ width: "50px", height: "50px" }}
      >
        <i className="bi bi-person-circle text-primary fs-3"></i>
      </div>

      <div className="mt-1">
        {user ? (
          <small
            className="fw-semibold text-dark text-truncate"
            style={{ maxWidth: "80px" }}
          >
            {user.username}
          </small>
        ) : (
          <small className="text-muted d-flex align-items-center">
            <Spinner animation="border" size="sm" className="me-1" /> Loading
          </small>
        )}
      </div>
    </div>
  );
}
