import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ManageUsers from "../components/admin/ManageUsers";
import * as authService from "../services/auth"; 
// import "@testing-library/jest-dom/extend-expect";

jest.mock("../services/auth"); 

describe("ManageUsers Component", () => {
  const mockUsers = [
    { id: 1, username: "Alice", role: "user" },
    { id: 2, username: "Bob", role: "admin" },
  ];

  beforeEach(() => {
    authService.getUsers.mockResolvedValue(mockUsers);
    authService.updateUserRole.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("allows role change and triggers save", async () => {
    render(<ManageUsers />);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    const roleSelects = screen.getAllByRole("combobox");
    fireEvent.change(roleSelects[0], { target: { value: "admin" } });

    const saveButtons = screen.getAllByText("Save");
    fireEvent.click(saveButtons[0]);

    await waitFor(() => {
      expect(authService.updateUserRole).toHaveBeenCalledWith(1, "admin");
    });
  });
});
