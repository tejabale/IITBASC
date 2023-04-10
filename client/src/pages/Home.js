import Axios from "axios";
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import  '../styles/home.css'
import Navbar from "./Navbar";



const Home = () => {

  
    const [id, setId ] = useState("");

    const navigate = useNavigate();
    const [name , setName] = useState("");
    const [department , setDepartment] = useState("");
    const [credits  , setCredits ] =useState("");

    const [finalarray , finalarraySet] = useState([]);
    const [currSemarray , setcurrSem] = useState([]);
    const [currSemYearAndSemster , setcurrSemYearAndSemster] = useState([]);
    let array = [];
    let currSem = [];

    Axios.defaults.withCredentials = true;

    useEffect(()=>{
      Axios.get("http://localhost:3001/session").then((response) => {
        if(response.data.loggedIn === true){
          setId(response.data.user.rows[0].id);
        }
        else{
          navigate('/login')
        }
        return (response.data.user.rows[0].id);
      })
      .then((id) => {
        getData(id);
      })

    }, [])

const Drop = (course) => {

  Axios.post("http://localhost:3001/drop" , {
    course:course,
  }).then((response) => {
      console.log("Dropped the course" );
      setcurrSem(currSemarray.filter(item => item.course_id !== course.course_id));
  })

}


  const getData = (ID)=>{

    Axios.all([
      Axios.post("http://localhost:3001/homeUser", {
        id: ID
      }),
      Axios.post("http://localhost:3001/homePrevSems", {
        id: ID
      }),
      Axios.post("http://localhost:3001/homeCourse", {
          id: ID
      }),
      Axios.post("http://localhost:3001/homeCurrSem", {
          id: ID
      })
    ])
    .then(Axios.spread((data1, data2,data3, data4) => {
        setName(data1.data.name);
        setDepartment(data1.data.dept_name);
        setCredits(data1.data.tot_cred);
  
        const student =  {
          name: data1.data.name , 
          dept_name: data1.data.dept_name, 
          tot_cred: data1.data.tot_cred, 
          years: data2.data.rows, 
          courses: data3.data.rows,
          currSem: data4.data.rows
        };
        
        setcurrSemYearAndSemster(student.currSem[0]);
        

        if(array.length != 0){
          array = []
        }

        let finalyears = [];

        for(let i in student.years){
          let isthere = 0;
          for(let j in student.courses){
            if(student.years[i].year == student.courses[j].year && student.years[i].semester == student.courses[j].semester){
              isthere = 1;
              break;
            }
          }
          if(isthere == 1){  
            finalyears.push({year: student.years[i].year ,semester: student.years[i].semester });
          }
        }


        for(let i in finalyears){
          let array2 = []
          for(let j in student.courses){
            if(finalyears[i].year == student.courses[j].year && finalyears[i].semester == student.courses[j].semester){
              array2.push(student.courses[j])
            }
          }
    
          array.push({ year: finalyears[i].year,semester:finalyears[i].semester , course:array2});
          
        }
      
        finalarraySet(array);

        if(currSem.length != 0 ){
          currSem = [];
        }
        for(let i in student.courses){
          if(student.currSem[0].year == student.courses[i].year && student.currSem[0].semester == student.courses[i].semester){
            currSem.push(student.courses[i])
          }
        }

        setcurrSem(currSem);


    }))
  }
  
  

  
  return (
   
    <body2 id="home">
       <body6 id = "navbar">
        <Navbar/>
      </body6>
    <div id="wrapper">

         <h1>ID: {id}</h1>
         <h1>Name: {name}</h1>
         <h1>Department: {department}</h1>
         <h1>Total Credits: {credits}</h1>
         <h1>Running Semster----Year:{currSemYearAndSemster.year} Semester:{currSemYearAndSemster.semester}</h1>
         <div> 
          <table id="keywords" cellSpacing="0" cellPadding="0">
            <thead>  
              <tr>
                  <th><span>Course Code</span></th> 
                  <th><span>Section</span></th> 
                  <th><span>Course Name</span></th> 
                  <th><span>Credits</span></th> 
                  <th><span>Drop</span></th> 
              </tr>  
            </thead>

          {currSemarray.map((course , index0)=>{

              return(
                  <tbody>
                    <tr key={index0}>  
                      <td className="lalign">{course.course_id}</td>  
                      <td className="lalign">{course.sec_id}</td>  
                      <td className="lalign">{course.title}</td>  
                      <td className="lalign">{course.credits}</td> 
                      <td><button onClick={() => Drop(course)}>Drop</button></td> 
                    </tr> 
                  </tbody>  
              )

          })}

          </table>
        </div>


         {finalarray.map((semes, index) =>{
              
              return(
                <div id="table">
                <h1>Year:{semes.year} Semester:{semes.semester}</h1>
                <table id="keywords" cellSpacing="0" cellPadding="0"> 
                  <thead>
                  
                    <tr key = {index}>  
                      
                      <th><span>Course Code</span></th> 
                      <th><span>Section</span></th> 
                      <th><span>Course Name</span></th> 
                      <th><span>Credits</span></th> 
                      <th><span>Grade</span></th> 
                      
                    </tr>  
                  </thead>

                  <tbody>
                    {
                      semes.course.map((course, index1) => {  
                        return(
                          <tr key={index1}>  
                            <td className="lalign">{course.course_id}</td> 
                            <td className="lalign">{course.sec_id}</td>  
                            <td className="lalign">{course.title}</td>  
                            <td className="lalign">{course.credits}</td>  
                            <td className="lalign">{course.grade}</td>  
                          </tr> 
                        ) 
                      })
                    }
                  </tbody> 
                </table>
                </div>
              )
         })}

        
        </div>
    </body2>

      
    );
}

export default Home;