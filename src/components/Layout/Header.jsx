import React from "react";
import { Link } from "react-router-dom";
import ProfileMenu from "../Auth/ProfileMenu";

export default function Header(){
    return(
        <header className="bg-dark text-white py-3 px-4 d-flex justify-content-between align-items-center">
             <Link to="/dashboard" className="text-white text-decoration-none">
            <h3>📝 Task Manager</h3>
            </Link>
            <nav>
                 <Link to="/calendar" className="text-white me-3 text-decoration-none"> 📅 Calendar</Link>
                <ProfileMenu/>
               <Link to="/login" className="btn btn-sm btn-outline-light">Logout</Link> 
            </nav>

        </header>
    );   
}