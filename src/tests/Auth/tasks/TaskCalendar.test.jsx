import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TaskCalendar from "../../../components/tasks/TaskCalender"; 
import { fetchTasks } from "../../../services/task";


jest.mock("@fullcalendar/react", () => {
  return () => <div data-testid="fullcalendar-mock">FullCalendar</div>;
});

jest.mock("@fullcalendar/daygrid", () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({})),
  };
});


jest.mock("../../../services/task", () => ({
  fetchTasks: jest.fn(),
}));

jest.mock("../../../utils/priorityUtils", () => ({
  getEventColor: (priority) => {
    const colors = {
      high: "red",
      medium: "orange",
      low: "green",
    };
    return colors[priority] || "gray";
  },
}));

describe("TaskCalendar", () => {
  it("renders and fetches task events", async () => {
    const mockTasks = {
      results: [
        {
          title: "Test Task 1",
          due_date: "2025-08-01",
          priority: "high",
        },
        {
          title: "Test Task 2",
          due_date: "2025-08-15",
          priority: "low",
        },
      ],
    };

    fetchTasks.mockResolvedValueOnce(mockTasks);

    render(<TaskCalendar />);
    expect(screen.getByText(/Task Calendar/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchTasks).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByTestId("fullcalendar-mock")).toBeInTheDocument();
  });
});
