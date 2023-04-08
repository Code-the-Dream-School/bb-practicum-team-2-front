import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";


function GameLobby(props) {

  // Navigation
  let navigate = useNavigate();

  const createRoom = () => {
    props.socket.emit("create_room", props.userName);
    navigate('/GameRoom')
  };

  function joinRoom(){
    props.joinRoom()
    navigate('/GameRoom')
  }

  return (
    <div className="App">
      <h1>Available Rooms: {props.availableRooms.length > 0 ? props.availableRooms.join('-') : 'No Rooms Available, create a New Room'}</h1>
        <input placeholder='Room Number...' onChange={props.roomHandler} />
        <button onClick={joinRoom}>Join Room</button>
        <br />
        <br />
        <button onClick={createRoom}>Create New Room</button>
        <button onClick={props.disconnectRoom} >Disconnect</button>
    </div>
  );
}

export default GameLobby;
