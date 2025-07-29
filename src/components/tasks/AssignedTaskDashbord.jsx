import React, { useEffect, useState } from "react";
import { fetchTasksAssignedByMe } from "../../services/task";

const AssignedTasksDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasksAssignedByMe()
      .then((data) => {
        console.log("Data",data)
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading your assigned tasks...</p>;
  return (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 px-3">
    <h2 className="text-center mb-4 fw-bold text-primary fs-3">
      📌 Tasks You Assigned
    </h2>

    <div className="table-responsive w-100" style={{ maxWidth: "900px" }}>
      <table className="table table-bordered table-hover shadow-sm text-center align-middle">
        <thead className="table-primary">
          <tr>
            <th scope="col">📄 Title</th>
            <th scope="col">👤 Assignee</th>
            <th scope="col">📈 Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-muted">
                No tasks assigned yet.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td className="text-capitalize text-primary">
                  {task.assignee_name || <i>Unassigned</i>}
                </td>
                <td>
                  <span
                    className={`badge rounded-pill px-3 py-2 ${
                      task.status === "completed"
                        ? "bg-success"
                        : task.status === "pending"
                        ? "bg-warning text-dark"
                        : "bg-info text-dark"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default AssignedTasksDashboard;
