import './App.css'
import React from 'react'
import {Routes,Route} from "react-router-dom"
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
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
import AdminDashboard from './components/Admin/AdminDashboard'
import { UserTaskDetail } from './components/Admin/UserTaskDetails'
import UserRoute from './routes/UserRoute'
import AdminRoute from './routes/AdminRoute'


function App() {

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/forgot-password" element={<ChangePassword/>} />
      <Route path="/dashboard" element={<UserRoute><MainLayout><Dashboard/></MainLayout></UserRoute>}/>
      <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard/></AdminRoute>}/>
      <Route path="/admin/tasks/:id" element={<AdminRoute><UserTaskDetail/></AdminRoute>}/>
      <Route path="/tasks/create" element={<UserRoute><MainLayout><TaskCreate /></MainLayout></UserRoute>} />
      <Route path="/tasks/update/:id" element={<UserRoute><MainLayout><TaskUpdate/></MainLayout></UserRoute>}/>
      <Route path="/tasks/:id" element={<UserRoute><MainLayout><TaskDetail/></MainLayout></UserRoute>}/>
      <Route path="/update-profile" element={<MainLayout><UpdateProfile /></MainLayout>} />
      <Route path="/calendar" element={<UserRoute><MainLayout><TaskCalendar/></MainLayout></UserRoute>}/>
    </Routes>   
  );
}
export default App
