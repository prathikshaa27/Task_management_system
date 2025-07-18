import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import login_img from "../../assets/images/login_img.svg";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { loginFields } from "../../constants/authFormFields";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin-login";

  const { login, user } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const loggedInUser = await login(formData);
      if (loggedInUser) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          const currentRole = loggedInUser?.role;
          if (currentRole === "admin") {
            navigate("/admin-dashboard");
          } else {
            if (isAdminRoute) {
              setError("You are not authorized as an admin.");
              return;
            }
            navigate("/dashboard");
          }
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

   return (
    <FormWrapper onSubmit={handleSubmit}>
      <FormTitle>Login</FormTitle>
      {loginFields.map((field) => (
        <StyledInput
          key={field.name}
          type={field.type}
          placeholder={field.placeholder}
          value={formData[field.name] || ""}
          onChange={(e) => handleChange(e, field.name)}
        />
      ))}
      <StyledButton type="submit">Log In</StyledButton>
    </FormWrapper>
  );
}
