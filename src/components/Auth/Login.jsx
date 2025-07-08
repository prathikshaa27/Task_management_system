import React, { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import login_img from "../../assets/images/login_img.svg";
import { useAuth } from "../../context/AuthContext";
import {motion} from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const{login} = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isLoggedIn = await login(formData);
      if (isLoggedIn) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (err) {
      console.error(err);
      setError("Invalid username or password.");
    }
  };
  console.log("Image source:", login_img);

  return (
    <div className="d-flex min-vh-100">
      <div className="d-none d-md-block col-md-6 bg-light justify-content align-items-center">
        <motion.div
          initial={{opacity: 0, x: -40}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.6}}
          >
          <img
          src={login_img}
          alt="login_image"
          className="img-fluid p-4"
          style={{maxHeight: "400px",width:"auto", objectFit:"contain"}}
          />
          </motion.div>
        </div>
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-4 bg-light">
          <motion.div
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
            className="w-100"
            style={{maxWidth:"400px"}}
            >
              <h2 className="text-center mb-3 fw-bold">Welcome Back</h2>
              <p className="text-muted text-center mb-4">
                Log in and let the productivity begin!
              </p>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <label htmlFor="username">Username</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="mb-3 text-end">
            <Link to="/forgot-password" className="text-decoration-none small text-primary">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Log In
          </button>
          <p className="text-center small mt-3">
            New user?{" "}
            <Link to="/signup" className="text-decoration-none">Create an account</Link>
          </p>
        </form>
        </motion.div>
      </div>
    </div>
  );
}
