import React from "react";
import TaskList from "./TaskList";
import dashboard from "../../assets/images/dashboard.svg";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { role } = useAuth();
  const canAssign = role === "lead" || role === "senior";
  return (
    <div
      className="h-100 d-flex flex-column"
      style={{
        background: "linear-gradient(135deg, #f2f4ff, #dbeafe)",
      }}
    >
      <img
        src={dashboard}
        alt="dashboard.img"
        style={{
          position: "absolute",
          top: "5%",
          right: "5%",
          width: "250px",
          opacity: 0.05,
          zIndex: 0,
        }}
      />

      <div
        className="py-3 px-4 shadow-sm w-100 dashboard-banner flex-shrink-0"
        style={{
          backgroundColor: "#4f46e5",
          color: "#ffffff",
          zIndex: 1,
          marginBottom: "1.5rem",
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="text-center w-100">
            <h2 className="fs-4 fw-bold text-white mb-1">
              Welcome to Your Task Dashboard 📋
            </h2>
            <p className="mb-0 text-white-50">Stay organized & stay ahead</p>
          </div>
          {canAssign && (
            <Link
              to="/tasks/assign"
              className="btn btn-light shadow-sm fw-semibold px-4 "
            >
              <i className="bi bi-send-check-fill me-2"></i>
              Assign New Task
            </Link>
          )}
        </div>
      </div>

      <div
        className="flex-grow-1 px-4 py-3"
        style={{ zIndex: 2, overflow: "auto", minHeight: 0 }}
      >
        <TaskList />
      </div>
    </div>
  );
}
