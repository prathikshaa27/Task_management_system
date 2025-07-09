import React from "react";
import UserTasks from './UserTaskTable'

export default function AdminDashboard(){
    return(
        <div className="container py-5">
            <h2 className="mb-4 fw-bold text-primary">Admin Dashboard</h2>
            <p className="text-muted">View all users and thier tasks</p>
            <UserTasks/>

        </div>
    );
}