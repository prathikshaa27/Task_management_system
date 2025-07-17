import React from "react";
import { Card, Col, Badge } from "react-bootstrap";
import {
  BsPersonCircle,
  BsCheckCircleFill,
  BsHourglassSplit,
} from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";

export default function UserTaskCard({ username, tasks, onTaskClick }) {
  return (
    <Col xs={12} md={6} lg={4} className="mb-4">
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
                onClick={() => onTaskClick(task.id)}
              >
                <Card.Body>
                  <Card.Title className="fs-6 fw-semibold d-flex justify-content-between align-items-center">
                    {task.title}
                    <Badge
                      bg={task.status === "Completed" ? "success" : "warning"}
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
            <p className="text-muted text-center mb-0">No tasks available.</p>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}
