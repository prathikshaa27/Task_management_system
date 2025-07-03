import './App.css'
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



function App() {

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/forgot-password" element={<ChangePassword/>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
      <Route path="/tasks/create" element={<PrivateRoute><TaskCreate /></PrivateRoute>} />
      <Route path="/tasks/update/:id" element={<PrivateRoute><TaskUpdate/></PrivateRoute>}/>
      <Route path="/tasks/:id" element={<PrivateRoute><TaskDetail/></PrivateRoute>}/>
    </Routes>   
  );
}
export default App
