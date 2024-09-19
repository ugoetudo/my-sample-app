
import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';
const endpoints = require('./endpoints.js');

const root = ReactDOM.createRoot(document.getElementById('root'));
const myFirstElement = <h1>Welcome to Class Finder!</h1>

function WelcomeMessage({first_name, last_name}) {
  return (
    <h2>{`Welcome ${first_name} ${last_name}, we are loading your classes for today...`}</h2>
  )
}


function MyForm() {
  const [name, setVnumber] = useState("");
  const [uname, setUName] = useState({});

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
        <WelcomeMessage 
          first_name={uname.first_name}
          last_name={uname.last_name}
        />
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
