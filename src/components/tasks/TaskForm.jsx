import React, { useState, useEffect } from "react";
import { fetchCategories } from "../../services/task";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function TaskForm({
  initialData = {},
  onsubmit,
  isEdit = false,
}) {
  TaskForm.propTypes = {
    initialData: PropTypes.object,
    onsubmit: PropTypes.func.required,
    isEdit: PropTypes.bool,
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    due_date: "",
    status: "Pending",
    category: [],
    ...initialData,
  });
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };
  const handleCheckboxChange = (e) => {
    const categoryId = parseInt(e.target.value);
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        category: [...prev.category, categoryId],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        category: prev.category.filter((id) => id !== categoryId),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onsubmit(formData);
    } catch {
      setError("Failed to submit. Please try again");
    }
  };
  console.log("Categories from backend:", categories);
  return (
    <div className="py-3 px-3">
      <div className="container">
        <div className="d-flex justify-content-center">
          <motion.form
            onSubmit={handleSubmit}
            className="card shadow-lg border-0 rounded-4 p-4 bg-white w-100"
            style={{ maxWidth: "600px" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h4 className="mb-4 text-center fw-bold">
              {isEdit ? "Update Task ✏️" : "Create Task 📝"}
            </h4>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-2">
              <label className="form-label" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label" htmlFor="priority">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <div className="mb-2 mt-3">
              <label className="form-label" htmlFor="due_date">
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                className="form-control"
                value={formData.due_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label" htmlFor="categories">
                Categories
              </label>
              {categories.length === 0 ? (
                <p className="text-muted">No categories available</p>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <div className="form-check me-3" key={cat.id}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={cat.id}
                        id={`cat-${cat.id}`}
                        checked={formData.category.includes(cat.id)}
                        onChange={handleCheckboxChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`cat-${cat.id}`}
                      >
                        {cat.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-success w-100 fw-bold">
              {isEdit ? "Update Task" : "Create Task"}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
