import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import basketballCourtImage from './basketball-court.png'; // Update this path

function GameDetails() {
  const { gameId } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const [simulationResults, setSimulationResults] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetchGameDetails();
  }, [gameId]);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stomp = Stomp.over(socket);
    stomp.connect({}, frame => {
      console.log('Connected: ' + frame);
      setStompClient(stomp);

      stomp.subscribe(`/topic/gameplay/${gameId}`, gameUpdate => {
        const gameData = JSON.parse(gameUpdate.body);
        console.log("Received game data:", gameData);

        const newResult = {
          scoreTeamA: gameData.scoreTeamA,
          scoreTeamB: gameData.scoreTeamB,
          playerName: gameData.scoringPlayer ? `${gameData.scoringPlayer.firstName} ${gameData.scoringPlayer.lastName}` : 'Unknown Player',
          pointsScored: gameData.pointsScored
        };

        setSimulationResults(prevResults => [...prevResults, newResult]);
      });
    });

    return () => {
      if (stomp && stomp.connected) {
        stomp.disconnect();
      }
    };
  }, [gameId]);

  const fetchGameDetails = () => {
    console.log("Fetching game details for gameId:", gameId);

    const url = `http://localhost:8080/games/${gameId}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => setGameDetails(data))
    .catch(error => {
      console.error("Failed to fetch game details!", error);
      alert('Failed to fetch game details!');
    });
  };

  if (!gameDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="bg-gray-800 text-white p-4 rounded-t-lg">
        <h2 className="text-2xl font-bold">Game Details</h2>
      </div>
      <div className="relative my-8">
        <img src={basketballCourtImage} alt="Basketball Court" className="w-full rounded-lg shadow-md" />
        <div className="absolute inset-0 flex justify-between items-start p-4 text-xl font-bold text-black">
          <div className="bg-black bg-opacity-80 p-2 rounded text-white">Team A Score: {gameDetails.scoreTeamA}</div>
          <div className="bg-black bg-opacity-80 p-2 rounded text-white">Team B Score: {gameDetails.scoreTeamB}</div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <h4 className="text-xl font-bold text-black text-center mb-2">Team A Player Stats</h4>
          <ul className="list-none p-0">
            {gameDetails.teamAPlayerStats.map((player, index) => (
              <li key={index} className="bg-gray-200 text-black p-2 mb-2 rounded-lg shadow-sm">
                {player.name}: {player.points} points, {player.rebounds} rebounds, {player.assists} assists, {player.steals} steals
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-1/2">
          <h4 className="text-xl font-bold text-black text-center mb-2">Team B Player Stats</h4>
          <ul className="list-none p-0">
            {gameDetails.teamBPlayerStats.map((player, index) => (
              <li key={index} className="bg-gray-200 text-black p-2 mb-2 rounded-lg shadow-sm">
                {player.name}: {player.points} points, {player.rebounds} rebounds, {player.assists} assists, {player.steals} steals
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-gray-200 p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-4 text-black">Game Events</h3>
        <ul className="list-none p-0">
          {gameDetails.events.map((event, index) => (
            <li key={index} className="bg-white text-black p-2 mb-2 rounded-lg shadow-sm">
              Play {index + 1}: {event.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GameDetails;
