import React, {useEffect,useState} from "react";
import { updateTask,fetchTasks } from "../../services/task";
import { useParams,useNavigate } from "react-router-dom";
import TaskForm from "./TaskForm";

export default function TaskUpdate(){
    const{id} = useParams();
    const navigate = useNavigate();
    const[initialData,setInitialData] = useState(null);

    useEffect(()=>{
        const load = async()=>{
            const allTasksResponse = await fetchTasks();
            const task = allTasksResponse.results.find(t=>t.id === parseInt(id));
            setInitialData(task)
        };
        load();
    },[id]);

    const handleUpdate = async(data)=>{
        await updateTask(id,data);
        navigate("/dashboard");
    };
    return(
        <div className="container py-5">
            {initialData ? <TaskForm initialData={initialData} onsubmit={handleUpdate} isEdit/> : <p>Loading...</p>}
        </div>
    );
}