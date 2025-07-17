import React from "react";
import UserTasks from "./UserTaskList";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div
      className="container py-5"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "#f1f1f1",
          padding: "20px",
          borderRadius: "8px",
          flexShrink: 0,
        }}
      >
        <div className="text-center mb-3">
          <h2 className="fw-bold text-primary">Admin Dashboard</h2>
          <p className="text-muted">View all users and their tasks</p>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mb-4">
          <Link to="/admin-analytics" className="btn btn-outline-primary">
            📊 View Analytics
          </Link>
          <Link to="/manage-users" className="btn btn-outline-success">
            👥 Manage Users
          </Link>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden", marginTop: "20px" }}>
        <UserTasks />
      </div>
    </div>
  );
}
