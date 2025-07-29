import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import TaskCreate from "../../../components/tasks/TaskCreate";
import { createTask } from "../../../services/task";
import { useNavigate } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));


jest.mock("../../../services/task", () => ({
  createTask: jest.fn(),
}));


jest.mock("../../../components/tasks/TaskForm", () => ({ onsubmit }) => {
  const fakeTask = {
    title: "New Task",
    description: "Some description",
    priority: "High",
    status: "Pending",
    due_date: "2025-08-01",
    category: [1],
  };

  return (
    <div>
      <button onClick={() => onsubmit(fakeTask)}>Submit Form</button>
    </div>
  );
});

describe("TaskCreate Component", () => {
  it("calls createTask and navigates on form submission", async () => {
    createTask.mockResolvedValueOnce({}); 

    const { getByText } = render(<TaskCreate />);
    const submitBtn = getByText("Submit Form");

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Task",
        }),
      );

      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
