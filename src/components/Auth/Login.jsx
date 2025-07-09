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
    role:""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const[fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if(!formData.username.trim()){
      errors.username = "Username is required"
    }
    if(!formData.password.trim()){
      errors.password = "Password is required"
    }
    if(!formData.role){
      errors.role="Please sleect a role"
    }
    
    if(Object.keys(errors).length>0){
      setFieldErrors(errors);
      return
    }
    try {
      const isLoggedIn = await login(formData);
      if (isLoggedIn) {
        setSuccess("Login successful! Redirecting...");
        const userRole = formData.role;
        console.log("Role is", userRole)
        console.log(formData)
        setTimeout(() =>  {
          if(userRole === "admin"){
            navigate("/admin-dashboard");
          }else{
            navigate("/dashboard")
          }
        },1000)
      }
    } catch (err) {
      console.error(err);
      const backendError = err.response?.data.error|| "Invalid username or password";
      setError(backendError);
    }
  };
  console.log("Image source:", login_img);

  return (
    <div className="d-flex min-vh-100">
      <div className="d-none d-md-block col-md-6 bg-light justify-content align-items-center position-relative">
      
        <motion.div
          initial={{opacity: 0, x: -40}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.6}}
          >
          <img
          src={login_img}
          alt="login_image"
          className="img-fluid p-4"
          style={{
    maxHeight: "70vh",
    maxWidth: "85%",
    objectFit: "contain",
    filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.1))"
  }}
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
              type="password"
              className={`form-control ${fieldErrors.password? "is-invalid": ""}`}
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
            {fieldErrors.password && (
              <div className="invalid-feedback">{fieldErrors.password}</div>
            )}
            </div>
            
          <div className="form-floating mb-4">
              <select
                className={`form-select ${fieldErrors.role?"is-invalid":""}`}
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                >
                  <option value="">Login as...</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <label htmlFor="role">Role</label>
                {fieldErrors.role &&(<div className="invalid-feedback">{fieldErrors.role}</div>)}
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
