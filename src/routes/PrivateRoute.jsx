import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

export default function PrivateRoute({children}){
    PrivateRoute.propTypes={
            children: PropTypes.node.isRequired
        }
    const{user} = useAuth()
    return user?children:<Navigate to="/login"/>
}