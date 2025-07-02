import React from "react";
import { Link } from "react-router-dom";
import welcome_img from "../../assets/images/welcome_img.jpg"

export default function WelcomeScreen(){
    return (
      <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${welcome_img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        minWidth: "100vw"
      }}
    >
      <h1 className="mb-4 text-center bg-dark bg-opacity-50 p-2 rounded">Welcome to Task App</h1>

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