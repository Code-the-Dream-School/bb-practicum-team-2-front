import React from 'react';
import { useNavigate } from "react-router-dom";
import Login from './Login';

function LandingPage() {
  let navigate = useNavigate(); 

  // Will assign the user a random username and send the user to the GameLobby
    // Random username - WIP
  const playNow = () => {
    navigate('/UserName'); //navigate to GameLobby
    console.log("PlayNow - inside GAMELOBBY");
  }

  return (
    <>
      <div>LandingPage</div>
      <button onClick={playNow}>
        <p>Sign up later, PLAY NOW!!</p>
      </button>
      <Login />
    </>
  )
}

export default LandingPage