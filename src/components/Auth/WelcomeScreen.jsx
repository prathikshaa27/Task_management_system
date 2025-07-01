import React from "react";
import { Link } from "react-router-dom";
import welcome_img from "../../assets/images/welcome_img.jpg"

export default function WelcomeScreen(){
    return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <img
        src={welcome_img}
        alt="Welcome"
        className="img-fluid mb-4"
        style={{ maxWidth: "250px", borderRadius: "1rem" }}
      />

      <h1 className="mb-4 text-center">Welcome to Task App</h1>

      <div className="d-flex gap-3">
        <Link to="/login" className="btn btn-primary px-4">
          Login
        </Link>
        <Link to="/signup" className="btn btn-outline-primary px-4">
          Sign Up
        </Link>
      </div>
    </div>
  );
}