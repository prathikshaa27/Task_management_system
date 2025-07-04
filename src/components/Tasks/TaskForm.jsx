import React,{useState,useEffect} from "react";
import {fetchCategories} from "../../services/task"

export default function TaskForm({initialData={},onsubmit,isEdit=false}){

    const[formData,setFormData] = useState({
        title: "",
        description : "",
        priority: "Medium",
        due_date:"",
        status:"Pending",
        category:[],
        ...initialData
    });
    const[error,setError] = useState("");
    const [categories, setCategories] = useState([]);

   useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);
    const handleChange = (e) =>{
        const{name,value} = e.target;
        setFormData(prev=>({...prev,[name]:value}));
        setError("");
    };
      const handleCheckboxChange = (e) => {
    const categoryId = parseInt(e.target.value);
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        category: [...prev.category, categoryId],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        category: prev.category.filter((id) => id !== categoryId),
      }));
    }
  };

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try{
            await onsubmit(formData);
        }
        catch{
            setError("Failed to submit. Please try again");
        }
    };
    return(
        <form onSubmit={handleSubmit} className="card p04 shadow">
            <h4 className="mb-4">{isEdit ? "update Task" : "Create Task"}</h4>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
                <label className="form-label">Title</label>
                <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required/>
            </div>
            <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} required/>
            </div>
            <div className="mb-3">
                <label className="form-label">Priority</label>
                <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Due Date</label>
                <input type="date" name="due_date" className="form-control" value={formData.due_date} onChange={handleChange} required/>
            </div>
            <div className="mb-3">
                <label className="form-label">Status</label>
                <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>
                </div>
                <div className="mb-4">
        <label className="form-label">Categories</label>
        {categories.length === 0 ? (
          <p className="text-muted">No categories available</p>
        ) : (
          <div className="d-flex flex-wrap gap-4">
            {categories.map((cat) => (
              <div className="form-check" key={cat.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={cat.id}
                  id={`cat-${cat.id}`}
                  checked={formData.category.includes(cat.id)}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor={`cat-${cat.id}`}>
                  {cat.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
                
                <button type="submit" className="btn btn-primary w-100">
                    {isEdit ? "Update" : "Create"} 
                </button>
        </form>
    );
}