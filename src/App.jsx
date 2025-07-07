import './App.css'
import React from 'react'
import {Routes,Route} from "react-router-dom"
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import PrivateRoute from './routes/PrivateRoute'
import WelcomeScreen from './components/Auth/WelcomeScreen'
import 'bootstrap/dist/css/bootstrap.min.css';
import ChangePassword from './components/Auth/ForgotPassword'
import Dashboard from './components/Tasks/Dashboard'
import TaskCreate from './components/Tasks/TaskCreate'
import TaskUpdate from './components/Tasks/TaskUpdate'
import TaskDetail from './components/Tasks/TaskDetails'
import UpdateProfile from './components/Auth/UpdateProfile'
import TaskCalendar from './components/Tasks/TaskCalender'
import MainLayout from './components/Layout/MainLayout'


function App() {

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/forgot-password" element={<ChangePassword/>} />
      <Route path="/dashboard" element={<PrivateRoute><MainLayout><Dashboard/></MainLayout></PrivateRoute>}/>
      <Route path="/tasks/create" element={<PrivateRoute><MainLayout><TaskCreate /></MainLayout></PrivateRoute>} />
      <Route path="/tasks/update/:id" element={<PrivateRoute><MainLayout><TaskUpdate/></MainLayout></PrivateRoute>}/>
      <Route path="/tasks/:id" element={<PrivateRoute><MainLayout><TaskDetail/></MainLayout></PrivateRoute>}/>
      <Route path="/update-profile" element={<MainLayout><UpdateProfile /></MainLayout>} />
      <Route path="/calendar" element={<PrivateRoute><MainLayout><TaskCalendar/></MainLayout></PrivateRoute>}/>
    </Routes>   
  );
}
export default App
