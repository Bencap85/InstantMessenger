import './App.css';
import { state, useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { UserWrapper } from './UserWrapper';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import axios from 'axios';
import io from 'socket.io-client';

function App() {
  

  const [ jwt, setJWT ] = useState(localStorage.getItem("JWT"));
  const [ user, setUser ] = useState(JSON.parse(localStorage.getItem("user")));

  console.log("In app, " + JSON.stringify(user));

  const socket = io.connect('http://localhost:8080');
  socket.on('welcome', (data) => {
    console.log("Connected in client");
  });
  socket.on('successfullyLeft', (msg) => {
    // console.log(msg);
  });
  socket.on('successfullyJoined', (msg) => {
    // console.log(msg);
  });
  // socket.on('newMessage', message => {
  //   console.log("Success: " + message);
  // });
  
  
  
  if(jwt != null) {
    localStorage.setItem('JWT', jwt);
  }
  if(user != null) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  

  
  return (
    <div className="App">
      <UserWrapper user={user} setUser={(user) => {
        console.log("userContext was set in app");
        setUser(user);
      } }
      setJWT={setJWT}
      socket={socket}
      />
      
    </div>
  );
}

export default App;
