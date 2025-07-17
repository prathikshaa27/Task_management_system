import React from "react";
import { Link } from "react-router-dom";

export default function NotificationCard({ notifications }) {
  return (
    <div className="mb-3">
      <div className="alert alert-light border border-warning border-2 rounded shadow-sm py-3 px-3">
        <div className="d-flex flex-column align-items-center mb-2 text-center">
          <div
            className="bg-warning bg-opacity-25 text-warning rounded-circle d-flex align-items-center justify-content-center mb-2"
            style={{ width: "35px", height: "35px" }}
          >
            <i className="bi bi-bell-fill fs-5"></i>
          </div>
          <div className="flex-grow-1">
            <h6 className="mb-1 fw-semibold text-warning text-center">
              Task Reminder
            </h6>
            <p className="mb-0 text-muted small text-center">
              <strong>{notifications.length}</strong> task
              {notifications.length > 1 ? "s are" : " is"} due soon ⏰
            </p>
          </div>
        </div>

        <ul className="list-group list-group-flush small">
          {notifications.map((task) => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center px-1 py-2"
            >
              <div>
                <Link
                  to={`/tasks/${task.id}`}
                  className="text-decoration-none text-dark fw-semibold small"
                >
                  <i className="bi bi-check2-circle me-2 text-primary"></i>
                  {task.title}
                </Link>
                <div className="text-muted small ms-4">
                  Due: <strong className="text-danger">{task.due_date}</strong>
                </div>
              </div>
              <Link
                to={`/tasks/${task.id}`}
                className="btn btn-sm btn-outline-primary"
                style={{ fontSize: "0.75rem", padding: "2px 8px" }}
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
