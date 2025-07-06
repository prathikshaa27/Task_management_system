import React,{useEffect,useState} from "react"
import { deleteTasks, fetchTaskNotifications, fetchTasks } from "../../services/task"
import { Link } from "react-router-dom"
import { badgeClassMap } from "../../utils/priorityUtils";

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
    const[notifications,setNotifications] = useState([]);
    const[showNotifications,setShowNotifications] = useState(true);
    console.log("Notifications:", notifications);
    console.log("showNotifications:", setNotifications);
    useEffect(() => {
  const loadNotifications = async () => {
    try {
      const data = await fetchTaskNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch the tasks", err);
    }
  };
  loadNotifications();
}, []);
  
    useEffect(() => {
    const timer = setTimeout(() => {
        setShowNotifications(false);
        setNotifications([]);
    }, 2 * 60 * 1000); 

    return () => clearTimeout(timer);
}, []);

    
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

  function getPriorityBadgeClass(priority){
    return badgeClassMap[priority]||"bg-secondary";
  }

  const isOverdue = (dueDate)=>{
    return new Date(dueDate) < new Date();
  };
  const getDueColor = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "text-danger";     
    if (diffDays === 2) return "text-warning";    
    return "";
};

 
    return(
        <div className="container py-5">
            {showNotifications && notifications.length>0 && (
  <div className="alert alert-warning">
    <strong>Reminder!</strong> You have {notifications.length} task{notifications.length > 1 && 's'} due soon:
    <ul className="mb-0">
      {notifications.map((task) => (
        <li key={task.id}>
          <strong>{task.title}</strong> — 
          <span className={`ms-1 fw-semibold ${getDueColor(task.due_date)}`}>
            Due on <em>{task.due_date}</em>
          </span>
        </li>
      ))}
    </ul>
  </div>
)}
            <h2 className="mb-4">My Tasks</h2>
            <div className="row mb-3">
                <div className="col-md-3">
                    <input type="text" className="form-control" placeholder="search tasks" name="search" value={filters.search} onChange={handleChange}/>
                </div>
                <div className="col-md-2">
                    <select className="form-select" name="status" value={filters.status} onChange={handleChange}>
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
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
                <div className="row g-4">
    {tasks.map((task) => (
      <div className="col-md-6 col-lg-4" key={task.id}>
        <div className="card h-100 shadow-sm">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{task.title}</h5>
            <p className="card-text">
              <strong>Status:</strong> {task.status}<br />
              </p>
            <p className={`card-text ${isOverdue(task.due_date) ? 'text-danger fw-bold' : ''}`}>
                <strong>Due Date:</strong>{task.due_date}
            </p>
            
            <div className="mb-2">
              <strong>Priority:</strong>{" "}
              <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <div className="mb-2">
              <strong>Categories:</strong><br />
              {task.category_names && task.category_names.length > 0 ? (
                <ul className="list-inline mb-0">
                  {task.category_names.map((cat, idx) => (
                    <li className="list-inline-item" key={idx}>
                      <span className="badge bg-secondary">{cat}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <em className="text-muted">No categories</em>
              )}
            </div>
            <div className="mt-auto">
              <Link to={`/tasks/${task.id}`} className="btn btn-sm btn-outline-secondary me-2">
                View
              </Link>
              <Link to={`/tasks/update/${task.id}`} className="btn btn-sm btn-outline-primary me-2">
                Edit
              </Link>
              <button
                onClick={() => handleDelete(task.id)}
                className="btn btn-sm btn-outline-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
            )}
            </div>
            </div>
);
}

               