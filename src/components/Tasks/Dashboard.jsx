import React from "react";
import TaskList from "./TaskList";

export default function Dashboard(){
    return(
        <div className="container py-5">
            <h1 className="mb-4">Dashboard</h1>
            <TaskList/>
        </div>
    );
}