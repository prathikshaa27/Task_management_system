import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../services/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  },
}));

jest.mock("../../services/auth", () => ({
  changePassword: jest.fn(),
}));


import ChangePassword from "../../components/auth/ForgotPassword";
import * as authService from "../../services/auth";

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("ChangePassword component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the password form", () => {
    renderWithRouter(<ChangePassword />);
    expect(screen.getByText(/Reset Your Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Update Password/i)).toBeInTheDocument();
  });

  it("updates password successfully", async () => {
    authService.changePassword.mockResolvedValueOnce({ status: 200 });
    renderWithRouter(<ChangePassword />);
    
    const newPassword = screen.getByLabelText(/New Password/i);
    const confirmPassword = screen.getByLabelText(/Confirm Password/i);
    
    fireEvent.change(newPassword, { target: { value: "newPass123!" } });
    fireEvent.change(confirmPassword, { target: { value: "newPass123!" } });
    fireEvent.click(screen.getByRole("button", { name: /Update Password/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Password updated successfully/i)).toBeInTheDocument();
    });
  });

  it("shows error when API call fails", async () => {
    authService.changePassword.mockRejectedValueOnce({
      response: {
        data: { error: "Passwords do not match" },
      },
    });
    
    renderWithRouter(<ChangePassword />);
    
    fireEvent.change(screen.getByLabelText(/New Password/i), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "different123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update Password/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });
});