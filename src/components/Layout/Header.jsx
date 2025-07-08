import React from "react";
import { Link } from "react-router-dom";
import ProfileMenu from "../Auth/ProfileMenu";

export default function Header(){
    return (
    <header className="bg-info bg-opacity-10 py-3 border-bottom">
      <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center px-3">
        <Link
          to="/dashboard"
          className="text-decoration-none d-flex align-items-center gap-2 mb-2 mb-md-0"
        >
          <i className="bi bi-check2-square fs-4 text-primary"></i>
          <h4 className="fw-bold text-dark mb-0">Task Manager</h4>
        </Link>
        <div className="d-flex align-items-center gap-4">
          <Link
            to="/calendar"
            className="text-dark text-decoration-none fw-semibold d-flex align-items-center gap-1"
          >
            <i className="bi bi-calendar-event-fill"></i> Calendar
          </Link>

          <div className="d-flex align-items-center">
            <ProfileMenu />
          </div>

          <Link
            to="/login"
            className="btn btn-outline-danger btn-sm fw-semibold d-flex align-items-center gap-1"
          >
            <i className="bi bi-box-arrow-right"></i> Logout
          </Link>
        </div>
      </div>
    </header>
  );
}