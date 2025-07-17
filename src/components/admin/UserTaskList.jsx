import React, { useState, useEffect } from "react";
import { Spinner, Alert, Row } from "react-bootstrap";
import { RiTodoFill } from "react-icons/ri";
import { fetchTasks } from "../../services/task";
import { PAGE_SIZE } from "../../constants/taskOptions";
import UserTaskFilters from "./TaskFilters";
import UserTaskCard from "./UserTaskCard";
import { useNavigate } from "react-router-dom";

export default function UserTasks() {
  const [userTasks, setUserTasks] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    priority: "",
    search: "",
    ordering: "",
    page: 1,
  });

  const navigate = useNavigate();

  const loadUserTasks = async () => {
    try {
      setLoading(true);
      const response = await fetchTasks(filters);
      const tasks = response?.results || [];
      const grouped = {};

      tasks.forEach((task) => {
        const user = task.username || "Unknown user";
        if (!grouped[user]) grouped[user] = [];
        grouped[user].push(task);
      });

      setUserTasks(grouped);
      const total = Math.ceil((response?.count || 0) / PAGE_SIZE);
      setTotalPages(total);
    } catch (err) {
      console.error(err);
      setError("Failed to load user tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserTasks();
  }, [filters]);

  return (
    <div className="d-flex flex-column h-100 overflow-hidden">
      <div className="bg-white p-4 rounded-3 mb-4">
        <h2 className="text-primary text-center fw-bold">
          <RiTodoFill className="me-2" />
          User Task Overview
        </h2>
        <p className="text-muted text-center">
          Effortlessly monitor tasks from all users 🌐
        </p>

        {error && <Alert variant="danger">{error}</Alert>}

        <UserTaskFilters
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={loadUserTasks}
        />
      </div>

      <div className="scrollable-tasks-container flex-grow-1 overflow-auto pe-2">
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : Object.keys(userTasks).length === 0 ? (
          <p className="text-center text-muted">No user tasks found.</p>
        ) : (
          <Row>
            {Object.entries(userTasks).map(([username, tasks]) => (
              <UserTaskCard
                key={username}
                username={username}
                tasks={tasks}
                onTaskClick={(taskId) => navigate(`/admin/tasks/${taskId}`)}
              />
            ))}
          </Row>
        )}
      </div>

      {totalPages > 1 && (
        <div className="bg-white py-3 mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-outline-dark"
              disabled={filters.page <= 1}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              ◀ Previous
            </button>
            <span className="fw-semibold">
              Page {filters.page} of {totalPages}
            </span>
            <button
              className="btn btn-outline-dark"
              disabled={filters.page >= totalPages}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              Next ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
