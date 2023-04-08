import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function GameBoard(props) {
    const [wordSent, setWordSent] = useState(false);
  // Navigation
  let navigate = useNavigate();
    function leaveRoom(){
        props.leaveRoom()
        navigate('/GameLobby')
    }

    function sendWord(){
        props.sendWord()
        setWordSent(true)
    }

    function disconnectRoom(){
        navigate('/')
    }

    return (
        !wordSent? 
        <div className="App">
            <input placeholder='Your Word...' onChange={props.wordHandler} />
                <button onClick={sendWord}>Send Word</button>
                <button onClick={leaveRoom}>Leave Room</button>
                <button onClick={disconnectRoom} >Disconnect</button>      
        </div>
        :
        !props.gameStarted?
        <div className="App">
            <h2>Waiting for the other players....</h2>
            <button onClick={props.startGame} disabled={props.dis}>Start Game</button>
            <button onClick={leaveRoom}>Leave Room</button>
            <button onClick={disconnectRoom} >Disconnect</button>

        </div>
        :
        !props.guessingYourWord?
        <div>
            <h2>The word has {props.length} letters</h2>
            <h1>{props.guess}</h1>
            <input placeholder='Guess the Word...' onChange={props.guessWordHandler} />
            <button onClick={props.guessWord}>Send Word</button>
        </div>
        :
        <div>
            <h2>Your word is being guessed for the other players!</h2>
        </div>
    )

}

export default GameBoard;
