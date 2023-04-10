import Axios from "axios";
import React, { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import '../App.css';
import { useNavigate } from "react-router-dom";




//const [Venue  , setVenue ] =useState("");

//const [pname  , setpname] = useState("");



// const getData = (id , setTitle ,  setCredits ) => {
    
    // Axios.get(`http://localhost:3001/course/${id}`, {id : id}
    //   ).then((response) => {
    //     //console.log(response.data);
    //   //setId(response.data[0].course_id);
    //   //console.log(c_id);
    //   setTitle(response.data[0].title);
    //   setCredits(response.data[0].credits);
    //   //setVenue(response.data[0].building);
    // });
  
//   }

// const getData2 = (id, setpid) => {
  
//   Axios.get(`http://localhost:3001/course2/${id}`, {id : id}
//   ).then((response) => {
//     console.log(response.data);
    // let array = new Array;
    // for(let i in response.data){
    //   array.push(<li> {response.data[i].p_id} : <NavLink to = {`/course/${response.data[i].p_id}`}>{response.data[i].p_title}</NavLink></li>);
    //   //array.push(<li>{response.data[i].p_title}</li>);
    // }
    // //console.log(pid);
    // setpid(array);
// });

// }


// const getData3 = (id, setIname) => {
  
//   Axios.get(`http://localhost:3001/course3/${id}`, {id : id}
//   ).then((response) => {
//     //console.log(response.data);
    // let array2 = new Array;
    // for(let i in response.data){
    //   array2.push(<li>{response.data[i].name}</li>);
    //   //array.push(<li>{response.data[i].p_title}</li>);
    // }
    // //console.log(pid);
    // setIname(array2);
// });

// }


const Course = () => {
    //console.log(params.courseid);;
    const params = useParams();
    const id = params.courseid;
    const [Title , setTitle] = useState("");
    const [Credits  , setCredits ] =useState("");
    const [pid  , setpid] = useState({});
    const [Iname  , setIname] = useState([]);
    const [iid , setId] = useState("");
    const navigate = useNavigate();


    function fetchData() {
      Axios.all([
        Axios.get(`http://localhost:3001/course1/${id}`,{id : id}),
        Axios.get(`http://localhost:3001/course2/${id}`,{id : id}),
      ]).then(Axios.spread((data1,data2) => {
      //console.log(response.data);
      setTitle(data1.data[0].title);
      setCredits(data1.data[0].credits);
      let array = new Array;
      for(let i in data2.data){
        if(data2.data[i].p_id){
          array.push(<li className="Link"> {data2.data[i].p_id} : <NavLink to = {`/course/${data2.data[i].p_id}`} style={({ isActive }) => ({
            color: isActive ? '#fff' : 'darkred',
            textDecoration: 'none'
          })}>{data2.data[i].p_title}</NavLink></li>);
        }
      }
      // if(!(array.length)){
      //   array.push(<h2>No Prerequisites for this Course.</h2>)
      // }
      setpid(array)
      let array2 = new Array;
      for(let i in data1.data){
        if(data1.data[i].id){
          array2.push(<li className="Link"><NavLink to ={`/instructor/${data1.data[i].id}`} style={({ isActive }) => ({
            color: isActive ? '#fff' : 'darkred',
            textDecoration: 'none'
          })}>{data1.data[i].name}</NavLink> (sec:{data1.data[i].sid})</li>);
        }
      }
      //console.log(pid);
      // if(!(array2.length)){
      //   array2.push(<b>This Course is not Running in the Current Semester</b>)
      // }
      console.log(data1.data);
      setIname(array2);

    }));
    }
    
    useEffect(() => {
      fetchData();
    }, [id]);
    //console.log(Iname.length);

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
    
    if(Iname.length && pid.length){
      return (
        
        <body class="mav">
          <body6 id = "navbar">
          <Navbar/>
        <div className="App">
          <h1 className="course-header">COURSE INFO</h1>
          <div className="courses">
            <h2 className="courseh2">ID: {id}</h2>
            <h2 className="courseh2">Name: {Title}</h2>
            {/* <p>Venue: {Venue}</p> */}
            <h2 className="courseh2">Total Credits: {Credits}</h2>
            <h2 className="courseh2">Prerequisites:</h2>
            <ul className="clist">{pid}</ul>
            <h2 className="courseh2">Instructors:</h2>
            <ul className="clist">{Iname}</ul>
          </div>
        </div>
        </body6>
        </body>
        
        
      );
    }
    else if(pid.length){
      return (
        
        <body class="mav">
          <body6 id = "navbar">
          <Navbar/>
        <div className="App">
          <h1 className="course-header">COURSE INFO</h1>
          <div className="courses">
            <h2 className="courseh2">ID: {id}</h2>
            <h2 className="courseh2">Name: {Title}</h2>
            {/* <p>Venue: {Venue}</p> */}
            <h2 className="courseh2">Total Credits: {Credits}</h2>
            <h2 className="courseh2">Prerequisites:</h2>
            <ul className="clist">{pid}</ul>
          </div>
        </div>
        </body6>
        </body>
        
        
      );
    }
    else if(Iname.length){
      return (
        
        <body class="mav">
          <body6 id = "navbar">
          <Navbar/>
        <div className="App">
          <h1 className="course-header">COURSE INFO</h1>
          <div className="courses">
            <h2 className="courseh2">ID: {id}</h2>
            <h2 className="courseh2">Name: {Title}</h2>
            {/* <p>Venue: {Venue}</p> */}
            <h2 className="courseh2">Total Credits: {Credits}</h2>
            <h2 className="courseh2">Prerequisites: <b>NONE</b></h2>
            <h2 className="courseh2">Instructors:</h2>
            <ul className="clist">{Iname}</ul>
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
        <div className="App">
          <h1 className="course-header">COURSE INFO</h1>
          <div className="courses">
            <h2 className="courseh2">ID: {id}</h2>
            <h2 className="courseh2">Name: {Title}</h2>
            {/* <p>Venue: {Venue}</p> */}
            <h2 className="courseh2">Total Credits: {Credits}</h2>
            <h2 className="courseh2">Prerequisites: <b>NONE</b></h2>
          </div>
        </div>
        </body6>
        </body>
        
        
      );
    }
    
}

export default Course;