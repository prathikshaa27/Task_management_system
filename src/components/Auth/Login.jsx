import React, { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import { loginUser } from "../../services/auth";
import signup_image from "../../assets/images/signup_image.jpg";
import { useAuth } from "../../context/AuthContext";

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

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
            style={{
              backgroundImage: `url(${signup_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
              minHeight: "100vh",
              minWidth: "100vw"
            }}
          >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "1rem",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
      >
       <h2 className="text-center mb-4">
  {success 
    ? `Welcome back, ${formData.username}!` 
    : "Welcome Back"}
</h2>


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
        </form>
      </div>
    </div>
  );
}
