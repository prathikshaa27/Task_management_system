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
        ordering:"",
        page: 1,
    });
    const[notifications,setNotifications] = useState([]);
    const[showNotifications,setShowNotifications] = useState(true);
    const[totalPages,setTotalPages] = useState(1)
    console.log("Notifications:", notifications);
    console.log("showNotifications:", setNotifications);
    useEffect(() => {
  const loadNotifications = async () => {
    try {
      const data = await fetchTaskNotifications();
      const incompleteTasks = data.filter(
        (task)=> task.status!="Completed"
      );
      setNotifications(incompleteTasks);
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
            setTasks(data.results);
            const total = Math.ceil(data.count/10);
            setTotalPages(total)
        }
        catch(err){
            console.error("Error loading tasks",err)
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
                console.error("Error deleting tasks", err)
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
    return(
      <div>
  {showNotifications && notifications.length > 0 && (
    <div className="mb-4">
      <div className="alert alert-light border border-warning border-3 rounded shadow-sm">
        <div className="d-flex flex-column align-items-center mb-3 text-center">
          <div
            className="bg-warning bg-opacity-25 text-warning rounded-circle d-flex align-items-center justify-content-center mb-3"
            style={{ width: "45px", height: "45px" }}
          >
            <i className="bi bi-bell-fill fs-4"></i>
          </div>
          <div className="flex-grow-1">
            <h5 className="mb-1 fw-bold text-warning text-center">Upcoming Task Reminders</h5>
            <p className="mb-0 text-muted small text-center">
              You have <strong>{notifications.length}</strong> task{notifications.length > 1 ? "s" : ""} due soon. Don’t miss them!
            </p>
          </div>
        </div>

        <ul className="list-group list-group-flush">
          {notifications.map((task) => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center px-0"
            >
              <div>
                <Link
                  to={`/tasks/${task.id}`}
                  className="text-decoration-none text-dark fw-semibold"
                >
                  <i className="bi bi-check2-circle me-2 text-primary"></i>
                  {task.title}
                </Link>
                <div className="text-muted small ms-4">
                  Due on <strong className="text-danger">{task.due_date}</strong>
                </div>
              </div>
              <Link
                to={`/tasks/${task.id}`}
                className="btn btn-sm btn-outline-primary"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )}    
  <div className="card shadow-sm p-4 mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="🔍 Search..." name="search" value={filters.search} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <select className="form-select" name="status" value={filters.status} onChange={handleChange}>
              <option value="">All Status</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" name="priority" value={filters.priority} onChange={handleChange}>
              <option value="">All Priorities</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" name="ordering" value={filters.ordering} onChange={handleChange}>
              <option value="">Sort by</option>
              <option value="priority">Priority ↑</option>
              <option value="-priority">Priority ↓</option>
              <option value="due_date">Due Date ↑</option>
              <option value="-due_date">Due Date ↓</option>
            </select>
          </div>
          <div className="col-md-3 text-end">
            <Link to="/tasks/create" className="btn btn-success w-100 w-md-auto">
              <i className="bi bi-plus-circle me-1"></i> Add Task
            </Link>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {tasks.length === 0 ? (
        <p className="text-muted text-center">No tasks found.</p>
      ) : (
        <>
          <div className="row g-4">
            {tasks.map((task) => (
              <div className="col-md-6 col-lg-4" key={task.id}>
                <div className="card task-card shadow-sm border-0 h-100 rounded-4 p-3 bg-white">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{task.title}</h5>
                    <p className="text-muted mb-2">{task.description}</p>
                    <p className={`mb-1 ${isOverdue(task.due_date) ? "text-danger fw-bold" : ""}`}>
                      <i className="bi bi-calendar-event me-1"></i> Due: {task.due_date}
                    </p>
                      <p className="text-muted mb-2">Status : {task.status}</p>
                    <div className="mb-2">
                      <strong>Priority:</strong>{" "}
                      <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>{task.priority}</span>
                    </div>
                    <div className="mb-2">
                      <strong>Categories:</strong>{" "}
                      {task.category_names.length > 0 ? (
                        <ul className="list-inline mb-0">
                          {task.category_names.map((cat) => (
                            <li className="list-inline-item" key={cat}>
                              <span className="badge bg-secondary">{cat}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <em className="text-muted">None</em>
                      )}
                    </div>
                    <div className="mt-auto d-flex justify-content-center align-items-center gap-2 pt-3">
                      <Link to={`/tasks/${task.id}`} className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center">
                        <i className="bi bi-eye"></i>
                      </Link>
                      <Link to={`/tasks/update/${task.id}`} className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button onClick={() => handleDelete(task.id)} className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-2">
              <button
                className="btn btn-outline-dark"
                disabled={filters.page <= 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
              >
                ◀ Previous
              </button>
              <span className="fw-semibold text-center">
                Page {filters.page} of {totalPages}
              </span>
              <button
                className="btn btn-outline-dark"
                disabled={filters.page >= totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
              >
                Next ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
