import { Navigate } from "react-router-dom";
import { useAuth} from "../context/AuthContext";

export default function UserRoute({children}){
    const{user} = useAuth();

    if(!user) return <Navigate to ="/login"/>;
    if(user.role !== "user") return <Navigate to ="/admin-dashboard"/>;
    return children
}