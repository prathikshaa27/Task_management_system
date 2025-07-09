import React, { useState } from "react";
import { signupUser } from "../../services/auth";
import signup_img from "../../assets/images/signup_img.svg";
import { useNavigate ,Link} from "react-router-dom";
import {motion} from "framer-motion"
import { findElements } from "@fullcalendar/core/internal.js";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_check: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const[fieldErrors,setFieldErrors]= useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if(!formData.username.trim()){
      newErrors.username = "Username is required"
    }
    if(!formData.email.trim()){
      newErrors.email = "Email is required"
    }
    else if(!emailRegex.test(formData.email)){
      newErrors.email = "Please enter a valid email address"
    }

    
    if(!strongPasswordRegex.test(formData.password)){
      newErrors.password="Password msut be atleast 8 characters long and contain both letters and numbers"
    }

    if (formData.password !== formData.password_check) {
      newErrors.password_check="Passwords do not match."
    }
    if(Object.keys(newErrors).length>0){
      setFieldErrors(newErrors);
      return;
    }
    setFieldErrors({});
    try {
      await signupUser(formData);
      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Try again.");
    }
  };

  return (
    <div
    className="d-flex min-vh-100">
      <div className="d-none d-md-block col-md-6 bg-light justify-content align-items-center">
        <img
          src={signup_img}
          alt="signup-image"
          className="img-fluid p-4"
          style={{maxHeight: "80%", objectFit: "contain"}}
          />
         </div>
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-4 bg-light">
        <motion.div
           initial={{opacity: 0, y: 50}}
           animate={{opacity: 1, y: 0}}
           transition={{duration: 0.8}}
           className="w-100"
           style={{maxWidth:"400px"}}>
        <h2 className="text-center mb-3 fw-bold">Create Your Account</h2>
        <p className="text-muted text-center mb-4">Taskify and start managing your tasks like a pro ✨</p>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${fieldErrors.username? "is-invalid": ""}`}
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <label htmlFor="username">Username</label>
            {fieldErrors.username && (
              <div className="invalid-feedback">{fieldErrors.username}</div>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control ${fieldErrors.email? "is-invalid": ""}`}
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
            {fieldErrors.email && (
              <div className="invalid-feedback">{fieldErrors.email}</div>
            )}
            
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className={`form-control ${fieldErrors.password? "is-invalid": ""}`}
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
            {fieldErrors.password && (
              <div className="invalid-feedback">{fieldErrors.password}</div>
            )}
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className={`form-control ${fieldErrors.password_check? "is-invalid": ""}`}
              id="password_check"
              name="password_check"
              placeholder="Confirm Password"
              value={formData.password_check}
              onChange={handleChange}
              required
            />
            <label htmlFor="password_check">Confirm Password</label>
            {fieldErrors.password_check && (
              <div className="invalid-feedback">{fieldErrors.password_check}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
          <p className="text-center small">
            Already have an account?{" "}
            <Link to ="/login" className="text-decoration-none" fw-semibold text-primary>
            Log in
            </Link>
          </p>
        </form>
        </motion.div>
      </div>
    </div>
  );
}
