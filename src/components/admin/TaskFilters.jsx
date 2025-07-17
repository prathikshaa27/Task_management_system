import React from "react";
import { Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import { PRIORITY_CHOICES, SORT_OPTIONS } from "../../constants/taskOptions";

export default function UserTaskFilters({
  filters,
  setFilters,
  onApplyFilters,
}) {
  return (
    <Form className="mb-0">
      <Row className="g-3">
        <Col xs={12} md={4}>
          <Form.Select
            value={filters.priority}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priority: e.target.value }))
            }
          >
            <option value="">Filter by Priority</option>
            {PRIORITY_CHOICES.map((level) => (
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
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <div className="text-end mt-3">
        <Button variant="primary" onClick={onApplyFilters}>
          Apply Filters
        </Button>{" "}
        <Button
          variant="outline-secondary"
          onClick={() =>
            setFilters({ priority: "", search: "", ordering: "", page: 1 })
          }
        >
          Reset
        </Button>
      </div>
    </Form>
  );
}
