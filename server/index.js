const express = require("express");
const cors = require("cors");
const app = express();

const bcrypt = require("bcrypt");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const client_object= require("./config")



app.use(express.json());
app.use(cors({
    origin: ("http://localhost:3000"),
    methods: ["GET" , "POST"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(
    session({
        key : "userId",
        secret: "iitbombay",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 24*60*60*1000,
        }
}));

const {Client} = require("pg");

const client = new Client(client_object.client);

client.connect();

// client.query( "select * from user_password where ID = ? and hashed_password = ?" ,
// [54321, 123] , (err, res) =>{

//     if(!err){
//         console.log(res.rows);
//     }else{
//         console.log(err.message);
//     }

//     client.end

// });

app.get("/session", (req,res)=>{
    if(req.session.user){//extract and read the cookie
        res.send({loggedIn: true, user: req.session.user})
    }
    else{
        res.send({loggedIn: false})
    }
})

app.post('/login' , (req,res)=>{
    
    const id = req.body.id;
    const password = req.body.password;

    client.query(
        `select * from user_password where ID = '${id}'` ,
        (err , result)=>{
            if(err){
                console.log(err);
            }
            else{
                if(result.rows.length > 0){
                    bcrypt.compare(password , result.rows[0].hashed_password , (error , response)=>{
                        if(response){
                            req.session.user = result;
                            res.send(result.rows);
                        }
                        else{
                            res.send({message: "Wrong Id and password combination"});
                        }
                    })
                }
                else{
                    res.send({message: `User with ID ${id} doesn't exits`});
                }
            }
        }
    );
});

app.get('/logout' , (req,res)=>{
    res.clearCookie("userId" , {path : "/"});
    req.session.destroy(() =>{
        res.send({loggedout:true});
    });
    
});

app.post('/homeUser' , (req,res)=>{
    const id = req.body.id;
    client.query(
        "select * from student where ID = $1" ,[id] ,
        (err , result)=>{
            if(err){
                console.log(err);
            }
            else{
                if(result.rows.length > 0){
                    //console.log(result);
                    let details = {
                        "id": result.rows[0].id ,
                        "name": result.rows[0].name,
                        "dept_name": result.rows[0].dept_name,
                        "tot_cred": result.rows[0].tot_cred}
                    res.send(details);
                }
            }
        }
    );
});


app.post('/homePrevSems' , (req,res)=>{
    const id = req.body.id;
    client.query(
        "with max_time(max_value) as(\
            select max(start_time) from reg_dates where start_time<current_timestamp\
        )\
        select year,semester from reg_dates,max_time where reg_dates.start_time<max_time.max_value order by start_time DESC\
        " ,
        (err , result)=>{
            if(err){
                console.log(err);
            }
            else{
                if(result.rows.length > 0){
                    res.send(result);
                }
            }
        }
    );
});


app.post('/homeCurrSem' , (req,res)=>{
    const id = req.body.id;
    client.query(
        "with max_time(max_value) as(\
            select max(start_time) from reg_dates where start_time<current_timestamp\
        )\
        select year,semester from reg_dates,max_time where reg_dates.start_time=max_time.max_value order by start_time DESC\
        " ,
        (err , result)=>{
            if(err){
                console.log(err);
            }
            else{
                if(result.rows.length > 0){
                    res.send(result);
                }
            }
        }
    );
});


app.post('/homeCourse' , (req,res)=>{
    const id = req.body.id;
    client.query(
        "select * \
        from takes,course,section \
        where takes.ID = $1 \
        and takes.course_id = course.course_id\
        and (takes.course_id , takes.sec_id , takes.semester, takes.year) \
            = (section.course_id , section.sec_id , section.semester, section.year)\
        ",[id],
        (err , result)=>{
            if(err){
                console.log(err);
            }
            else{
                if(result.rows.length > 0){
                    // console.log(result);
                    res.send(result);
                }
            }
        }
    );
});



app.post("/drop" , (req,res) =>{
    const course = req.body.course;
    client.query(
        "delete from takes\
        where id = $1 and course_id = $2\
        and sec_id = $3 and semester = $4\
        and year = $5\
        ",[course.id , course.course_id , course.sec_id , course.semester, course.year],
        (err , result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.send(result);
            }
        }
    );

  })


  app.post("/registerCurrSemCourses" , (req,res) =>{
    client.query(
        "with max_time(max_value) as(\
            select max(start_time) from reg_dates where start_time<current_timestamp\
        ),\
        currsemYear(year,semester) as (\
            select year,semester from reg_dates,max_time where reg_dates.start_time=max_time.max_value\
        )\
        select * \
        from section,course,currsemYear \
        where section.course_id = course.course_id \
        and section.year = currsemYear.year \
        and section.semester = currsemYear.semester\
        order by section.course_id , section.sec_id \
        ",
        (err , result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.send(result);
            }
        }
    );

  })
  
//   --------------------------------------------------------------------------------

  app.post("/registerbuttonCourse" , (req,res) =>{
    const course = req.body.course;
    const id = req.body.id;


    Promise.all([
        client.query("select * from prereq where course_id = $1",[course.course_id]),
        client.query("with max_time(max_value) as(\
                        select max(start_time) from reg_dates where start_time<current_timestamp\
                    ),\
                    currsemYear(year,semester) as (\
                        select year,semester from reg_dates,max_time where reg_dates.start_time=max_time.max_value\
                    )\
                    select * from takes,currsemYear where ID = $1 and (takes.year != currsemYear.year or takes.semester != currsemYear.semester)",[id]),
        client.query("\
            with max_time(max_value) as(\
                select max(start_time) from reg_dates where start_time<current_timestamp\
            ),\
            currsemYear(year,semester) as (\
                select year,semester from reg_dates,max_time where reg_dates.start_time=max_time.max_value\
            )\
            select *\
            from section,takes,currsemYear \
            where (takes.course_id,takes.sec_id,takes.semester,takes.year) = (section.course_id,section.sec_id,section.semester,section.year)\
            and section.year = currsemYear.year \
            and section.semester = currsemYear.semester\
            and takes.ID = $1\
        " , [id])
    ]).then(function([result1 , result2 , result3]){
        console.log(course);
        console.log(result3);
        let n = result1.rows.length;
        for(let i in result1.rows){
            for(let j in result2.rows){
                if(result1.rows[i].prereq_id === result2.rows[j].course_id){
                    n = n - 1;
                    break;
                }
            }  
        }

        if(n === 0){
            let num_slot_clashes = 0;
            let alreadyRegistered = false;
            for(let i in result3.rows){
                if(result3.rows[i].time_slot_id === course.time_slot_id){
                    num_slot_clashes = num_slot_clashes + 1;
                }
                if(result3.rows[i].course_id === course.course_id){
                    alreadyRegistered = true;
                }
            }

            

            if(num_slot_clashes === 0){
                
                client.query("insert into takes(id,course_id , sec_id,semester,year) values($1 , $2 , $3 , $4 , $5)",
                            [id , course.course_id , course.sec_id, course.semester , course.year], 
                                (err , result)=>{
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                            res.send({registered:true , message:"Registered Sucessfully"});
                                    }
                                }
                            
                            );
            }
            else{
                if(alreadyRegistered){
                    res.send({registered:false ,  message:"Already Registered"});
                }   
                else{
                    res.send({registered:false ,  message:"Slot clash happened"});
                }
            }
        }
        else{
            res.send({registered:false , message:"Prerequistes are not satisfied"});
        }

    },function(error){
        throw error;
    } );


  })



// ------------------------------------------------------------
// ------------------------------------------------------------




app.get('/course/running/:dept_name',function (req,res){

    const dname = req.params.dept_name;
    //c_id = 'CS-101';
    //console.log(dname);

    client.query(
        "with max_time(max_value) as\
            (select max(start_time) from reg_dates where start_time<current_timestamp),curr(yr,semester) as\
        (select year,semester from reg_dates,max_time where reg_dates.start_time<=max_time.max_value order by start_time desc\
		limit 1),tem(c_id,title,dname,yr,sem) as\
		(select course.course_id,course.title,course.dept_name,section.year,section.semester\
		from section\
		join course\
		on course.course_id = section.course_id)\
		select distinct tem.title,tem.c_id\
		from tem join curr\
		on tem.yr = curr.yr and tem.sem = curr.semester\
        where tem.dname = $1",[dname] ,(err , result) => {
            if(err){
                //console.log("pumkaaaaaa");
                console.log(err);
            }
            else{
                if(result.rows.length > 0){
                    //console.log(result);
                    res.send(result.rows);
                }
                else{
                    //console.log(result);
                    res.send({message : "No such department available"})
                }
            }
        }
    );
});

app.get('/course/running',function (req,res){

    //const c_id = req.params.courseid;
    //c_id = 'CS-101';
    //console.log(c_id);

    client.query(
        "with max_time(max_value) as(\
            select max(start_time) from reg_dates where start_time<current_timestamp\
        ),\
		curr(yr,semester) as (\
        select year,semester from reg_dates,max_time where reg_dates.start_time<=max_time.max_value order by start_time desc\
		limit 1),\
		tem(c_id,title,dname,yr,sem) as (\
		select course.course_id,course.title,course.dept_name,section.year,section.semester\
		from section\
		join course \
		on course.course_id = section.course_id)\
		select distinct tem.dname \
		from tem join curr\
		on tem.yr = curr.yr and tem.sem = curr.semester\
        " ,(err , result) =>{
            if(err){
                console.log(err);
            }
            else{
                if(result.rows.length > 0){
                    //console.log(result);
                    res.send(result.rows);
                }
                else{
                    //console.log(result);
                    res.send({message : "No such c available"})
                }
            }
        }
    );
});

app.get('/course1/:courseid',function(req,res){

    const co_id = req.params.courseid;


    client.query(
        "with max_time(max_value) as(\
            select max(start_time) from reg_dates where start_time<current_timestamp),\
		curr(yr,semester) as\
        (select year,semester from reg_dates,max_time where reg_dates.start_time<=max_time.max_value order by start_time desc\
		limit 1),\
		inst(id,name,cid,sid,yr,sem) as\
		(select instructor.ID,instructor.name,teaches.course_id,teaches.sec_id,teaches.year,teaches.semester\
		from instructor\
		join teaches\
		on instructor.ID = teaches.ID),\
		ins(id,name,cid,sid) as \
		(select inst.id,inst.name,inst.cid,inst.sid\
		 from inst\
		 join curr on inst.yr = curr.yr and inst.sem = curr.semester),\
		tableA(c_id,p_id,p_title) as\
        (select prereq.course_id,prereq.prereq_id,course.title\
         from prereq\
         join course\
         on prereq.prereq_id = course.course_id),\
		 tableB(course_id,title,credits,p_id,p_title) as\
			(select course.course_id,course.title,course.credits,tableA.p_id,tableA.p_title\
			from course\
			left outer join tableA on course.course_id = tableA.c_id),\
			tableC(c_id,c_title,cred,p_id,p_title,sid,id,name) as\
				(select tableB.course_id,tableB.title,tableB.credits,tableB.p_id,tableB.p_title,ins.sid,ins.id,ins.name\
				from tableB\
				join ins on tableB.course_id=ins.cid)\
			select distinct tableB.course_id,tableB.title,tableB.credits,tableC.sid,tableC.id,tableC.name\
			from tableB\
			left outer join tableC on tableB.course_id = tableC.c_id\
            where tableB.course_id = $1",[co_id],(err,result)=>{
                if(err){
                    console.log(err);
                }
                else{
                    if(result.rows.length > 0){
                        res.send(result.rows)
                    }
                    else{
                        res.send({message : "There is a mistake"})
                    }
                }
            }
    );
});

app.get('/course2/:courseid',function(req,res){

    const co_id = req.params.courseid;


    client.query(
        "with max_time(max_value) as(\
            select max(start_time) from reg_dates where start_time<current_timestamp),\
		curr(yr,semester) as\
        (select year,semester from reg_dates,max_time where reg_dates.start_time<=max_time.max_value order by start_time desc\
		limit 1),\
		inst(id,name,cid,yr,sem) as\
		(select instructor.ID,instructor.name,teaches.course_id,teaches.year,teaches.semester\
		from instructor\
		join teaches\
		on instructor.ID = teaches.ID),\
		ins(id,name,cid) as \
		(select inst.id,inst.name,inst.cid\
		 from inst\
		 join curr on inst.yr = curr.yr and inst.sem = curr.semester),\
		tableA(c_id,p_id,p_title) as\
        (select prereq.course_id,prereq.prereq_id,course.title\
         from prereq\
         join course\
         on prereq.prereq_id = course.course_id),\
		 tableB(course_id,title,credits,p_id,p_title) as\
			(select course.course_id,course.title,course.credits,tableA.p_id,tableA.p_title\
			from course\
			left outer join tableA on course.course_id = tableA.c_id),\
			tableC(c_id,c_title,cred,p_id,p_title,id,name) as\
				(select tableB.course_id,tableB.title,tableB.credits,tableB.p_id,tableB.p_title,ins.id,ins.name\
				from tableB\
				join ins on tableB.course_id=ins.cid)\
			select distinct tableB.course_id,tableB.title,tableB.credits,tableB.p_id,tableB.p_title\
			from tableB\
			left outer join tableC on tableB.course_id = tableC.c_id\
            where tableB.course_id = $1",[co_id],(err,result)=>{
                if(err){
                    console.log(err);
                }
                else{
                    if(result.rows.length > 0){
                        res.send(result.rows)
                    }
                    else{
                        res.send({message : "There is a mistake"})
                    }
                }
            }
    );
});

app.get('/instructor1/:instructor_id',function(req,res){
    const iid = req.params.instructor_id;
    // console.log(iid);
    client.query(
        "with max_time(max_value) as\
        (select max(start_time) from reg_dates where start_time<current_timestamp),\
   curr(yr,semester) as \
       (select year,semester from reg_dates,max_time where reg_dates.start_time=max_time.max_value),\
   tableD(ID,course_id,semester,year,title) as\
       (select teaches.ID,teaches.course_id,teaches.semester,teaches.year,course.title\
        from teaches\
        join course on teaches.course_id = course.course_id),\
   tableA(name,id,dept_name,course_id,year,semester,title) as\
       (select instructor.name,instructor.ID,instructor.dept_name,tableD.course_id,tableD.year,tableD.semester,tableD.title\
       from instructor\
       join tableD on instructor.ID = tableD.ID\
       ),\
   tableB(name,id,dept_name,course_id,year,sem,title,s_time) as\
       (select tableA.name,tableA.id,tableA.dept_name,tableA.course_id,tableA.year,tableA.semester,tableA.title,reg_dates.start_time\
       from tableA\
       join reg_dates on tableA.semester = reg_dates.semester and tableA.year = reg_dates.year\
       order by tableA.year desc, reg_dates.start_time desc ,tableA.course_id asc)\
   select distinct tableB.name,tableB.id,tableB.dept_name,tableB.course_id,tableB.title,tableB.year,tableB.sem \
   from tableB \
   join curr on tableB.year = curr.yr and tableB.sem = curr.semester\
   where tableB.id = $1",[iid],(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                if(result.rows.length > 0){
                    res.send(result.rows)
                }
                else{
                    //console.log(result);
                    res.send({message : "Heyy!! There's a bug down here"})
                }
            }
        }
    );
});

app.get('/instructor2/:instructor_id',function(req,res){
    const iid = req.params.instructor_id;

    client.query(
        "with max_time(max_value) as\
        (select max(start_time) from reg_dates where start_time<current_timestamp),\
   tableD(ID,course_id,semester,year,title) as\
       (select teaches.ID,teaches.course_id,teaches.semester,teaches.year,course.title\
        from teaches\
        join course on teaches.course_id = course.course_id),\
   tableA(name,id,dept_name,course_id,year,semester,title) as\
       (select instructor.name,instructor.ID,instructor.dept_name,tableD.course_id,tableD.year,tableD.semester,tableD.title\
       from instructor\
       join tableD on instructor.ID = tableD.ID\
       ),\
   tableB(name,id,dept_name,course_id,year,sem,title,s_time) as\
       (select tableA.name,tableA.id,tableA.dept_name,tableA.course_id,tableA.year,tableA.semester,tableA.title,reg_dates.start_time\
       from tableA\
       join reg_dates on tableA.semester = reg_dates.semester and tableA.year = reg_dates.year\
       order by tableA.year desc, reg_dates.start_time desc ,tableA.course_id asc)\
   select distinct tableB.name,tableB.id,tableB.dept_name,tableB.course_id,tableB.title,tableB.year,tableB.sem \
   from tableB \
   join max_time on tableB.s_time < max_time.max_value\
   where tableB.id = $1",[iid],(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                if(result.rows.length > 0){
                    res.send(result.rows)
                }
                else{
                    res.send({message : "Heyy!! There's a bug down here"})
                }
            }
        }
    );
});

app.get('/instructor3/:instructor_id',function(req,res){
    const iid = req.params.instructor_id;

    client.query(
        "select distinct instructor.id,instructor.name,instructor.dept_name from instructor\
        where instructor.id = $1",[iid],(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                if(result.rows.length > 0){
                    res.send(result.rows)
                }
                else{
                    res.send({message : "Heyy!! There's a bug down here"})
                }
            }
        }
    );
});


app.listen(3001,()=>{
    console.log("running server");
});










