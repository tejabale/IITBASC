import React from "react";
import { BrowserRouter as Router, Route, Routes , useNavigate} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Instructor from "./pages/Instructor";
import Dept_running from "./pages/Dept_running"
import Running from "./pages/Running";
import Course from './pages/Course';
import Logout from "./pages/Logout";



function App() {
  return (
      <Router>
        <Routes>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/logout" element={<Logout />}></Route>
        <Route exact path="/" element={<Dashboard />}></Route>
        <Route exact path="/home" element={<Home />}></Route>
        <Route exact path="/home/registration" element={<Registration />}></Route>
        <Route exact path="/course/running/:dept_name" element={<Dept_running />}></Route>
        <Route exact path="/course/running" element={<Running />}></Route>
        <Route exact path="/course/:courseid" element={<Course />}></Route>
        <Route exact path="/instructor/:instructor_id" element={<Instructor />}></Route>
        </Routes>
      </Router>
  );
}

export default App;