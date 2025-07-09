import React from "react";
import { Link } from "react-router-dom";
import welcome_img from "../../assets/images/welcome_img.jpg"
import { PersonPlus,BoxArrowInRight } from "react-bootstrap-icons";
import {motion} from "framer-motion"

export default function WelcomeScreen(){
    return (
      <motion.div
         initial ={{opacity: 0, x: "-100vw"}}
         animate ={{opacity: 1, x: 0}}
         transition={{duration: 1}}
         className="vh-100 d-flex justify-content-center align-items-center text-white position-relative"
         style={{
         backgroundImage: `url(${welcome_img})`,
         backgroundSize: "cover",
         backgroundPosition: "center",
      }}
    >
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>
      <div className="container position-relative text-center px-4">
      <h1 className="display-5 fw-bold mb-3">Welcome to Taskify</h1>
      <p className="lead mb-4">Your smart companion for managing tasks with clarity and ease.</p>

      <div className="d-flex gap-3 d-sm-flex justify-content-center">
        <Link to="/signup" className="btn btn-outline-light btn-lg px-4">
        <PersonPlus className="me-2"/>Get Started   
        </Link>
        <Link to="/login" className="btn btn-primary btn-lg px-4">
          <BoxArrowInRight className="me-2"/>Login
        </Link>
      </div>
    </div>
    </motion.div>
  );
}

