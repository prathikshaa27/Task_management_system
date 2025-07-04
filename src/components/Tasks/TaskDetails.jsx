import React,{useEffect,useState} from "react";
import { fetchTasks } from "../../services/task";
import { useParams,Link } from "react-router-dom";


export default function TaskDetail(){
    const{id} = useParams();
    const[task,setTask]  = useState("null");
    const[error,setError] = useState("");

    useEffect(()=>{
        const load = async()=>{
            try{
            const allTasks = await fetchTasks();
            const foundTasks = allTasks.find((t)=>t.id===parseInt(id));
            setTask(foundTasks)       
        }
        catch(err){
            setError("Failed to load Task details");
        }
    };
    load()
    },[id]);
    if (error) return <div className="alert alert-danger">{error}</div>
    if (!task) return <p>Loading Task details</p>
    return(
        <div className="container py-5">
            <div className="card shadow p-4">
                <h2 className="mb-3">{task.title}</h2>
                <p><strong>Description: </strong>{task.description}</p>
                <p><strong>Priority: </strong>{task.priority}</p>
                <p><strong>Status: </strong>{task.status}</p>
                <p><strong>Due Date: </strong>{task.due_date}</p>
                <p><strong>Categories: </strong>{task.category_names && task.category_names.length > 0 ? (
    <ul className="list-inline mb-0">
      {task.category_names.map((name, idx) => (
        <li key={idx} className="list-inline-item me-2">{name}</li>
      ))}
    </ul>
  ) : (
    <span className="text-muted">No categories</span>
  )}
                </p>
                <Link to ="/dashboard" className="btn btn-secondary mt-3">← Back to Dashboard</Link>
            </div>
        </div>
    );
}