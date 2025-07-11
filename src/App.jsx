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
import UserTaskDetail from './components/Admin/UserTaskDetail'
import ProtectedRoute from './routes/ProtectedRoute'
import NotAuthorized from './Pages/NotAuthorized'
import AdminDashboardAnalytics from './components/Admin/DashboardAnalytics'
import ManageUsers from './components/Admin/ManageUsers'
import TaskAssign from './components/Admin/TaskAssign'


function App() {

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/forgot-password" element={<ChangePassword/>} />
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["junior","senior","lead"]}><MainLayout><Dashboard/></MainLayout></ProtectedRoute>}/>
      <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><MainLayout><AdminDashboard/></MainLayout></ProtectedRoute>}/>
      <Route path="/tasks/create" element={<ProtectedRoute allowedRoles={["junior","senior","lead"]}><MainLayout><TaskCreate /></MainLayout></ProtectedRoute>} />
      <Route path="/tasks/update/:id" element={<ProtectedRoute allowedRoles={["junior","senior","lead"]}><MainLayout><TaskUpdate/></MainLayout></ProtectedRoute>}/>
      <Route path="/tasks/:id" element={<ProtectedRoute allowedRoles={["junior","senior","lead"]}><MainLayout><TaskDetail/></MainLayout></ProtectedRoute>}/>
      <Route path="/tasks/assign" element={<ProtectedRoute allowedRoles={["junior","senior","lead"]}><MainLayout><TaskAssign/></MainLayout></ProtectedRoute>}/>
      <Route path="/admin/tasks/:id" element={<ProtectedRoute allowedRoles={["admin"]}><MainLayout><UserTaskDetail/></MainLayout></ProtectedRoute>}/>
      <Route path="/admin-analytics" element={<ProtectedRoute allowedRoles={["admin"]}><MainLayout><AdminDashboardAnalytics/></MainLayout></ProtectedRoute>}/>
      <Route path="/manage-users" element={<ProtectedRoute allowedRoles={["admin"]}><MainLayout><ManageUsers/></MainLayout></ProtectedRoute>}/>
      <Route path="/update-profile" element={<MainLayout><UpdateProfile /></MainLayout>} />
      <Route path="/calendar" element={<ProtectedRoute><MainLayout><TaskCalendar/></MainLayout></ProtectedRoute>}/>
      <Route path="/not-authorized" element={<NotAuthorized/>}/>
    </Routes>   
  );
}
export default App
