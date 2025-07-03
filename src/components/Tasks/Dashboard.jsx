import React from "react";
import TaskList from "./TaskList";
import ProfileMenu from "../Auth/ProfileMenu";

export default function Dashboard(){
    return(
        <div className="relative min-h-screen bg-gray-100">
      <ProfileMenu />
        <div className="container py-5">
            <h1 className="mb-4">Dashboard</h1>
            <TaskList/>
        </div>
        </div>
    );
}