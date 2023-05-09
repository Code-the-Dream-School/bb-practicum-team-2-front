import React, { useState, useEffect, useContext } from "react";
import GameRoom from "./GameRoom";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../utils/Socket";
import AvailableRooms from "./AvailableRooms";

function GameLobby({ userName, gamesWon, _id, setInRoom, inRoom }) {
  const socket = useContext(SocketContext);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [room, setRoom] = useState("");
  const [host, setHost] = useState(false);
  let navigate = useNavigate();
  let token = null; // used for cookies

  if (!socket.connected) navigate("/");

  //Keeps track of current room number upon refreshing page.
  let localStorageRoom = localStorage.getItem("room");

  const createRoom = () => {
    socket.emit("create_room", userName);
    setInRoom(true);

    setHost(true);
  };

  const joinRoom = (room) => {
    if (room !== "") socket.emit("join_room", { room, userName });
    setRoom(room)
    localStorage.setItem("room", room);
    setInRoom(true);
  };

  useEffect(() => {
    //Receives new room number from back end - back end is responsible for checking for duplicate room numbers.
    socket.on("room_number", (room) => {
      setRoom(room);
    });

    // If there's something in localStorageRoom, we set the room to the localStorage room upon refreshing.
    // if (localStorageRoom) {
    //   setRoom(localStorageRoom);
    // }

    socket.on("available_rooms", (rooms) => {
      setAvailableRooms(rooms);
    });

    socket.on("new_host",()=>setHost(true))
  }, [socket]);

  //We look for available rooms once we connect
  useEffect(() => {
    socket.emit("search_for_rooms")
  }, []);

  return (
    <div>
      {!inRoom ? (
        <>
          {availableRooms.length === 0 ? (
            <div>
              <title>Game Lobby</title>
              <h1 className="mb-4 mt-2 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-gray">
                Game Lobby
              </h1>
              <div>
                {/* //////////////////////////////////// */}
                {/* Create a room section */}
                {/* //////////////////////////////////// */}

                <button
                  className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mt-10 mb-2"
                  onClick={createRoom}
                >
                  Create a room!
                </button>

                <br></br>
                {/* //////////////////////////////////// */}
                {/* Need a hint section */}
                {/* //////////////////////////////////// */}
                <br></br>
                <br></br>

                <div>
                  <p className="text-lg">
                    <em>
                      <strong>Hint:</strong> No rooms available to join yet,
                    </em>
                  </p>
                  <p className="text-lg">
                    <em>create the first room above</em> ☝🏿☝🏾☝🏽☝🏼☝🏻{" "}
                    <em>to play!</em>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <title>Game Lobby</title>
              <h1 className="mb-4 mt-2 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-gray">
                Game Lobby
              </h1>
              <div>
                {/* //////////////////////////////////// */}
                {/* Create a room section */}
                {/* //////////////////////////////////// */}

                <button
                  className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mt-10 mb-2"
                  onClick={createRoom}
                >
                  Create a room!
                </button>

                <br></br>
              </div>
              {/* //////////////////////////////////// */}
              {/* Join a room section */}
              {/* //////////////////////////////////// */}
              <br></br>
              <br></br>
              {/* Horizontal line */}
              <div className="inline-flex items-center justify-center w-full">
                <hr className="w-64 h-1 my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>{" "}
                <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900 ml-1 mr-1">
                  or
                </span>{" "}
              </div>
              {/* <hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700"></hr> */}

              <div>
                <br></br>

                <AvailableRooms
                  availableRooms={availableRooms}
                  joinRoom={joinRoom}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <GameRoom
          room={room}
          setInRoom={setInRoom}
          userName={userName}
          host={host}
          setHost={setHost}
          gamesWon={gamesWon}
          _id={_id}
        />
      )}
    </div>
  );
}

export default GameLobby;
