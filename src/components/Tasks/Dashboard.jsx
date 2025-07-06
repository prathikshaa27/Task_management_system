import React from "react";
import TaskList from "./TaskList";

export default function Dashboard(){
    return(
    <div className="bg-light min-vh-100 d-flex flex-column">
      <div className="flex-grow-1 overflow-auto px-4 py-3">
        <TaskList />
      </div>
    </div>
  );
}