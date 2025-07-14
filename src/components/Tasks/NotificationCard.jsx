import React from "react";
import { Link } from "react-router-dom";

export default function NotificationCard({ notifications }) {
  return (
    <div className="mb-4">
      <div className="alert alert-light border border-warning border-3 rounded shadow-sm">
        <div className="d-flex flex-column align-items-center mb-3 text-center">
          <div
            className="bg-warning bg-opacity-25 text-warning rounded-circle d-flex align-items-center justify-content-center mb-3"
            style={{ width: "45px", height: "45px" }}
          >
            <i className="bi bi-bell-fill fs-4"></i>
          </div>
          <div className="flex-grow-1">
            <h5 className="mb-1 fw-bold text-warning text-center">
              Upcoming Task Reminders
            </h5>
            <p className="mb-0 text-muted small text-center">
              You have <strong>{notifications.length}</strong> task
              {notifications.length > 1 ? "s" : ""} due soon. Don’t miss them!
            </p>
          </div>
        </div>

        <ul className="list-group list-group-flush">
          {notifications.map((task) => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center px-0"
            >
              <div>
                <Link
                  to={`/tasks/${task.id}`}
                  className="text-decoration-none text-dark fw-semibold"
                >
                  <i className="bi bi-check2-circle me-2 text-primary"></i>
                  {task.title}
                </Link>
                <div className="text-muted small ms-4">
                  Due on <strong className="text-danger">{task.due_date}</strong>
                </div>
              </div>
              <Link
                to={`/tasks/${task.id}`}
                className="btn btn-sm btn-outline-primary"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
