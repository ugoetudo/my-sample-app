
import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
import './styles/app.css'
const endpoints = require('./endpoints.js');

const root = ReactDOM.createRoot(document.getElementById('root'));

const myFirstElement = <h1>Welcome to Class Finder!</h1>

function WelcomeMessage({first_name, last_name}) {
  return (
    <h2>{`Welcome ${first_name} ${last_name}, we are loading your classes for today...`}</h2>
  )
}

function CourseItem({cname, ctime, cnum, depname, secnum, isSelected, courseSelect}) {
  /* Notice that we do not need to maintain the state of each course item in order to toggle item selection */
  if (!isSelected) {
    return (
      <div className="item">
        <div>{depname}&nbsp;{cnum}</div>
        <div>{secnum}</div>
        <div>{cname}</div>
        <div>{ctime}</div>
        <div><input type="button" onClick={courseSelect} value="Details"/></div>
      </div>
    )
  }
  else {
    return (
      <div className="item selected-item">
        <div>{depname}&nbsp;{cnum}</div>
        <div>{secnum}</div>
        <div>{cname}</div>
        <div>{ctime}</div>
        <div><input type="button" onClick={courseSelect} value="Details"/></div>
      </div>
    )
  }
}


function Courses({ vnum, first_name, last_name }) {
  var [classes, setClasses] = useState([])
  var [fetched, setFetched] = useState(false)
  const [selectedClass, setActiveClass] = useState(0)
  useEffect( () => { 
    const getClasses = async() => {
      const classData = await (
        await fetch(`${endpoints.enroll_endpoint}?vnum=${vnum}`)
        
      ).json()
      setClasses(classData)
      setFetched(true)
    }
    getClasses()
  }, [vnum]) 
  /* we set vnum as a dependency of the useEffect hook. Whenever this component re-renders it will check vnum. 
  if changed, then useEffect will be called again */
  const showCourseDetail = (course_no) => {
    if (course_no === selectedClass){
      setActiveClass(0)
    }
    else {
      setActiveClass(course_no)
    }

  }
  let classitems = []
  let i = 0
  if (!fetched) {
    return (<WelcomeMessage first_name={first_name} last_name={last_name} />)
  } else if (classes.length === 0){
    return (
      <p>Amazing! You don't have class today!</p>
    )
  } else {
    console.log(classes)
    Object.values(classes).forEach(course => {
      classitems[i] = <CourseItem 
          key={i} /* notice that we don't define a key property in the CourseItem component. It is required using iteration */
          cname={course[0].course_name} 
          ctime={course[0].time_of_day} 
          cnum={course[0].course_no} 
          depname={course[0].dept} 
          secnum={course[0].section_no} 
          isSelected={selectedClass === course[0].course_no ? true : false}
          courseSelect={() => showCourseDetail(course[0].course_no)} /* notice that we are not passing the function directly, 
                                                                      but passing an anonymous function that calls the function*/
        /> 
      i = i + 1   
    });
    return (
      <div id="courselist">
        {classitems}
      </div>
    )
  }
}


function MyForm() {
  var [name, setVnumber] = useState("");
  var [uname, setUName] = useState({});

  const submitVNUM = (e) => {
    const vn = name
    e.preventDefault()
    fetch(`${endpoints.auth_endpoint}?vnum=${vn}`)
      .then((res) => res.json())
        .then((data) => setUName({...data})) //ellipsis is the unwrap operator similar to ** in python
  }
  if (uname.first_name){
    return (
      <div>
        {myFirstElement}
        <form onSubmit={submitVNUM}>
          <label>Enter Your V Number:&nbsp;

            <input
              type="text"
              value={name}
              onChange={(e) => setVnumber(e.target.value)} />
          </label>
          <input type="submit" />
        </form>
        
        <Courses vnum={name} 
                 first_name={uname.first_name} 
                 last_name={uname.last_name}/>
      </div>
    )
  }

  return (
    <div>
      {myFirstElement}
      <form onSubmit={submitVNUM}>
        <label>Enter Your V Number:&nbsp;

          <input
            type="text"
            value={name}
            onChange={(e) => setVnumber(e.target.value)} />
        </label>
        <input type="submit" />
      </form>
      
    </div>
  )
}

root.render(
  <MyForm />
);
