import React, { useEffect, useState } from "react"
import Axios from "axios";
import { useNavigate } from "react-router-dom";


const Logout = () => {

  const navigate = useNavigate();
  
  useEffect(()=>{
    Axios.get("http://localhost:3001/logout").then((response) => {
      if(response.data.loggedout === true){
        console.log(response.data);
        navigate("/login");
      }
      else{
        navigate("/home");
      }
    })
  }, [])


  return 0;
  


}

export default Logout;
