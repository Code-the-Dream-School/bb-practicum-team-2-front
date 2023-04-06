import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function GameLobby({
  setInRoom,
  userName,
  availableRooms,
  setAvailableRooms,
  disconnectRoom,
  room,
  setRoom,
  setPlayers,
}) {
  // Navigation
  let navigate = useNavigate();

  // NEW as of 4/5
  const createRoom = () => {
    socket.emit("create_room", userName);
    setInRoom(true);
    navigate("/GameRoom"); // Navigate to GameRoom
  };

  // NEW as of 4/5
  useEffect(() => {
    socket.on("room_number", (room) => setRoom(room));

    socket.on("available_rooms", (data) => {
      if (data === false) {
        setAvailableRooms([]);
      } else {
        setAvailableRooms(data);
      }
      console.log("Data:", data);
    });

    socket.on("players", (data) => setPlayers(data));
  }, [socket]);

  const joinRoom = () => {
    if (room !== "") socket.emit("join_room", { room, userName });
    setInRoom(true);
    navigate("/GameRoom"); // Navigate to GameRoom
  };

  // This may not be working to change the game count on loading
  const changeGameCount = () => {
    // NEW as of 4/5
    setAvailableRooms = availableRooms.length;
  };

  const handleSetRoom = (event) => {
    event.preventDefault();
    console.log("event.target.value:", event.target.value);
    setRoom(event.target.value);
  };

  return (
    <>
      {/* NEW as of 4/5 */}
      {availableRooms.length === 0 ? (
        <div onLoad={changeGameCount}>
          <title>Game Lobby</title>
          <h1>GameLobby</h1>
          <hr></hr>
          <div>
            {/* //////////////////////////////////// */}
            {/* Create a room section */}
            {/* //////////////////////////////////// */}
            <h2>Create the first room!</h2>

            <br></br>

            {/* NEW as of 4/5 */}
            <input
              placeholder="Room Number..."
              onChange={(event) => {
                handleSetRoom(event);
              }}
            />

            <button onClick={createRoom}>Create</button>

            <br></br>

            <button onClick={disconnectRoom}>Disconnect</button>

            {/* //////////////////////////////////// */}
            {/* Need a hint section */}
            {/* //////////////////////////////////// */}
            <h2>Need a hint?</h2>
            <p>
              Hint numero uno:{" "}
              <em>
                This is where you can see all of the available games you can
                join, once they are created. Create the first room above ^^ to
                play!”
              </em>
            </p>
          </div>
        </div>
      ) : (
        <div onLoad={changeGameCount}>
          <title>Game Lobby</title>
          <h1>GameLobby</h1>
          <hr></hr>
          <div>
            {/* //////////////////////////////////// */}
            {/* Create a room section */}
            {/* //////////////////////////////////// */}
            <h2>Create the first room!</h2>

            <br></br>

            {/* NEW as of 4/5 */}
            <input
              placeholder="Room Number..."
              onChange={(event) => {
                handleSetRoom(event);
              }}
            />

            <button onClick={createRoom}>Create</button>

            <br></br>
            <br></br>

            <button onClick={disconnectRoom}>Disconnect</button>
          </div>

          {/* //////////////////////////////////// */}
          {/* Join a room section */}
          {/* //////////////////////////////////// */}

          <hr></hr>

          <div>
            <h2>Join a Room!</h2>
            <div>
              <select>
                Current games dropdown
                <option>Select a game to join</option>
                <option>14 hyper players</option>
                <option>8 rambunctious players</option>
                <option>5 measly players (running)</option>
                <option>1 sad player</option>
              </select>
            </div>

            <br></br>

            <button onClick={joinRoom}>Join</button>
          </div>
        </div>
      )}
    </>
  );
}

export default GameLobby;
