import React from "react";
<<<<<<< HEAD
import UserTasks from './UserTaskTable'
=======
import UserTasks from './UserTaskList'
import { Link } from "react-router-dom";
>>>>>>> UI changes for Task Dashboard and admin functionalities - 10-07-2025

export default function AdminDashboard(){
    return(
        <div className="container py-5">
<<<<<<< HEAD
            <h2 className="mb-4 fw-bold text-primary">Admin Dashboard</h2>
            <p className="text-muted">View all users and thier tasks</p>
            <UserTasks/>

        </div>
    );
}
=======
           <h2 className="mb-4 fw-bold text-primary">Admin Dashboard</h2>
            <p className="text-muted">View all users and thier tasks</p>
            <div className="mb-4">
                <Link to="/admin-analytics" className="btn btn-outline-primary">
                View Analytics</Link>
            </div>
            <UserTasks/>
        

        </div>
    );
}
>>>>>>> UI changes for Task Dashboard and admin functionalities - 10-07-2025
