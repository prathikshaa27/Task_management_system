import React,{useEffect,useState} from "react"
import { deleteTasks, fetchTasks } from "../../services/task"
import { Link } from "react-router-dom"

export default function TaskList(){
    const[tasks,setTasks] = useState([]);
    const[error,setError] = useState("");
    const[filters,setFilters] = useState({
        search:"",
        status:"",
        priority:"",
        ordering:""
    });
    const[categoies,setCategories] = useState("");
    const loadTasks = async() =>{
        try{
            const data = await fetchTasks(filters);
            setTasks(data)
        }
        catch(err){
            setError("Failed to load tasks")
        }
    };
    useEffect(()=>{
        loadTasks();
    },[filters]);
    

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
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    return(
        <div className="container py-5">
            <h2 className="mb-4">My Tasks</h2>
            <div className="row mb-3">
                <div className="col md-3">
                    <input type="text" className="form-control" placeholder="search tasks" name="search" value={filters.search} onChange={handleChange}/>
                </div>
                <div className="col md-2">
                    <select className="form-select" name="status" value={filters.status} onChange={handleChange}>
                        <option value="">All Status</option>
                        <option>Pending</option>
                        <option>In progress</option>
                        <option>Completed</option>
                    </select>
                </div>
                <div className="col md-2">
                    <select className="form-select" name="priority" value={filters.priority} onChange={handleChange}>
                        <option value="">All Priorities</option>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                    </div>
                <div className="col md-2">
                    <select className="form-select" name="ordering" value={filters.ordering} onChange={handleChange}>
                        <option value="">Sort by</option>
                        <option value="priority">Priority ↑</option>
                        <option value="-priority">Priority ↓</option>
                        <option value="due_date">Due Date ↑</option>
                        <option value="-due_date">Due Date ↓</option>
                    </select>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row mb-3"></div>
            <div className="col"></div>
            <Link to="/tasks/create" className="btn btn-success mb-3">Add New Task</Link>
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
            </div>
    );
}
