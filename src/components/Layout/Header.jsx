import React from "react";
import { Link,useNavigate } from "react-router-dom";
import ProfileMenu from "../Auth/ProfileMenu";
import { useAuth } from "../../context/AuthContext";

export default function Header(){
  const{user,logout} = useAuth();
  const navigate = useNavigate();
  const homeLink = user?.role === "admin" ? "/admin-dashboard": "/dashboard";
  const handleLogout = () =>{
    logout();
    navigate("/login", {replace:true});
  }
    return (
<header className="bg-info bg-opacity-10 py-3 border-bottom">
<div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
<Link
to={homeLink}
className="text-decoration-none d-flex align-items-center gap-2"
>
<i className="bi bi-check2-square fs-4 text-primary"></i>
<h4 className="fw-bold text-dark mb-0 fs-2">Task Manager</h4>
</Link>
<div className="d-flex align-items-center gap-4 me-4">
{user?.role &&["junior","senior","lead"].includes(user?.role)&& (
<Link
to="/calendar"
className="text-dark text-decoration-none fw-semibold d-flex align-items-center gap-1 fs-5"
>
<i className="bi bi-calendar-event-fill"></i> Calendar
</Link>
 )}
<div className="d-flex align-items-center fs-5">
<ProfileMenu />
</div>
<button
onClick={handleLogout}
to="/login"
className="btn btn-outline-danger btn-sm fw-semibold d-flex align-items-center gap-1 fs-6"
>
<i className="bi bi-box-arrow-right"></i> Logout
</button>
</div>
</div>
</header>
 );
}