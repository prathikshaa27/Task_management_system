import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "../../components/admin/AdminDashboard";


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

    expect(
      screen.getByRole("heading", { name: /admin dashboard/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/view all users and their tasks/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /📊 view analytics/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /👥 manage users/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("user-tasks")).toBeInTheDocument();
  });
});
