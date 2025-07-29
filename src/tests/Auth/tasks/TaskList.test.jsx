import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TaskList from "../../../components/tasks/TaskList"; 
import { useAuth } from "../../../context/AuthContext";
import * as taskService from "../../../services/task";


jest.mock("../../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));


jest.mock("../../../components/tasks/TaskCard", () => () => <div data-testid="task-card">TaskCard</div>);
jest.mock("../../../components/tasks/TaskModal", () => ({ show, onHide }) => (
  show ? <div data-testid="task-modal">TaskModal</div> : null
));
jest.mock("../../../components/tasks/TaskEditModal", () => ({ show, onHide }) => (
  show ? <div data-testid="edit-modal">TaskEditModal</div> : null
));


jest.spyOn(taskService, "fetchTasks").mockResolvedValue({
  count: 0,
  results: [],
});

describe("TaskList", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: { id: 1, name: "Prathi" }, role: "admin" });
  });

  it("renders TaskList component and UI elements", async () => {
    render(<TaskList />);

    expect(screen.getByPlaceholderText("🔍 Search...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add Task/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(taskService.fetchTasks).toHaveBeenCalled();
    });

    expect(screen.getByText("No tasks found.")).toBeInTheDocument();
  });
});
