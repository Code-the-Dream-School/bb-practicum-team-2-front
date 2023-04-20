import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ScoreBoard from "./ScoreBoard";
import {SocketContext} from '../utils/Socket';
import GameBoard from "./GameBoard";

function GameRoom({ room, setInRoom, userName, host }) {

  const socket = useContext(SocketContext);

  let navigate = useNavigate();

  const [allPlayersReady, setAllPlayersReady] = useState(false)
  const [gameStarted, setGameStarted] = useState(false);
  const [length, setLength] = useState(0);
  const [guessingYourWord, setGuessingYourWord] = useState(false);
  const [youGuessed, setYouGuessed] = useState(false);
  const [word, setWord] = useState("");
  const [players, setPlayers] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [youWon, setYouWon] = useState(false)
  const [winner, setWinner] = useState("")
  const [gamesWon, setGamesWon] = useState(0)

  let token = null; // used for cookies
  token = localStorage.getItem("token");


  async function getData(){
    try {
      const response = await fetch(`http://localhost:4000/api/v1/games/${userName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if(response.status===200){
        setGamesWon(data.gamesWon)
        console.log(data,'data from GET req');
      } else if (response.status === 401) {
        window.alert("Invalid username");
      }
    
    } catch (error) {
      console.log("Error occurred: ", error);
    }
  }
  getData()

  const hamburgerNav = (event) => {
    event.target.value === "option1"
      ? navigate("/ProfilePage")
      : navigate("/GameLobby");
  };

  const columnStyle = {
    display: "inline-block", // Creates column effect
    width: "30%", // creates spacing in between text
    verticalAlign: "top", // each div has the same top starting point
  };

  useEffect(() => {

    //Receives players from the backend who entered a specific GameRoom
    socket.on("players", (data) => {
      setPlayers(data)
    });
    
    //Checks that all players are ready by either submitting their guesses or submitting a word to guess
    socket.on("all_players_ready", () => setAllPlayersReady(true));

    //Returns the length of the word to be guessed
    socket.on("word_to_guess", (length) => {
      setLength(length);
      //Resets the states to play a new round
      setGameStarted(true);
      setGuessingYourWord(false)
      setYouGuessed(false)
    });

    //Blocks player from guessing in current round if their submitted word was selected to be guessed.
    socket.on("guessing_your_word", () => {
      setGuessingYourWord(true);
      setGameStarted(true);
    });

    //Returned when a player guesses the correct word
    socket.on("right", () => {
      setYouGuessed(true);
    });

    socket.on("all_players_guessed",()=>{setAllPlayersReady(true)})

    socket.on("game_over",()=>setGameOver(true))

    //This is at the end of the game

    //Returns the winner if it's not yourself
    socket.on("winner",data=>setWinner(data))
    //Returned if you are the winner
    socket.on("you_won",async ()=>{
      setYouWon(true)
      try {
        const response = await fetch(`http://localhost:4000/api/v1/games/${userName}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gamesWon: gamesWon+1
      })
      });
      // const data = await response.json();
      if (response.status === 200) {
        console.log('Games won updated');
      }
      } catch (error) {
        console.log("Error occurred: ", error);
      }
    })

  }, [socket]);


  const startGame = () => {
    socket.emit("start_game", room);
    setGameStarted(true);
    setAllPlayersReady(false)
    setYouGuessed(false);
    setGuessingYourWord(false)
  };

  const guessWord = () => {
    socket.emit("guess_word", { word, room });
  };

  const sendWord = () => {
    socket.emit("send_word", { word, room });
  };

  const leaveRoom = () => {
    socket.emit("leave_room", room);
    setInRoom(false);
  };



  const disconnectRoom = () => {
    socket.emit("disconnect_room", room);
    if (socket) socket.disconnect();
  };

  function wordHandler(event){
    const {value} = event.target
    setWord(value)
  }

  function newGame(){
    setGameOver(false)
    setGameStarted(false)
    setGuessingYourWord(false)
    setAllPlayersReady(false)
    setYouWon(false)
  }

  let guess = youGuessed ? "You Guessed Right!!!" : "";

  //Disables starting a new game/new round unless all players are ready and there are at least a minimum of 3 players
  let dis = players.length > 2 && allPlayersReady ? false : true;  

  return (
    <div>
      <div>
        <select id="navOptions" onChange={hamburgerNav}>
          <option value="">Hamburger nav placeholder</option>
          <option value="option1">Profile Page</option>
          <option value="option2">Game Lobby</option>
        </select>
      </div>

      <div>
        <h1>You are in Room {room}</h1>
        <h2>Current players are: {players.join('-')}</h2>
        <button onClick={leaveRoom}>Leave Room</button>        
        <button onClick={disconnectRoom}>Disconnect</button>
      </div>
      
      <br></br>
      <br></br>
      <br></br>

      <div style={columnStyle}>
        <ScoreBoard players={players}/>
      </div>

      <div style={columnStyle}>
        GameBoard Component placeholder
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        
        <GameBoard
          wordHandler={wordHandler} 
          sendWord={sendWord}
          startGame={startGame}
          dis={dis}
          gameStarted={gameStarted}
          length={length}
          guess={guess}
          guessWord={guessWord}
          guessWordHandler={event => setWord(event.target.value)}
          guessingYourWord={guessingYourWord}
          host={host}
          gameOver={gameOver}
          newGame={newGame}
          youWon={youWon}
          winner={winner}
        />
      </div>

      <div style={columnStyle}>
        <h4>Chatbox placeholder</h4>
      </div>
    </div>
  );
}

export default GameRoom;
