import React from "react";
import { createTask } from "../../services/task";
import TaskForm from "./TaskForm";
import { useNavigate } from "react-router-dom";

export default function TaskCreate(){
    const navigate = useNavigate();
    const handleCreate = async(data)=>{
        await createTask(data);
        navigate("/tasks")
    };
    return(
        <div className="container py-5">
            <TaskForm onsubmit={handleCreate}/>
        </div>
    );
}