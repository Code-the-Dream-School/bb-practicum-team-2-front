import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  // Used to conditionally render sign up or login form.
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [username, setUserName] = useState(""); // define this in App.js and pass userName as props into ProfilePage,GameLobby, etc.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();

  const toggleForm = () => {
    setShowSignUpForm(!showSignUpForm);
    console.log(showSignUpForm);
  };

  // Will take the user to profile page if they are signing up or game lobby if they signed in.

  /** user registartion  */
  async function registrationForm(e) {
    e.preventDefault();
    console.log(e);

    /* connecting to backend routes */
    await fetch("http://localhost:8000/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      }),
    })
      .catch(error => {
        window.alert(error);
        return;
      });

    const inputValue = e.target.username.value;
    if (showSignUpForm === true) {
      setUserName(inputValue);
      navigate("/ProfilePage");
    } else {
      setUserName(inputValue);
      navigate("/GameLobby");
    }
  }

  //TODO: add error handling for incorrect username/password
  /** user log in */
  async function loginForm(e) {
    e.preventDefault();
    console.log(e);

    /* connecting to backend routes */
    await fetch("http://localhost:8000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      }),
    })
      .catch(error => {
        window.alert(error);
        return;
      });

    const inputValue = e.target.username.value;
    if (showSignUpForm === true) {
      setUserName(inputValue);
      navigate("/ProfilePage");
    } else {
      setUserName(inputValue);
      navigate("/GameLobby");
    }
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {showSignUpForm ? (
        <>
          <h1>Sign Up</h1>
          <form onSubmit={(e) => registrationForm(e)}>
            <label>username: </label>
            <input name="username" onChange={(event) => {
              setUserName(event.target.value);
            }}></input>
            <label>email: </label>
            <input name="email" onChange={(event) => {
              setEmail(event.target.value);
            }}></input>
            <label>password: </label>
            <input name="password" onChange={(event) => {
              setPassword(event.target.value);
            }}></input>
            <button type="submit">Signup!</button>
          </form>
          <button onClick={toggleForm}>
            Already have an account? Sign in{" "}
          </button>
        </>
      ) : (
        <>
          <h1>Login</h1>
          <form onSubmit={(e) => loginForm(e)}>
            <label>username: </label>
            <input name="username" onChange={(event) => {
              setUserName(event.target.value);
            }}></input>
            <label>password: </label>
            <input name="password" onChange={(event) => {
              setPassword(event.target.value);
            }}></input>
            <button type="submit">Login!</button>
          </form>
          <button onClick={toggleForm}>Dont have an account? Register </button>
        </>
      )}
    </div>
  );
}

export default Login;
