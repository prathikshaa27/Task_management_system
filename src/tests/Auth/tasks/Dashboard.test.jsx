import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../../../components/tasks/Dashboard";
import { useAuth } from "../../../context/AuthContext";
import { fetchTaskNotifications } from "../../../services/task";
import { toast } from "react-toastify";
import { MemoryRouter } from "react-router-dom";


jest.mock("../../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../../services/task", () => ({
  fetchTaskNotifications: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

jest.mock("../../../components/tasks/TaskList", () => () => (
  <div data-testid="task-list">TaskList Mock</div>
));

describe("Dashboard", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("renders welcome message and TaskList", async () => {
    useAuth.mockReturnValue({ role: "member" });
    fetchTaskNotifications.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Welcome to Your Task Dashboard/i)
    ).toBeInTheDocument();

    expect(screen.getByTestId("task-list")).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchTaskNotifications).toHaveBeenCalled();
    });
    expect(screen.queryByText(/Assign New Task/i)).not.toBeInTheDocument();
  });

  it("shows assign task button for lead role", async () => {
    useAuth.mockReturnValue({ role: "lead" });
    fetchTaskNotifications.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Assign New Task/i)).toBeInTheDocument();
  });

  it("triggers toast if a task is due", async () => {
    useAuth.mockReturnValue({ role: "senior" });

    fetchTaskNotifications.mockResolvedValue([
      { id: 101, title: "Urgent Bug Fix", status: "In Progress" },
    ]);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetchTaskNotifications).toHaveBeenCalled();
      expect(toast).toHaveBeenCalled();
    });
  });
});
