import {createContext,useContext,useState, Children } from "react";
import { loginUser,signupUser } from "../services/auth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


//creates the context
const AuthContext = createContext();
export const AuthProvider = ({children}) => {
    const[user,setUser] = useState(()=>{
        const token = localStorage.getItem("accessToken");
        return token?jwtDecode(token):null
    });

const navigate = useNavigate();

const login = async(credentials) => {
    const{access,refresh} = await loginUser(credentials)
    localStorage.setItem("accessToken",access);
    localStorage.setItem("refreshToken", refresh);
    setUser(jwtDecode(access));
    navigate('/dashboard')
};

const signup = async(data)=>{
    await signupUser(data)
    navigate('/login')
};
return(
    <AuthContext.Provider value={{user,login,signup}}>
        {children
        }
    </AuthContext.Provider>
)
};
export const useAuth = () =>useContext(AuthContext)
