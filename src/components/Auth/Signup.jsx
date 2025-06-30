import React, {useState} from "react";
import { useAuth } from "../../context/AuthContext";

export default function Signup(){
    const{signup} = useAuth();
    const[form,setForm] = useState({username:"",email:"",password:""});
    const handleChange = (e) =>setForm({...form,[e.target.name]: e.target.value});
    const handleSubmit = async(e)=>{
        e.preventDeafault();
    try{
        await signup(form);
    }
    catch{
        alert("Signup failed");
    }
    };
    return(
        <form onSubmit={handleSubmit} className='w-full max-w-sm mx-auto'>
        <input name='username' value={form.usernmae} onChange={handleChange}/>
        <input name='password'type='password' value={form.password} onChange={handleChange}/>
        <button type='submit'>Login</button>
        </form>
    );

}