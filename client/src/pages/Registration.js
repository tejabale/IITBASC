import Axios from "axios";
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import '../styles/registration.css';
import Navbar from "./Navbar";




import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space, Tooltip } from 'antd';






const Registration = () => {


    

    const navigate = useNavigate();

    

    const [currSemCourses , setcurrSemCourses] = useState([]);
    const [id , setId] = useState("");
    const [searchResults , setSearchResult] = useState([]);
    const [displaymsg , setDisplaymsg] = useState("");
    const [text, setText] = useState("");
    const [sec, setSec] = useState({});




    const handleOnSearch = (string, results) => {
      setText(string);
      setSearchResult(results);
      setDisplaymsg("");
      setSec({});      
    };
  
    const handleOnHover = (result) => {
      setDisplaymsg("");
      setSec({});
    };
  
    const handleOnSelect = (item) => {
      let miniarray = [];
      miniarray.push(item)
      setSearchResult(miniarray);
      setDisplaymsg("");
      setSec({});
    };
  
    const handleOnFocus = () => {
      setDisplaymsg("");
      setSec({});
    };
  
    const handleOnClear = () => {
      setDisplaymsg("");
      setSec({});
    };
  
    function getData(){
      
      Axios.post("http://localhost:3001/registerCurrSemCourses").then((response) => {
        let array = [];
        for(let i in response.data.rows){
          let element = response.data.rows[i];
          element.id = i;
          element.course_id_title = `${element.course_id} : ${element.title}`;
          array.push(element)
        }

        let Clubdonecourses = [];
        let Newarray = [];

        

        for(let i in array){
          if(Clubdonecourses.includes(array[i].course_id)){
            continue;
          }
          else{
            let element = array[i];
            Clubdonecourses.push(array[i].course_id);
            element.menuProps = {items:[] , onClick: handleMenuClick};
            element.menuProps.items.push({
              label: element.sec_id,
              key: `${element.sec_id}:${element.course_id}`,
              icon: <data />,
            });
            for(let j in array){
              if( (array[i].course_id === array[j].course_id) && (array[i].sec_id !== array[j].sec_id)){
                element.menuProps.items.push({
                  label: array[j].sec_id,
                  key: `${array[j].sec_id}:${array[j].course_id}`,
                  icon: <data />,
                });
              }
            }
            Newarray.push(element);
          }

        }
        let sectionJson = {}
        for(let i in Newarray){
          sectionJson[Newarray[i].course_id] = "";
        }
        console.log(sectionJson);
        setSec(sectionJson);
        setcurrSemCourses(Newarray);
      })
    }

    Axios.defaults.withCredentials = true;
    useEffect(()=>{
      Axios.get("http://localhost:3001/session").then((response) => {
        if(response.data.loggedIn === true){
          setId(response.data.user.rows[0].id);
          getData();
        }
        else{
          navigate('/login')
        }
      })
    },[]);



    const register = (course) =>{

      let modifiedCourse = course;
      if(!sec[course.course_id]){
        message.info("Please select the section");
        return;
      }
      modifiedCourse.sec_id = sec[course.course_id];
      Axios.post("http://localhost:3001/registerbuttonCourse" , {
        course:modifiedCourse,
        id:id
      }).then((response) => {
          if(response.data.registered){
            setDisplaymsg(response.data.message);
            setText("");
          }
          else{
            setDisplaymsg(response.data.message);
          }
      })
      
    }

    const handleMenuClick = (e) => {
      let myArray = e.key.split(":");
      let js = {};
      js[myArray[1]] = myArray[0];
      setSec(js);
    };


    const handleButtonClick = (e) => {
      setSec({});
    };



  return (
    <body3 id="reg">
      <body6 id = "navbar">
        <Navbar/>
      </body6>
    <div className="App">
    <h1>Registration</h1>
    <div style={{ marginBottom: 20 }}><h1>Enter your Course Code or Course Name</h1></div>

    <div id="wrapper">
    <ReactSearchAutocomplete
    
      items={currSemCourses}
      onSearch={handleOnSearch}
      onHover={handleOnHover}
      onSelect={handleOnSelect}
      onFocus={handleOnFocus}
      onClear={handleOnClear}
      styling={{ zIndex: 1 }}
      inputSearchString = {text}
      
      fuseOptions={{ keys: ["course_id_title"] }}
      resultStringKeyName="course_id_title" 
      maxResults={10}
      autoFocus
    />

    </div>

    <div/>
    <div style={{ marginTop: 20 }}></div>
    </div>
    
    <div> 
    <h1>{displaymsg}</h1>
    <table id="keywords" cellSpacing="0" cellPadding="0">
      <thead>  
        <tr>
            <th><span>Course Code</span></th>
            <th><span>Course Name</span></th> 
            <th><span>Section</span></th> 
            <th><span>Register</span></th> 
        </tr>  
      </thead>

    {searchResults.map((course , index0)=>{

        return(
            <tbody key={index0}>
              <tr>  
                <td className="lalign">{course.course_id}</td>  
                <td className="lalign">{course.title}</td>  
                <td className="lalign">
                <Space wrap>
                <Dropdown.Button 
                  menu={course.menuProps} onClick={handleButtonClick}>
                  Section {sec[course.course_id]} 
                </Dropdown.Button>  
                </Space>
                </td>  
                
                <td><button onClick={() => register(course)}>Register</button></td> 
              </tr> 
            </tbody>  
        )

    })}

    </table>
    </div>
    </body3>

      
    );
}

export default Registration;