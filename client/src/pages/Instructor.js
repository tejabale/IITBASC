import Axios from "axios";
import React, { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import '../App.css'



const Instructor = () => {
    //console.log(params.courseid);;
    const params = useParams();
    const id = params.instructor_id;
    //console.log(id);
    const [Name , setName] = useState("");
    const [dept  , setdept ] =useState("");
    const [currcor  , setcurrcor] = useState([]);
    const [pastcor  , setpastcor] = useState([]);
    const [iid , setId] = useState("");

    function fetchData() {
      Axios.all([
        Axios.get(`http://localhost:3001/instructor1/${id}`,{id : id}),
        Axios.get(`http://localhost:3001/instructor2/${id}`,{id : id}),
        Axios.get(`http://localhost:3001/instructor3/${id}`,{id : id})
      ]).then(Axios.spread((data1,data2,data3) => {
        setName(data3.data[0].name);
        setdept(data3.data[0].dept_name);
        let array = new Array;
        //console.log(data2.data);
        for(let i in data1.data){
            if(data1.data.length){
                array.push(<li className="Link"> {data1.data[i].course_id}  <NavLink to = {`/course/${data1.data[i].course_id}`} style={({ isActive }) => ({
                    color: isActive ? '#fff' : 'darkred',
                    textDecoration: 'none'
                  })}>{data1.data[i].title}</NavLink> </li>);
            }
          }
        // if(data1.data.length){;}
        // else{
        //     array.push(<b>Teaches No Course in Current Semester.</b>);
        // }
        setcurrcor(array);
        let array2 = new Array;
        for(let i in data2.data){
            if(data2.data.length){
                array2.push(<li className="Link">{data2.data[i].course_id} : {data2.data[i].title}({data2.data[i].year}:{data2.data[i].sem})</li>);
            }
        }
        //console.log("-------",array2);
       // console.log(array2);
    //    if(data2.data.length){
    //         ;
    //     }
    //     else{
    //         array2.push(<b>No Courses taught in previous semesters.</b>);
    //     }
        setpastcor(array2);
      }))
    }
    useEffect(() => {
      fetchData();
    }, [id]);
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

    if(currcor.length && pastcor.length){
        return (
        <body class="mav">
          <body6 id = "navbar">
          <Navbar/>

            <div>
                <h1 className="Instructor-header">INSTRUCTOR INFO</h1>
                <div className="Instructor">
                <h2 className="courseh2">Name: {Name}</h2>
                <h2 className="courseh2">Department: {dept}</h2>
                <h2 className="courseh2">Current Courses:</h2>
                <ul className="clist">{currcor}</ul>
                <h2 className="courseh2">Previous Courses:</h2>
                <ul className="clist">{pastcor}</ul>
                </div>
            </div>
            </body6>
            </body>
          );
    }
    else if(currcor.length){
        return (
        <body class="mav">
          <body6 id = "navbar">
          <Navbar/>

            <div>
                <h1 className="Instructor-header">INSTRUCTOR INFO</h1>
                <div className="Instructor">
                <h2 className="courseh2">Name: {Name}</h2>
                <h2 className="courseh2">Department: {dept}</h2>
                <h2 className="courseh2">Current Courses:</h2>
                <ul className="clist">{currcor}</ul>
                <h2 className="courseh2">Previous Courses: <b> NONE</b></h2>
                </div>
            </div>
            </body6>
            </body>
          );
    }
    else if(pastcor.length){
        return (
        <body class="mav">
          <body6 id = "navbar">
          <Navbar/>

            <div>
                <h1 className="Instructor-header">INSTRUCTOR INFO</h1>
                <div className="Instructor">
                <h2 className="courseh2">Name: {Name}</h2>
                <h2 className="courseh2">Department: {dept}</h2>
                <h2 className="courseh2">Current Courses: <b>NONE</b></h2>
                <h2 className="courseh2">Previous Courses:</h2>
                <ul className="clist">{pastcor}</ul>
                </div>
            </div>
            </body6>
            </body>
          );
    }
    else{
        return (
        <body class="mav">
          <body6 id = "navbar">
          <Navbar/>

            <div>
                <h1 className="Instructor-header">INSTRUCTOR INFO</h1>
                <div className="Instructor">
                <h2 className="courseh2">Name: {Name}</h2>
                <h2 className="courseh2">Department: {dept}</h2>
                <h2 className="courseh2">Current Courses:<b>NONE</b></h2>
                <h2 className="courseh2">Previous Courses:<b>NONE</b></h2>
                </div>
            </div>
            </body6>
            </body>
          );
        
    }
    
}

export default Instructor;