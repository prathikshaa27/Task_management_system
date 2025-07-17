import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTasks } from "../../services/task";
import {
  Card,
  Spinner,
  Alert,
  Badge,
  Button,
  Container,
} from "react-bootstrap";
import {
  BsArrowLeft,
  BsCalendar,
  BsTag,
  BsListCheck,
  BsPersonCircle,
} from "react-icons/bs";

export default function UserTaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const allTasks = await fetchTasks();
        const foundTasks = allTasks.results.find((t) => t.id === parseInt(id));
        setTask(foundTasks);
      } catch (err) {
        console.error("Error loading task details", err);
        setError("Failed to load Task details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  if (!task) {
    return <p className="text-muted text-center">Task not found.</p>;
  }
  return (
    <Container className="my-5">
      <Card className="p-4 shadow-lg border-0 rounded-4 bg-light">
        <h3 className="text-center text-primary mb-4">
          <BsListCheck className="me-2" />
          Task Details
        </h3>
        <Card className="border-0 bg-white rounded-4 shadow-sm p-4">
          <Card.Title className="fs-4 mb-3 text-dark">{task.title}</Card.Title>
          <p className="mb-2">
            <strong>Description: </strong>
            {task.description || "N/A"}
          </p>
          <p className="mb-2">
            <strong>
              <BsTag className="me-2" />
              Priority:
            </strong>{" "}
            <Badge bg="secondary">{task.priority}</Badge>
          </p>
          <p className="mb-2">
            <strong>Status:</strong>{" "}
            <Badge bg={task.status === "Completed" ? "success" : "warning"}>
              {task.status}
            </Badge>
          </p>
          <p className="mb-3">
            <strong>
              <BsCalendar className="me-2" />
              Due Date:
            </strong>{" "}
            {task.due_date || "Not specified"}
          </p>
          <p className="mb-2">
            <strong>Categories: </strong>{" "}
            {task.category_names?.join(", ") || "None"}
          </p>
        </Card>
        <Button
          variant="outline-primary"
          className="mb-4"
          onClick={() => navigate("/admin-dashboard")}
        >
          <BsArrowLeft className="me-2" />
          Back to Dashboard
        </Button>
      </Card>
    </Container>
  );
}
