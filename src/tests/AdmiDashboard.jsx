import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "../../components/admin/AdminDashboard";

// Mock the UserTasks component to prevent deep rendering
jest.mock("../../components/admin/UserTaskList", () => () => (
  <div data-testid="user-tasks">Mocked UserTasks</div>
));

describe("AdminDashboard", () => {
  it("renders dashboard title, description, and links", () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Dashboard title
    expect(
      screen.getByRole("heading", { name: /admin dashboard/i })
    ).toBeInTheDocument();

    // Description
    expect(
      screen.getByText(/view all users and their tasks/i)
    ).toBeInTheDocument();

    // Analytics link
    expect(
      screen.getByRole("link", { name: /📊 view analytics/i })
    ).toBeInTheDocument();

    // Manage Users link
    expect(
      screen.getByRole("link", { name: /👥 manage users/i })
    ).toBeInTheDocument();

    // UserTasks placeholder check
    expect(screen.getByTestId("user-tasks")).toBeInTheDocument();
  });
});
