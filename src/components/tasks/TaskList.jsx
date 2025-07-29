import React, { useEffect, useState } from "react";
import {
  deleteTasks,
  fetchTasks,
  updateTask,
  createTask
} from "../../services/task";
import { useAuth } from "../../context/AuthContext";
import {
  STATUS_OPTIONS,
  PRIORITY_CHOICES,
  PAGE_SIZE,
} from "../../constants/taskOptions";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import TaskEditModal from "./TaskEditModal";


export default function TaskList() {
  const { user, role } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    ordering: "",
    page: 1,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task,
        ),
      );
    } catch (err) {
      console.error("Error updating status", err);
      setError("Failed to update task status");
    }
  };

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setShowNotifications(false);
        setNotifications([]);
      },
      2 * 60 * 1000,
    );

    return () => clearTimeout(timer);
  }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks(filters);
      setTasks(data.results);
      const total = Math.ceil(data.count / PAGE_SIZE);
      setTotalPages(total);
    } catch (err) {
      console.error("Error loading tasks", err);
      setError("Failed to load tasks");
    }
  };
  useEffect(() => {
    loadTasks();
  }, [filters]);
  
  const handleTaskCreate = async (data) => {
    await createTask(data);
    setShowModal(false); 
    loadTasks(); 
  };
  const handleEditClick = (task) => {
  setSelectedTask(task);
  setShowEditModal(true);
};



  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTasks(id);
        loadTasks();
      } catch (err) {
        console.error("Error deleting tasks", err);
        setError("Delete failed");
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div>
      <div className="card shadow-sm p-4 mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search..."
              name="search"
              value={filters.search}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              name="status"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              name="priority"
              value={filters.priority}
              onChange={handleChange}
            >
              <option value="">All Priorities</option>
              {PRIORITY_CHOICES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              name="ordering"
              value={filters.ordering}
              onChange={handleChange}
            >
              <option value="">Sort by</option>
              <option value="priority">Priority ↑</option>
              <option value="-priority">Priority ↓</option>
              <option value="due_date">Due Date ↑</option>
              <option value="-due_date">Due Date ↓</option>
            </select>
          </div>
          <div className="col-md-3 text-end">
            <button
              className="btn btn-success w-100 w-md-auto"
              onClick={() => setShowModal(true)}
            >            
              <i className="bi bi-plus-circle me-1"></i> Add Task
              </button>
            
          </div>
        </div>
      </div>
       <TaskModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onCreate={handleTaskCreate}
      />
      {error && <div className="alert alert-danger">{error}</div>}
      {tasks.length === 0 ? (
        <p className="text-muted text-center">No tasks found.</p>
      ) : (
        <>
          <div className="row g-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onEdit = {()=>handleEditClick(task)}
              />
            ))}
          </div>
          <TaskEditModal
  show={showEditModal}
  onHide={() => setShowEditModal(false)}
  taskData={selectedTask}
  onUpdate={loadTasks}
/>

          {totalPages > 1 && (
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-2">
              <button
                className="btn btn-outline-dark"
                disabled={filters.page <= 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                ◀ Previous
              </button>
              <span className="fw-semibold text-center">
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
          )}
        </>
      )}
    </div>
  );
}
