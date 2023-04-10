import Axios from "axios";
import React, { useEffect, useState } from "react"
//import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import '../App.css';
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";



const getData = (setDname) => {

    Axios.get("http://localhost:3001/course/running",
      ).then((response) => {
        //console.log(response);
        let array = new Array;
        for(let i in response.data){
          array.push(<li className="Link"><NavLink to = {`/course/running/${response.data[i].dname}`} style={({ isActive }) => ({
            color: isActive ? '#fff' : 'darkred',
            textDecoration: 'none'
          })} >{response.data[i].dname}</NavLink></li>);
          //array.push(<li>{response.data[i].p_title}</li>);
        }
        setDname(array);
    });
  
    // let years;
    // Axios.post("http://localhost:3001/home1", {
    //   id: id
    // }).then((response) => {
    //   years = response.data.rows;
    //   return years;
    // }).then((years) => {
    //     Axios.post("http://localhost:3001/home2", {
    //       id: id
    //     }).then((response2)=>{
    //       console.log(years);
    //       console.log(response2);
  
    //     })
      
    // });
  }

const Running = () => {
    //const params = useParams();
    //console.log(params.courseid);
    //const id = params.courseid;
    const [DName , setDname] = useState("");
    const [iid , setId] = useState("");

    // const [Credits  , setCredits ] =useState("");
    // const [Venue  , setVenue ] =useState("");
    getData(setDname);
    const navigate = useNavigate();
    Axios.defaults.withCredentials = true;
    useEffect(()=>{
      Axios.get("http://localhost:3001/session").then((response) => {
        if(response.data.loggedIn === true){
          setId(response.data.user.rows[0].id);
        }
        else{
          navigate('/login')
        }
      })
    },[]);

    return (
      <body class="mav">
        <body6 id = "navbar">
          <Navbar/>
        <div>
          {/* <b className="Running-info">This page contains the names of departments which offer courses running this semester.</b> */}
          <h1 className="running-header">DEPARTMENT NAMES</h1>
          <div className="Running">
            <ul>
              {DName}
            </ul>
          </div>
        </div>
        </body6>
        </body>
      );
    
}

export default Running;