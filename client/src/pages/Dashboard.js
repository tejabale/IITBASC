import React from "react";
import {Link} from "react-router-dom"
const Dashboard = () =>{
    return (
        <body1 id = "login">
        <div>
          <h1>Dashboard Page</h1>
          <br />
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
        </body1>
      );
}

export default Dashboard;