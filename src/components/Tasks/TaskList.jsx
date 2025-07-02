import React,{useEffect,useState} from "react"
import { deleteTasks, fetchTasks } from "../../services/task"
import { Link } from "react-router-dom"

export default function TaskList(){
    const[tasks,setTasks] = useState([]);
    const[error,setError] = useState("");

    const loadTasks = async() =>{
        try{
            const data = await fetchTasks();
            setTasks(data)
        }
        catch(err){
            setError("Failed to load tasks")
        }
    };
    useEffect(()=>{
        loadTasks();
    },[]);

    const handleDelete = async(id) =>{
        if(window.confirm("Are you sure you want to delete this task?")){
            try{
                await deleteTasks(id)
                loadTasks();
            }
            catch(err){
                setError("Delete failed")
            }
        }
    };
    return(
        <div className="container py-5">
            <h2 className="mb-4">My Tasks</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <Link to="/tasks/create" className="btn btn-success mb-3">+ New Task</Link>
            {tasks.length === 0?(
                <p>No tasks found</p>
            ):(
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Title</th>
                                <th>Priority</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task=>(
                                <tr key={task.id}>
                                    <td>{task.title}</td>
                                    <td>{task.priority}</td>
                                    <td>{task.due_date}</td>
                                    <td>{task.status}</td>
                                    <td>
                                        <Link to={`/tasks/update/${task.id}`} className="btn btn-sm btn-primary me-2">
                                        Edit
                                        </Link>   
                                        <button onClick={()=>handleDelete(task.id)} className="btn btn-sm btn-danger">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                        </div>              
            )}
            </div>
    );
}
