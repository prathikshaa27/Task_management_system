import React from "react";
import TaskList from "./TaskList";
import dashboard from "../../assets/images/dashboard.svg";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard(){
  const{role} = useAuth();
  const canAssign = role === "lead" ||role === 'senior';
    return(
    <div className="position-relative min-vh-100 d-flex flex-column" style={{
      background: "linear-gradient(135deg, #f2f4ff, #dbeafe)",
      overflow:"hidden"
    }}>
        <img
        src={dashboard}
        alt="dashboard.img"
        style={{
          position:"absolute",
          top : "5%",
          right: "5%",
          width: "250px",
          opacity: 0.05,
          zIndex: 0
        }}
        />

      <div className="py-4 px-4 shadow-sm w-100 dashboard-banner" 
      style={{ 
        backgroundColor: "#4f46e5",
        color: "#ffffff",
        zIndex: 1 
        }}>
        <h2 className="text-3xl font-bold text-white mb-2 text-3 text-center">Welcome to Your Task Dashboard 📋</h2>
          <p className="text-lg text-white text-center">Manage your tasks effectively, stay organized & stay ahead ✨</p>
          {canAssign && (
          <div className="text-center mt-3">
            <Link to="/tasks/assign" className="btn btn-warning shadow-sm fw-bold">
              <i className="bi bi-send-check-fill me-2"></i>
              Assign New Task
            </Link>
          </div>
        )}
          </div>
           <div className="flex-grow-1 overflow-auto px-4 py-3" style={{ zIndex: 1 }}>
        <TaskList />
        </div>
      </div>
  );
}