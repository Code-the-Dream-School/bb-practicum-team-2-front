import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from "../utils/Socket";

function ScoreBoard({ players }) {
  const socket = useContext(SocketContext);
  const [gameScore, setGameScore] = useState([]);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    socket.on("game_score", (gameScore) => {
      setGameScore(gameScore);
      setShowData(true);
    });
  }, [gameScore]);

  return (
    <div className="border border-blue-200 h-full overflow-y-scroll rounded-lg shadow-md bg-sky-100 mt-1 hover:shadow-xl hover:shadow-cyan-500/50 opacity-90">
      {showData ? 
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-lg">
                  Player
                </th>
                <th scope="col" className="px-6 py-3 text-lg">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {gameScore
                .sort((a, b) => b.roundsWon - a.roundsWon)
                .map((sortedScore) => {
                  return (
                    <tr key={sortedScore.player} className="bg-white border-b hover:bg-gray-50">
                      <th scope="row" className="px-6 py-4 text-xl text-gray-900 whitespace-nowrap ">
                        {sortedScore.player}
                      </th>
                      <td className="px-6 py-4">
                        {sortedScore.roundsWon}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      : 
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-sky-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-lg">
                  Player
                </th>
                <th scope="col" className="px-6 py-3 text-lg">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="relative">
              {players.map((player) => {
                return (
                  <tr key={player} className="bg-white border-b hover:bg-sky-50">
                    <th scope="row" className="w-full px-6 py-4 text-xl text-gray-900 whitespace-nowrap">
                      {player}
                    </th>
                    <td className="px-6 py-4">
                      0
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}

export default ScoreBoard;