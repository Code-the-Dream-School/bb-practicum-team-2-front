import { SocketContext } from "../utils/Socket";
import React, { useEffect, useState, useContext } from "react";
import { UserDataContext } from "../App";
import { base_url } from "../config";
import ScoreBoard from "./ScoreBoard";
import GameBoard from "./GameBoard";
import GameChat from "./GameChat";

function GameRoom({ room, setInRoom, userName, host, setHost, gamesWon, _id }) {
  const socket = useContext(SocketContext);

  const [allPlayersReady, setAllPlayersReady] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [length, setLength] = useState(0);
  const [guessingYourWord, setGuessingYourWord] = useState(false);
  const [guess, setGuess] = useState("");
  const [word, setWord] = useState("");
  const [players, setPlayers] = useState([userName]);
  const [gameOver, setGameOver] = useState(false);
  const [youWon, setYouWon] = useState(false);
  const [winner, setWinner] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [startTimer, setStartTimer] = useState(false);
  const { setUserData } = useContext(UserDataContext);
  const [hint, setHint] = useState("");
  const [wordSent, setWordSent] = useState(false);

  if (!socket.connected) setInRoom(false);
  let token = null; // used for cookies
  token = localStorage.getItem("token");

  useEffect(() => {
    //Receives players from the backend who entered a specific GameRoom
    socket.on("players", (data) => {
      setPlayers(data);
    });

    //Checks that all players are ready by either submitting their guesses or submitting a word to guess
    socket.on("all_players_ready", () => {
      setAllPlayersReady(true);
      // setStartTimer(true)
    });

    socket.on('hint', (hint) => {
      setHint(hint);
    });

     // changes
     
    //Returns the length of the word to be guessed
    socket.on("word_to_guess", (length) => {
      setLength(length);
      //Resets the states to play a new round
      setGameStarted(true);
      setGuessingYourWord(false);
      // setYouGuessed(false);
      setSeconds(30)
      setStartTimer(true) 
      setGuess("")
    });

    //Blocks player from guessing in current round if their submitted word was selected to be guessed.
    socket.on("guessing_your_word", () => {
      setGuessingYourWord(true);
      setGameStarted(true);
      setSeconds(30)
      setStartTimer(true)  // New location
    });

    //Returned when a player guesses the correct word
    socket.on("right", () => {
      // setYouGuessed(true);
      setGuess("You Guessed Right!!!")
    });

    socket.on("wrong", () => {
      setGuess("Nope. Try again!!!")
    });

    socket.on("all_ready_for_next_round", () => {
      setAllPlayersReady(true);
      setSeconds(0)
    });

    socket.on("game_over", () => {
      setGameOver(true)
      setStartTimer(false)
    });

    //This is at the end of the game

    //Returns the winner if it's not yourself
    socket.on("winner", (data) => setWinner(data));
    //Returned if you are the winner
    async function patch() {
      try {
        const response = await fetch(`${base_url}api/v1/user/${_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            gamesWon: ++gamesWon
          })
        });

        const data = await response.json();
        if (response.status === 200) {
          console.log("resp 200");
          setUserData(data.user);
          setYouWon(true);
        }
      } catch (error) {
        console.log("Error occurred: ", error);
      }
    }
    socket.on("you_won", patch);
    return () => socket.off("you_won", patch);
  }, [socket]);

  function handleTimerEnd() {
    console.log("Entre a handle TImer End para enviar time_off");
    setStartTimer(false)
    socket.emit("time_off", room)
  }

  const startGame = () => {
    socket.emit("start_game", room);
    setGameStarted(true);
    setAllPlayersReady(false);
    // setYouGuessed(false);
    setGuessingYourWord(false);
  };

  const guessWord = () => {
    socket.emit("guess_word", { word, room });
  };

  const sendWord = async () => {
    if (word === "" || word === null) {
      window.alert("Please enter a word");
    } else {
      const isValid = await checkWord(word.toLowerCase());
      console.log(`Is ${word} valid? ${isValid}`);
      if (!isValid) {
        window.alert("Please enter a valid word");
      } else {
        setWordSent(true)
        socket.emit("send_word", { word, room });
      }
    }
  };

  /* the function checks if words are valid english  */
  const checkWord = async (word) => {
    try {
      const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
      const data = await response.json();
      const isValid = data.title !== "No Definitions Found"
      return isValid;
    } catch (error) {
      console.error(error);
      return false;
    }
  };


  const leaveRoom = () => {
    socket.emit("leave_room", room);
    setInRoom(false);
    setHost(false)
  };

  function wordHandler(event) {
    const { value } = event.target;
    setWord(value);
  }

  function newGame() {
    setGameOver(false);
    setGameStarted(false);
    setGuessingYourWord(false);
    setAllPlayersReady(false);
    setYouWon(false);
  }

  //Disables starting a new game/new round unless all players are ready and there are at least a minimum of 3 players
  let dis = players.length > 2 && allPlayersReady ? false : true;

  return (
    <div>
      <div className="bg-white border-gray-200 dark:bg-gray-800 w-1/8 flex flex-row justify-between">

        <div className="text-left px-2.5">
          <hr className="border-gray-700"></hr>

          <h2 className=" text-white">
              You have won <span style={{color:"#ECBE07"}} > {gamesWon} </span> Game{gamesWon !== 1 && "s"}!
          </h2>
        </div>

        <div className=" text-right px-2.5">
          <h2>
            <span className="text-md uppercase" style={{color:"#ECBE07"}}>{userName}</span> &nbsp; &nbsp;
            <button className="text-white  hover:text-blue-700" onClick={leaveRoom}>
              Leave Room: <span style={{color:"#ECBE07"}}>{room}</span>
            </button>
          </h2>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 3fr 1fr', marginTop: '80px'}}>
        <div style={{marginLeft: '10px'}}>
          <ScoreBoard players={players} setSeconds={setSeconds} />
        </div>

        <div style={{padding: '0 10px'}}>          
          <GameBoard
            hint={hint}
            wordHandler={wordHandler}
            sendWord={sendWord}
            startGame={startGame}
            dis={dis}
            gameStarted={gameStarted}
            length={length}
            guess={guess}
            guessWord={guessWord}
            guessWordHandler={(event) => setWord(event.target.value)}
            guessingYourWord={guessingYourWord}
            host={host}
            gameOver={gameOver}
            newGame={newGame}
            youWon={youWon}
            winner={winner}
            startTimer={startTimer}
            wordSent={wordSent} 
            setWordSent ={setWordSent}
            numberOfPlayers={players.length}
            handleTimerEnd={handleTimerEnd} seconds={seconds} setSeconds={setSeconds}
          />
        </div>

        <div style={{marginRight: '10px'}}>
          <GameChat 
            room={room} 
            players={players} 
            userName={userName} 
            />
        </div>
      </div>

    </div>
  );
}

export default GameRoom;
