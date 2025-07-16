import React from "react";
import { Link } from "react-router-dom";
import { getPriorityBadgeClass } from "../../utils/priorityUtils";
import { shouldShowAssignedBy, isOverdue, canEditorDelete } from "../../utils/taskUtils";
import { useAuth } from "../../context/AuthContext";
import { STATUS_OPTIONS } from "../../constants/taskOptions";


export default function TaskCard({ task, onDelete,onStatusChange}) {
  const { user, role } = useAuth();


  return (
    <div className="col-md-6 col-lg-4">
      <div className="card task-card shadow-sm border-0 h-100 rounded-4 p-3 bg-white">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{task.title}</h5>
          <p className="text-muted mb-2">{task.description}</p>
          <p className={`mb-1 ${isOverdue(task.due_date) ? "text-danger fw-bold" : ""}`}>
            <i className="bi bi-calendar-event me-1"></i> Due: {task.due_date}
          </p>

          {shouldShowAssignedBy(task, user, role) && (
            <div className="mb-2">
              <strong>Assigned By:</strong>{" "}
              <span className="text-primary">
                {task.assigned_by_name} ({task.assigned_by_role})
              </span>
            </div>
          )}
          {task.assignee_id === user.id && (
  <div className="mb-2">
    <strong>Status:</strong>{" "}
    <select
      className="form-select form-select-sm d-inline w-auto ms-2"
      value={task.status}
      onChange={(e) => onStatusChange(task.id, e.target.value)}
    >
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  </div>
)}

          <div className="mb-2">
            <strong>Priority:</strong>{" "}
            <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          <div className="mb-2">
            <strong>Categories:</strong>{" "}
            {task.category_names.length > 0 ? (
              <ul className="list-inline mb-0">
                {task.category_names.map((cat) => (
                  <li className="list-inline-item" key={cat}>
                    <span className="badge bg-secondary">{cat}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <em className="text-muted">None</em>
            )}
          </div>

          <div className="mt-auto d-flex justify-content-center align-items-center gap-2 pt-3">
            <Link
              to={`/tasks/${task.id}`}
              className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
            >
              <i className="bi bi-eye"></i>
            </Link>
            {canEditorDelete(task,user,role) && (
              <>
                <Link
                  to={`/tasks/update/${task.id}`}
                  className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
                >
                  <i className="bi bi-pencil"></i>
                </Link>
                <button
                  onClick={() => onDelete(task.id)}
                  className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
