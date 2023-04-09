import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import ScoreBoard from './ScoreBoard';
import GameBoard from './GameBoard';

{/* <div className="App">
  <h2>Waiting for the other players....</h2>
  <button onClick={startGame} disabled={dis}>Start Game</button>
  <button onClick={leaveRoom}>Leave Room</button>
  <button onClick={disconnectRoom} >Disconnect</button>
</div> */}

function GameRoom(props) {
  let navigate = useNavigate(); 

  const hamburgerNav = (event) => {
    event.target.value === 'option1' ? navigate('/ProfilePage') : navigate('/GameLobby');
  }

  const columnStyle = {
    display: 'inline-block', // Creates column effect
    width: '30%', // creates spacing in between text
    verticalAlign: 'top', // each div has the same top starting point
    };

  return (
    <div>
      <div>
        <select id="navOptions"  onChange={hamburgerNav}>
          <option value="">Hamburger nav placeholder</option>
          <option value="option1">Profile Page</option>
          <option value="option2">Game Lobby</option>
        </select>
      </div>
      
      <div>
        <h1>Room {props.room}</h1>
        <h2>Players:{props.players.join('-')}</h2>
      </div>

      <div style={columnStyle}>
        <ScoreBoard />
      </div>

      <div style={columnStyle}>GameBoard placeholder
        <GameBoard 
          leaveRoom={props.leaveRoom} 
          wordHandler={props.wordHandler} 
          sendWord={props.sendWord}
          startGame={props.startGame}
          dis={props.dis}
          gameStarted={props.gameStarted}
          length={props.length}
          guess={props.guess}
          guessWord={props.guessWord}
          guessWordHandler={props.guessWordHandler}
          guessingYourWord={props.guessingYourWord}
          host={props.host}
          gameOver={props.gameOver}
          newGame={props.newGame}
        />
      </div>

      <div style={columnStyle} >
        <h4>Chatbox placeholder</h4>
      </div>
    </div>
  )
}

export default GameRoom

