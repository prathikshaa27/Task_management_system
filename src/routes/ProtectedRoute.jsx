import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Nav } from "react-bootstrap";

export default function ProtectedRoute({children, allowedRoles}){
    const{user} = useAuth();
    if(!user){
        return <Navigate to ="/login" replace/>;
    }
    if(allowedRoles?.length && !allowedRoles.includes(user.role)){
        return <Navigate to="/not-authorized" replace/>;
    }
    return children;

}