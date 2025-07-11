import React from "react";
import UserTasks from './UserTaskList'
import { Link } from "react-router-dom";

export default function AdminDashboard(){
    return(
        <div className="container py-5">
           <h2 className="mb-4 fw-bold text-primary text-center">Admin Dashboard</h2>
            <p className="text-muted text-center">View all users and thier tasks</p>
            <div className="d-flex justify-content-center">
                <Link to="/admin-analytics" className="btn btn-outline-primary">
                View Analytics</Link>
            </div>
            <Link to="/manage-users" className="btn btn-outline-success">
            Manage Users
            </Link>
            <UserTasks/>
        

        </div>
    );
}
