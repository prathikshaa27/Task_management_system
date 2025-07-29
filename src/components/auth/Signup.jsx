import React, { useState } from "react";
import { loginUser, signupUser } from "../../services/auth";
import signup_img from "../../assets/images/signup_img.svg";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { signupFields } from "../../forms/formFields";
import FormRenderer from "../common/FormRenderer";

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
    <div className="d-flex min-vh-100">
      <div className="d-none d-md-block col-md-6 bg-light justify-content align-items-center">
        <img
          src={signup_img}
          alt="signup-image"
          className="img-fluid p-4"
          style={{ maxHeight: "80%", objectFit: "contain" }}
        />
      </div>

      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-4 bg-light">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-100"
          style={{ maxWidth: "400px" }}
        >
          <h2 className="text-center mb-3 fw-bold">Create Your Account</h2>
          <p className="text-muted text-center mb-4">
            Taskify and start managing your tasks like a pro ✨
          </p>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <FormRenderer
              fields={signupFields}
              formData={formData}
              fieldErrors={fieldErrors}
              handleChange={handleChange}
              toggles={{
                password: showPassword,
                password_check: showConfirmPassword,
              }}
              setToggles={(state) => {
                if (state.password !== undefined) setShowPassword(state.password);
                if (state.password_check !== undefined)
                  setShowConfirmPassword(state.password_check);
              }}
            />

            <button type="submit" className="btn btn-primary w-100">
              Sign Up
            </button>

            <p className="text-center small">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none fw-semibold text-primary">
                Log in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}