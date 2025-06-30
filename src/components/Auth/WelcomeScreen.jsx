import React from "react";
import { Link } from "react-router-dom";
import welcome_img from "../../assets/images/welcome_img.jpg"

export default function WelcomeScreen(){
    return(
        <div className="flex flex-col items-center justify-center h-screen">
        <img src={welcome_img} alt="welcome" className="w-64 mb-6"/>
        <h1 className="text-3xl mb-4">Welcome to Task App</h1>
        <div className="flex space-x-4"></div>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign up</Link>    
        </div>
    );
}