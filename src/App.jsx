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
<<<<<<< HEAD
import { UserTaskDetail } from './components/Admin/UserTaskDetails'
import UserRoute from './routes/UserRoute'
import AdminRoute from './routes/AdminRoute'

=======
import UserTaskDetail from './components/Admin/UserTaskDetail'
import ProtectedRoute from './routes/ProtectedRoute'
import NotAuthorized from './Pages/NotAuthorized'
import AdminDashboardAnalytics from './components/Admin/DashboardAnalytics'
>>>>>>> UI changes for Task Dashboard and admin functionalities - 10-07-2025

function App() {

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/forgot-password" element={<ChangePassword/>} />
<<<<<<< HEAD
      <Route path="/dashboard" element={<UserRoute><MainLayout><Dashboard/></MainLayout></UserRoute>}/>
      <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard/></AdminRoute>}/>
      <Route path="/admin/tasks/:id" element={<AdminRoute><UserTaskDetail/></AdminRoute>}/>
      <Route path="/tasks/create" element={<UserRoute><MainLayout><TaskCreate /></MainLayout></UserRoute>} />
      <Route path="/tasks/update/:id" element={<UserRoute><MainLayout><TaskUpdate/></MainLayout></UserRoute>}/>
      <Route path="/tasks/:id" element={<UserRoute><MainLayout><TaskDetail/></MainLayout></UserRoute>}/>
      <Route path="/update-profile" element={<MainLayout><UpdateProfile /></MainLayout>} />
      <Route path="/calendar" element={<UserRoute><MainLayout><TaskCalendar/></MainLayout></UserRoute>}/>
=======
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["user"]}><MainLayout><Dashboard/></MainLayout></ProtectedRoute>}/>
      <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><MainLayout><AdminDashboard/></MainLayout></ProtectedRoute>}/>
      <Route path="/tasks/create" element={<ProtectedRoute allowedRoles={["user"]}><MainLayout><TaskCreate /></MainLayout></ProtectedRoute>} />
      <Route path="/tasks/update/:id" element={<ProtectedRoute allowedRoles={["user"]}><MainLayout><TaskUpdate/></MainLayout></ProtectedRoute>}/>
      <Route path="/tasks/:id" element={<ProtectedRoute allowedRoles={["user"]}><MainLayout><TaskDetail/></MainLayout></ProtectedRoute>}/>
      <Route path="/admin/tasks/:id" element={<ProtectedRoute allowedRoles={["admin"]}><MainLayout><UserTaskDetail/></MainLayout></ProtectedRoute>}/>
      <Route path="/admin-analytics" element={<ProtectedRoute allowedRoles={["admin"]}><MainLayout><AdminDashboardAnalytics/></MainLayout></ProtectedRoute>}/>
      <Route path="/update-profile" element={<MainLayout><UpdateProfile /></MainLayout>} />
      <Route path="/calendar" element={<PrivateRoute><MainLayout><TaskCalendar/></MainLayout></PrivateRoute>}/>
      <Route path="/not-authorized" element={<NotAuthorized/>}/>

>>>>>>> UI changes for Task Dashboard and admin functionalities - 10-07-2025
    </Routes>   
  );
}
export default App
