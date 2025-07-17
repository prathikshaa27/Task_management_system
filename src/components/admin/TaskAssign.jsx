import React, { useState, useEffect } from "react";
import { assignTask, fetchCategories } from "../../services/task";
import { getUsers } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { STATUS_OPTIONS, PRIORITY_CHOICES } from "../../constants/taskOptions";

export default function TaskAssign() {
  const { user, role } = useAuth();

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    assignee_id: "",
    priority: "Medium",
    category: [],
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await getUsers();
        let filtered = [];

        if (role === "lead") {
          filtered = allUsers.filter(
            (u) => u.role === "senior" || u.role === "junior",
          );
        } else if (role === "senior") {
          filtered = allUsers.filter((u) => u.role === "junior");
        }

        setUsers(filtered);
      } catch (err) {
        console.error("Failed to load users", err);
        setError("Could not fetch users.");
      } finally {
        setLoadingUsers(false);
      }
    };

    const loadCategories = async () => {
      try {
        const catData = await fetchCategories();
        setCategories(catData);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setError("Could not fetch categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadUsers();
    loadCategories();
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryCheckbox = (e) => {
    const id = parseInt(e.target.value);
    const isChecked = e.target.checked;

    setFormData((prev) => {
      let updated = [...prev.category];
      if (isChecked) {
        updated.push(id);
      } else {
        updated = updated.filter((catId) => catId !== id);
      }
      return { ...prev, category: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await assignTask(formData);
      setMessage("Task assigned successfully!");
      setFormData({
        title: "",
        description: "",
        due_date: "",
        assignee_id: "",
        priority: "Medium",
        category: [],
      });
    } catch (err) {
      console.error("Assign failed", err);
      setError("Failed to assign task.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        minHeighteight: "100vh",
        overflow: "auto",
      }}
    >
      <Container
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 className="fw-bold text-primary text-center mb-4">Assign a Task</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        {loadingUsers || loadingCategories ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted text-center">
            No eligible users to assign tasks to.
          </p>
        ) : (
          <Form
            onSubmit={handleSubmit}
            className="shadow-sm p-3 rounded bg-white"
            style={{ overflow: "visible" }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter task title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
                placeholder="Enter task description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assign To</Form.Label>
              <Form.Select
                name="assignee_id"
                value={formData.assignee_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Select User --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.role})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categories</Form.Label>
              <div
                style={{
                  maxHeight: "120px",
                  overflowY: "auto",
                  border: "1px solid #dee2e6",
                  borderRadius: "0.375rem",
                  padding: "8px",
                }}
              >
                {categories.map((cat) => (
                  <Form.Check
                    key={cat.id}
                    type="checkbox"
                    label={cat.name}
                    value={cat.id}
                    onChange={handleCategoryCheckbox}
                    checked={formData.category.includes(cat.id)}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                {PRIORITY_CHOICES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="text-center">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Assigning..." : "Assign Task"}
              </Button>
            </div>
          </Form>
        )}
      </Container>
    </div>
  );
}
