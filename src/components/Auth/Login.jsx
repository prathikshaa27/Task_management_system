import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext';
export default function Login(){
    const{login} = useAuth();
    const[form,setForm] = useState({"username":"",password:""})
    const handleChange = (e) =>setForm({...form,[e.target.name]: e.target.value});
    const handleSubmit = async(e)=>{
        e.preventDeafault();
    try{
        await login(form);
    }
    catch{
        alert("Invalid credentials");
    }
    };
    return(
        <form onSubmit={handleSubmit} className='w-full max-w-sm mx-auto'>
        <input name='username' value={form.usernmae} onChange={handleChange}/>
        <input name='email' value={form.email} onChange={handleChange}/>
        <input name='username'type='password' value={form.password} onChange={handleChange}/>
        <button type='submit'>Get Started</button>
        </form>
    );
}
