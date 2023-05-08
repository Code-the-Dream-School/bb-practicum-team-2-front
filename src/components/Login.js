import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {SocketContext} from '../utils/Socket';
import { UserDataContext } from "../App";
import { base_url } from "../config";

function Login({ userName, setUserName, setSubmitted, submitted, userDataHandler}) {
  const socket = useContext(SocketContext);
  // Used to conditionally render sign up or login form.
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {setUserData} = useContext(UserDataContext)
  let token = null; // used for cookies
  token = localStorage.getItem("token");
  let navigate = useNavigate();

  const toggleForm = () => {
    setShowSignUpForm(!showSignUpForm);
  };

  /* sign up form for new users */
  async function signUpForm(e) {
    e.preventDefault();
    try {
      /* connecting to backend routes */
      const response = await fetch(`${base_url}api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          password: password,
          email: email,
        }),
      });

      console.log(`Sign up responds with status code ${response.status}`);
      const data = await response.json();
      /* login credential error handeling */
      if (response.status === 201) {
        token = data.token;
        localStorage.setItem("token", token);
        setUserData(data.user)
        window.alert(`Welcome ${userName}!`);
        socket.connect()
        socket.on("connect", () => {
          socket.emit('user_name',{userName,registeredUser:true})
          if(socket.connected) {
            navigate('/GameLobby');
            setSubmitted(true);
          }
        });
    
      } else if (userName === "") {
        window.alert("Please enter a username");
      } else if (data.hasUsername === true) {
        window.alert("Username is already taken");
      } else if (email === "") {
        window.alert("Please enter an email");
      } else if (data.hasEmail === true) {
        window.alert("Email is already taken");
      } else if (password === "") {
        window.alert("Please enter a password");
      } else if (password.length < 6) {
        window.alert("Password must be at least 6 characters");
      }
    } catch (error) {
      console.log("Error occurred: ", error);
    }
  }

  /* login form for existing users */
  async function loginForm(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${base_url}api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          password: password
        }),
      });

      console.log(`login responds with status code ${response.status}`);
      const data = await response.json();
      if (response.status === 200) {
        // setUserName(inputValue);
        token = data.token;
        localStorage.setItem("token", token);
        setUserData(data.user)
        socket.connect()
        socket.on("connect", () => {
          socket.emit('user_name',{userName,registeredUser:true})
          console.log(socket.connected,"socket connected");
          if(socket.connected){
            window.alert(`Welcome ${userName}!`);
            navigate("/GameLobby");
            setSubmitted(true);
          } 
        });
      } else if (response.status === 401) {
        window.alert("Invalid username or password");
      }
    } catch (error) {
      console.log("Error occurred: ", error);
    }
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {showSignUpForm ? (
        <>
          <h1>Sign Up</h1>
          <form onSubmit={(e) => signUpForm(e)}>
            <label className='block mb-2 text-sm font-medium text-gray-900'>username: </label>
            <input name="username" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' onChange={(event) => {
              setUserName(event.target.value);
            }}></input>
            <label className='block mb-2 text-sm font-medium text-gray-900'>email: </label>
            <input name="email" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' onChange={(event) => {
              setEmail(event.target.value);
            }}></input>
            <label className='block mb-2 text-sm font-medium text-gray-900'>password: </label>
            <input type="password" name="password" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' onChange={(event) => {
              setPassword(event.target.value);
            }}></input>
            <button type="submit" className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2 mr-2 mb-2">Signup!</button>
          </form>
          <button className="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500" onClick={toggleForm}>
            Already have an account? Sign in{" "}
          </button>
        </>
      ) : (
        <>
          <h1>Login</h1>
          <form onSubmit={(e) => loginForm(e)}>
            <label className='block mb-2 text-sm font-medium text-gray-900'>username: </label>
            <input name="username" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' onChange={(event) => {
              setUserName(event.target.value)
            }}></input>
            <label className='block mb-2 text-sm font-medium text-gray-900'>password: </label>
            <input type="password" name="password" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' onChange={(event) => {
              setPassword(event.target.value);
            }}></input>
            <button type="submit" className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2 mr-2 mb-2">Login!</button>
          </form>
          <p id="message"></p>
          <button onClick={toggleForm}>Dont have an account? <span className="text-blue-700 hover:underline dark:text-blue-500">Register</span>  </button>
        </>
      )}
    </div>
  );
}


export default Login;
