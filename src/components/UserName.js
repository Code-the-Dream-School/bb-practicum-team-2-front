import React from "react";
import { useNavigate } from "react-router-dom";

function UserName({userNameHandler,connectH}) {
  // Navigation
  let navigate = useNavigate();
  function connect(){
    navigate('/GameLobby')
    connectH()
  }

  return (
    <div className="App">
      <input placeholder='User Name...' onChange={userNameHandler} />
        <button onClick={connect}>Connect</button>
      </div>
  );
}

export default UserName;
