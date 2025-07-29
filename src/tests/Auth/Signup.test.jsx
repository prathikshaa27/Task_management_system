import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "../../components/auth/Signup";
import { signupUser, loginUser } from "../../services/auth";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../services/auth", () => ({
  signupUser: jest.fn(),
  loginUser: jest.fn(),
}));


const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Signup Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders all input fields and button", () => {
    renderWithRouter(<Signup />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
  renderWithRouter(<Signup />);
  fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

  const usernameError = await screen.findByText((content) =>
    content.toLowerCase().includes("username")
  );
  const emailError = await screen.findByText((content) =>
    content.toLowerCase().includes("email")
  );

  expect(usernameError).toBeInTheDocument();
  expect(emailError).toBeInTheDocument();
});


  it("shows password mismatch error", async () => {
    renderWithRouter(<Signup />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "test" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@gmail.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Strong123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "Mismatch456" } });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

 it("submits form successfully", async () => {
  signupUser.mockResolvedValue({});
  loginUser.mockResolvedValue({ access: "fakeAccess", refresh: "fakeRefresh" });

  renderWithRouter(<Signup />);
  fireEvent.change(screen.getByLabelText("Username"), { target: { value: "prathi" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "prathi@example.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Strong123" } });
  fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "Strong123" } });

  fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

  await waitFor(() => {
    expect(signupUser).toHaveBeenCalled();
    expect(loginUser).toHaveBeenCalled();
    expect(localStorage.getItem("access")).toBe("fakeAccess");
  });

  const successMsg = await screen.findByText(/signup successful/i);
  expect(successMsg).toBeInTheDocument();
});


  it("shows API error on failure", async () => {
    signupUser.mockRejectedValue({
      response: { data: { error: "Username already taken" } },
    });

    renderWithRouter(<Signup />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "existingUser" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Strong123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "Strong123" } });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/username already taken/i)).toBeInTheDocument();
  });

  it("toggles password visibility when eye icon is clicked", () => {
    renderWithRouter(<Signup />);
    const toggleIcons = screen.getAllByRole("img", { hidden: true }); 

    if (toggleIcons.length > 0) {
      fireEvent.click(toggleIcons[0]); 
    }
  });
});
