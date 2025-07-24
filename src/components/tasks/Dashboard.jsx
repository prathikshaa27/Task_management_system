import React from "react";
import TaskList from "./TaskList";
import dashboard from "../../assets/images/dashboard.svg";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { BsAlarmFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchTaskNotifications } from "../../services/task";

export default function Dashboard() {
  const { role } = useAuth();
  const canAssign = role === "lead" || role === "senior";
  const navigate = useNavigate();
  useEffect(() => {
    const hasShown = sessionStorage.getItem("hasShownTaskReminder");

    const showReminderIfDue = async () => {
      if (hasShown) return;

      try {
        const notifications = await fetchTaskNotifications();
        const dueSoon = notifications.find((task) => task.status !== "Completed");

        if (dueSoon) {
          toast(
            <div
              className="d-flex align-items-center"
              onClick={() => navigate("/tasks")}
              style={{ cursor: "pointer" }}
            >
              <BsAlarmFill className="me-2 text-danger" />
              <span className="text-danger fw-semibold">
                "{dueSoon.title}" is due soon! Tap here to check.
                
              </span>
            </div>,
            {
              autoClose: 8000,
              closeOnClick: true,
              className: "toast-task-reminder",
              onClick: () => navigate(`/tasks/${dueSoon.id}`),
            }
          );

          sessionStorage.setItem("hasShownTaskReminder", "true");
        }
      } catch (error) {
        console.error("Failed to fetch task reminders", error);
      }
    };

    showReminderIfDue();
  }, [navigate]);


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
