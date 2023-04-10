import React, { useEffect, useState } from "react"
import Axios from "axios";
import '../styles/login.css';
import { useNavigate } from "react-router-dom";


const Login = () => {


  

  const [id , setId] = useState("");
  const [password , setPassword] = useState("");
  const [loginStatus , setLoginStatus] = useState("");
  const [msg , setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    Axios.get("http://localhost:3001/session").then((response) => {
      if(response.data.loggedIn === true){
        setLoginStatus(response.data.user.rows[0].id);
        navigate("/home");
      }
    })
  }, [])

  Axios.defaults.withCredentials = true;

    const login = (e) => {
      e.preventDefault();
      Axios.post("http://localhost:3001/login", {
      id: id,
      password: password,
    }).then((response) => {
      if(response.data.message){
        setMsg(response.data.message);
      }
      else{
        setMsg(response.data[0].user);
        navigate("/home");
      }
    });
  };


  

  return (
    <body1 id = "login">
    <div className="Login">
    <div className="container" id="container">
      <div className="form-container sign-in-container">
        <form>
          <h1>Sign in</h1>
          <input 
            type="text" 
            placeholder="UserID"
            onChange={(e)=>{
              setId(e.target.value);
            }}
          />
          <input 
            type="password" 
            placeholder="Password"
            onChange={(e)=>{
              setPassword(e.target.value);
            }}
          />
          <button onClick={login}>Login</button>
          <br></br>
          <br></br>
          <h1>{msg}</h1>
        </form>
      </div>
    </div>
    </div>
    </body1>
  );
  


}

export default Login;
