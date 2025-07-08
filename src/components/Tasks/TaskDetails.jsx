import React,{useEffect,useState} from "react";
import { fetchTasks } from "../../services/task";
import { useParams,Link } from "react-router-dom";


export default function TaskDetail(){
    const{id} = useParams();
    const[task,setTask]  = useState(null);
    const[error,setError] = useState("");

    useEffect(()=>{
        const load = async()=>{
            try{
            const allTasks = await fetchTasks();
            const foundTasks = allTasks.results.find((t)=>t.id===parseInt(id));
            setTask(foundTasks)       
        }
        catch(err){
          console.error("Error loading task details", err);
          setError("Failed to load Task details");
        }
    };
    load()
    },[id]);
    if (error) return <div className="alert alert-danger">{error}</div>
    if (!task) return <p>Loading Task details</p>
    return (
  <div className="container py-5">
    <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
      <h2 className="mb-4 text-dark fw-bold">
        <i className="bi bi-journal-text me-2 text-secondary"></i>
        {task.title}
      </h2>

      <div className="mb-3">
        <strong>Description:</strong>
        <p className="text-muted mt-1">{task.description}</p>
      </div>

      <div className="mb-2">
        <strong>Status:</strong>{" "}
        <span className="badge bg-info">{task.status}</span>
      </div>

      <div className="mb-2">
        <strong>Priority:</strong>{" "}
        <span
          className={`badge ${
            task.priority === "High"
              ? "bg-danger"
              : task.priority === "Medium"
              ? "bg-warning text-dark"
              : "bg-success"
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="mb-2">
        <strong>Due Date:</strong>{" "}
        <span className="text-secondary">{task.due_date}</span>
      </div>

      <div className="mb-3">
        <strong>Categories:</strong>
        {task.category_names && task.category_names.length > 0 ? (
          <ul className="list-inline mt-1">
            {task.category_names.map((name, idx) => (
              <li
                key={idx}
                className="list-inline-item badge bg-secondary me-2"
              >
                {name}
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-muted d-block mt-1">No categories</span>
        )}
      </div>

      <Link to="/dashboard" className="btn btn-outline-primary mt-3">
        <i className="bi bi-arrow-left-circle me-1"></i> Back to Dashboard
      </Link>
    </div>
  </div>
);
}