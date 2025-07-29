import "./App.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import WelcomeScreen from "./components/auth/WelcomeScreen";
import "bootstrap/dist/css/bootstrap.min.css";
import ChangePassword from "./components/auth/ForgotPassword";
import Dashboard from "./components/tasks/Dashboard";
import TaskCreate from "./components/tasks/TaskCreate";
import TaskUpdate from "./components/tasks/TaskUpdate";
import TaskDetail from "./components/tasks/TaskDetails";
import UpdateProfile from "./components/auth/UpdateProfile";
import TaskCalendar from "./components/tasks/TaskCalender";
import MainLayout from "./components/layout/MainLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserTaskDetail from "./components/admin/UserTaskDetail";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotAuthorized from "./pages/NotAuthorized";
import AdminDashboardAnalytics from "./components/admin/DashboardAnalytics";
import ManageUsers from "./components/admin/ManageUsers";
import TaskAssign from "./components/admin/TaskAssign";
import AssignedTasksDashboard from "./components/tasks/AssignedTaskDashbord";

function App() {
  return (
    <>
    <ToastContainer position="top-right" autoClose={5000} />
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ChangePassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["junior", "senior", "lead"]}>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/create"
        element={
          <ProtectedRoute allowedRoles={["junior", "senior", "lead"]}>
            <MainLayout>
              <TaskCreate />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/update/:id"
        element={
          <ProtectedRoute allowedRoles={["junior", "senior", "lead"]}>
            <MainLayout>
              <TaskUpdate />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <ProtectedRoute allowedRoles={["junior", "senior", "lead"]}>
            <MainLayout>
              <TaskDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/assign"
        element={
          <ProtectedRoute allowedRoles={["junior", "senior", "lead"]}>
            <MainLayout>
              <TaskAssign />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tasks/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MainLayout>
              <UserTaskDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-analytics"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MainLayout>
              <AdminDashboardAnalytics />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
  path="/tasks/assigned"
  element={
    <ProtectedRoute allowedRoles={["junior", "senior", "lead"]}>
      <MainLayout>
        <AssignedTasksDashboard />
      </MainLayout>
    </ProtectedRoute>
  }
/>

      
      <Route
        path="/manage-users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MainLayout>
              <ManageUsers />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/update-profile"
        element={
          <MainLayout>
            <UpdateProfile />
          </MainLayout>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TaskCalendar />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/not-authorized" element={<NotAuthorized />} />
    </Routes>
    </>
  );
}
export default App;
