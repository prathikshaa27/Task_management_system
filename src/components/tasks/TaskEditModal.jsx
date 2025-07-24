import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import TaskForm from "./TaskForm";
import { updateTask } from "../../services/task";

export default function TaskEditModal({ show, onHide, taskData, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (data) => {
    try {
      setLoading(true);
      await updateTask(taskData.id, data);
      onUpdate(); 
      onHide();  
    } catch (err) {
      console.error("Error updating task", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Task ✏️</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {taskData ? (
          <TaskForm initialData={taskData} onsubmit={handleUpdate} isEdit />
        ) : (
          <p>Loading...</p>
        )}
      </Modal.Body>
    </Modal>
  );
}
