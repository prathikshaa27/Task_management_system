import './App.css'
import {Routes,Route} from "react-router-dom"
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import PrivateRoute from './routes/PrivateRoute'
import WelcomeScreen from './components/Auth/WelcomeScreen'
import 'bootstrap/dist/css/bootstrap.min.css';
import ChangePassword from './components/Auth/ForgotPassword'
import Dashboard from './components/Tasks/Dashboard'


function App() {

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/forgot-password" element={<ChangePassword/>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
    </Routes>   
  );
}
export default App
