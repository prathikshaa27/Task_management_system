import {createContext,useContext,useState, Children } from "react";
import { loginUser,signupUser } from "../services/auth";
import { jwtDecode } from "jwt-decode";



//creates the context
const AuthContext = createContext();
export const AuthProvider = ({children}) => {
    const[user,setUser] = useState(()=>{
        const token = localStorage.getItem("access");
        return token?jwtDecode(token):null
    });

const login = async(credentials) => {
    const{access,refresh} = await loginUser(credentials)
    localStorage.setItem("access",access);
    localStorage.setItem("refresh", refresh);
    setUser(jwtDecode(access));
    return true;
};

const signup = async(data)=>{
    await signupUser(data)
    return true;
};
return(
    <AuthContext.Provider value={{user,login,signup}}>
        {children
        }
    </AuthContext.Provider>
)
};
export const useAuth = () =>useContext(AuthContext)
