import Axios from "axios";
import React, { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom";
import '../App.css'
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";



const getData = (name , setTitle) => {

    Axios.get(`http://localhost:3001/course/running/${name}`, {name : name}
      ).then((response) => {
        //console.log(response.data);
        let array = new Array;
        //let array2 = new Array;
        for(let i in response.data){
          array.push(<li className="Link"><NavLink to = {`/course/${response.data[i].c_id}`} style={({ isActive }) => ({
            color: isActive ? '#fff' : 'darkred',
            textDecoration: 'none'
          })}>{response.data[i].title}</NavLink></li>);
          //array.push(<li>{response.data[i].p_title}</li>);
        }
        setTitle(array);
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

const Dept_running = () => {
    const params = useParams();
    //console.log(params.courseid);
    const name = params.dept_name;
    const [Title , setTitle] = useState("");
    // const [Credits  , setCredits ] =useState("");
    // const [Venue  , setVenue ] =useState("");
    getData(name , setTitle );
    const [iid , setId] = useState("");

    useEffect(() => {
      getData();
    }, [name]);

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
          <h1 className="Dep-header">COURSES RUNNING</h1>
          <div className="Department">
          <b className="DepName"> Department: {name}</b>
          <br></br>
          <br></br>
          <h2 className="Depcourses">Courses:</h2>
            <ul className="DepList">
              {Title}
            </ul>
          </div>
            
        </div>
        </body6>
        </body>
      );
    
}

export default Dept_running;