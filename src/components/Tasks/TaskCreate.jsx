import React from "react";
import { createTask } from "../../services/task";
import TaskForm from "./TaskForm";
import { useNavigate } from "react-router-dom";
import {motion} from "framer-motion"

export default function TaskCreate(){
    const navigate = useNavigate();
    const handleCreate = async(data)=>{
        await createTask(data);
        navigate("/dashboard")
    };
    return(
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3">
            <motion.div
              className="w-100"
              style={{maxWidth:"600px"}}
              initial={{opacity: 0, y: 30}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6}}
            >
                <div className="text-center mb-4">
                    <p className="text-muted">Add a new task and stay organized!</p>
                </div>
            <TaskForm onsubmit={handleCreate}/>
            </motion.div>
        </div>
    );
}