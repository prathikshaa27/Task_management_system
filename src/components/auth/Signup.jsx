import React, { useState } from "react";
import { loginUser, signupUser } from "../../services/auth";
import signup_img from "../../assets/images/signup_img.svg";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { signupFields } from "../../constants/authFormFields";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_check: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!strongPasswordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and contain both letters and numbers";
    }

    if (formData.password !== formData.password_check) {
      newErrors.password_check = "Passwords do not match.";
    }
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }
    setFieldErrors({});
    try {
      await signupUser(formData);
      const loginResponse = await loginUser({
        username: formData.username,
        password: formData.password,
      });
      localStorage.setItem("access", loginResponse.access);
      localStorage.setItem("refresh", loginResponse.refresh);
      setSuccess("Signup successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Try again.");
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <FormTitle>Signup</FormTitle>
      {signupFields.map((field) => (
        <StyledInput
          key={field.name}
          type={field.type}
          placeholder={field.placeholder}
          value={formData[field.name] || ""}
          onChange={(e) => handleChange(e, field.name)}
        />
      ))}
      <StyledButton type="submit">Register</StyledButton>
    </FormWrapper>
  );
}
