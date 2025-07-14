import React, { useState,useEffect } from 'react'
import { fetchTasks } from "../../services/task";
import { Card, Container, Row, Col, Badge, Spinner, Alert,Button, InputGroup } from "react-bootstrap";
import { BsPersonCircle, BsCheckCircleFill, BsHourglassSplit } from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import { RiTodoFill } from "react-icons/ri";
import {Form} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PAGE_SIZE ,PRIORITY_CHOICES,SORT_OPTIONS} from '../../constants/taskOptions';

export default function UserTasks() {
  const [userTasks, setUserTasks] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const[totalPages,setTotalPages] = useState(1)
  const[filters,setFilters]  = useState({
    priority: "",
    search: "",
    ordering:"",
    page:1

  })
  const navigate = useNavigate()

 const loadUserTasks = async () => {
      try {
        setLoading(true)
        const response = await fetchTasks(filters);
        const tasks = response?.results || [];
        const grouped = {}

        tasks.forEach((task) => {
            const user = task.username || "Unknown user";
            if(!grouped[user]){
                grouped[user] = [];
            }
            grouped[user].push(task);
        });
        setUserTasks(grouped);
        const total = Math.ceil((response?.count || 0 ) /PAGE_SIZE);
        setTotalPages(total)

      } catch (err) {
        console.error(err);
        setError("Failed to load user tasks.");
      } finally {
        setLoading(false);
      }
    };

    useEffect(()=>{
    loadUserTasks();
  }, [filters]);
 return (
  <Container className="py-4" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
    <div className="text-center mb-4">
      <h2 className="fw-bold text-primary">
        <RiTodoFill className="me-2" />
        User Task Overview
      </h2>
      <p className="text-muted">Effortlessly monitor tasks from all users 🌐</p>
    </div>

    {error && <Alert variant="danger">{error}</Alert>}

    {loading ? (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    ) : (
      <>
        <Form className="mb-4">
          <Row className="g-3">
            <Col xs={12} md={4}>
              <Form.Select
                value={filters.priority}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priority: e.target.value }))
                }
              >
                <option value="">Filter by Priority</option>
               {PRIORITY_CHOICES.map((level)=>(
                <option key={level} value={level}>
                  {level}
                </option>
               ))}
              </Form.Select>
            </Col>

            <Col xs={12} md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by task title or category"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
              </InputGroup>
            </Col>

            <Col xs={12} md={4}>
              <Form.Select
                value={filters.ordering}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, ordering: e.target.value }))
                }
              >
                <option value="">Sort by</option>
                {SORT_OPTIONS.map((opt)=>(
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <div className="text-end mt-3">
            <Button variant="primary" aria-label onClick={loadUserTasks}>
              Apply Filters
            </Button>{" "}
            <Button
              variant="outline-secondary" aria-label
              onClick={() => {
                setFilters({ priority: "", search: "", ordering: "", page: 1 });
              }}
            >
              Reset
            </Button>
          </div>
        </Form>

        {Object.keys(userTasks).length === 0 ? (
          <p className="text-center text-muted">No user tasks found.</p>
        ) : (
          <>
            <Row>
              {Object.entries(userTasks).map(([username, tasks]) => (
                <Col xs={12} md={6} lg={4} key={username} className="mb-4">
                  <Card className="h-100 shadow-sm border-0 rounded-4">
                    <Card.Header className="bg-primary text-white text-center rounded-top-4">
                      <BsPersonCircle className="me-2" />
                      <strong>{username}</strong>
                    </Card.Header>
                    <Card.Body className="bg-light rounded-bottom-4">
                      {tasks.length > 0 ? (
                        tasks.map((task, idx) => (
                          <Card
                            key={idx}
                            className="task-card mb-3 border-0 shadow-sm bg-white rounded-3"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/admin/tasks/${task.id}`)}
                          >
                            <Card.Body>
                              <Card.Title className="fs-6 fw-semibold d-flex justify-content-between align-items-center">
                                {task.title}
                                <Badge
                                  bg={
                                    task.status === "Completed"
                                      ? "success"
                                      : "warning"
                                  }
                                >
                                  {task.status === "Completed" ? (
                                    <BsCheckCircleFill className="me-1" />
                                  ) : (
                                    <BsHourglassSplit className="me-1" />
                                  )}
                                  {task.status}
                                </Badge>
                              </Card.Title>
                              <p className="text-muted small-bp-2">
                                {task.description || "No description provided"}
                              </p>
                              <div className="mb-2">
                                <strong>Categories: </strong>
                                {task.category_names?.length > 0 ? (
                                  <ul className="list-inline mb-0">
                                    {task.category_names.map((cat, i) => (
                                      <li key={i} className="list-inline-item">
                                        <span className="badge bg-secondary">{cat}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <em className="text-muted">None</em>
                                )}
                              </div>
                              <div className="d-flex justify-content-between align-items-center mt-2 flex-wrap small text-muted">
                                <span>
                                  <strong>Priority:</strong>{" "}
                                  <Badge bg="secondary">{task.priority}</Badge>
                                </span>
                                <span>
                                  <AiOutlineCalendar className="me-1" />
                                  {task.due_date}
                                </span>
                              </div>
                            </Card.Body>
                          </Card>
                        ))
                      ) : (
                        <p className="text-muted text-center mb-0">
                          No tasks available.
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
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
      </>
    )}
  </Container>
);
}