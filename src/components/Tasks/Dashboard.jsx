import React from "react";
import TaskList from "./TaskList";
import ProfileMenu from "../Auth/ProfileMenu";
import { Link } from "react-router-dom";

export default function Dashboard(){
    return(
    <div className="bg-light min-vh-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center px-4 py-3 bg-white shadow-sm">
        <h2 className="m-0">📋 Task Manager</h2>
        <div className="d-flex align-items-center gap-3">
          <Link to="/calendar" className="btn btn-outline-primary">
            📅 Calendar
          </Link>
          <ProfileMenu />
        </div>
      </div>
      <div className="flex-grow-1 overflow-auto px-4 py-3">
        <TaskList />
      </div>
    </div>
  );
}