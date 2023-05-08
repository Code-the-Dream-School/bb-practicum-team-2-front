import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../utils/Socket";
import RoundCountDown from "./RoundCountDown";

function GameBoard(props) {
    const [theWordWas, setTheWordWas] = useState("")
    const socket = useContext(SocketContext);

    function sendWord(){
        props.sendWord()
    }

    function newGame(){
        props.newGame()
        props.setWordSent(false)
    }

useEffect(()=>{
    socket.on('the_word_was',wordToGuess=>{
        setTheWordWas(wordToGuess)
    })
},[socket])

    return (
        <div className="w-full h-full p-4 text-center border rounded-lg shadow sm:p-8 bg-gray-700 border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/50">
            <div>
                <RoundCountDown startTimer={props.startTimer} handleTimerEnd={props.handleTimerEnd} seconds={props.seconds} setSeconds={props.setSeconds} />
            </div>
            {!props.gameOver?
            !props.wordSent? 
                <div className="App">
                    Submit a word for others to guess!
                    <br />
                    <input
                        placeholder='Your Word...'
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                        onChange={props.wordHandler}
                    />

                    <button 
                        onClick={sendWord}
                        className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" 
                        >
                            Send Word
                    </button>
                </div>
                :
                !props.gameStarted ?
                    <div className="App">
                        {(3-props.numberOfPlayers)>0?
                            <h2>Waiting for {3-props.numberOfPlayers} other player{3-props.numberOfPlayers>1&&"s"}....</h2>:
                            <h2>Waiting for the words of other players</h2>
                        }
                        {props.host && <button onClick={props.startGame} disabled={props.dis} className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Start Game</button>}
                    </div>
                    :
                    !props.guessingYourWord ?
                        <div>
                                {/************  add hint prop here **********/}
                            <h1>Hints: {props.hint}</h1>
                            <h2>The word has {props.length} letters</h2>
                            <h1>{props.guess}</h1>
                            <form>

                                <input
                                    placeholder='Guess the Word...'
                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                                    onChange={props.guessWordHandler}
                                    disabled={!props.startTimer}
                                />
                                <button
                                    type="reset" 
                                    onClick={props.guessWord}
                                    className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
                                    >
                                        Send Word
                                </button>
                            </form>
                            {props.host && <button onClick={props.startGame} disabled={props.dis} className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Next Round</button>}
                            {!props.startTimer&&<h2>The right word was: {theWordWas}</h2>}
                        </div>
                        :
                        <div>
                            <h2>Your word is being guessed for the other players!</h2>
                            {props.host && <button onClick={props.startGame} disabled={props.dis} className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" >Next Round</button>}
                        </div>
            :
            <div>
            <h2>Game Over</h2>
            {!props.youWon?<h2>Player {props.winner} won this game!</h2>:<h2>You Won!!!</h2>}
            <button onClick={newGame} className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">New Game</button>
            </div>}
        </div>
    )

}

export default GameBoard;