import React from "react";
import { Modal } from "react-bootstrap";
import TaskForm from "./TaskForm";

export default function TaskModal({ show, onHide, onCreate }) {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Create New Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TaskForm onsubmit={onCreate} />
      </Modal.Body>
    </Modal>
  );
}
