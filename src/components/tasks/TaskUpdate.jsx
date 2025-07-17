import React, { useEffect, useState } from "react";
import { updateTask, fetchTasks } from "../../services/task";
import { useParams, useNavigate } from "react-router-dom";
import TaskForm from "./TaskForm";
import { useAuth } from "../../context/AuthContext";

export default function TaskUpdate() {
  const { user, role } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const allTasksResponse = await fetchTasks();
      const task = allTasksResponse.results.find((t) => t.id === parseInt(id));

      if (!task) {
        alert("Task not found.");
        navigate("/dashboard");
        return;
      }
      const isUnauthorized =
        (role === "junior" &&
          task.assigned_by_name &&
          task.assigned_by_name != user.username) ||
        (role === "senior" && task.assigned_by_name === "Lead");
      if (isUnauthorized) {
        alert("You are not allowed to edit this task");
        navigate("/dashboard");
      }
      setInitialData(task);
    };
    load();
  }, [id]);

  const handleUpdate = async (data) => {
    await updateTask(id, data);
    navigate("/dashboard");
  };
  return (
    <div className="container py-5">
      {initialData ? (
        <TaskForm initialData={initialData} onsubmit={handleUpdate} isEdit />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
