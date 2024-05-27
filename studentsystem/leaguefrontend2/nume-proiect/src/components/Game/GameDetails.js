import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

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
    <div className="game-details-container">
      <h2>Game Details</h2>
      <p>Date: {new Date(gameDetails.date).toLocaleString()}</p>
      <p>Location: {gameDetails.location}</p>
      <p>Score: {gameDetails.scoreTeamA} - {gameDetails.scoreTeamB}</p>
      <div className="player-stats-container">
        <h4>Team A Player Stats</h4>
        <ul>
          {gameDetails.teamAPlayerStats.map((player, index) => (
            <li key={index}>{player.name}: {player.points} points, {player.rebounds} rebounds, {player.assists} assists, {player.steals} steals</li>
          ))}
        </ul>
        <h4>Team B Player Stats</h4>
        <ul>
          {gameDetails.teamBPlayerStats.map((player, index) => (
            <li key={index}>{player.name}: {player.points} points, {player.rebounds} rebounds, {player.assists} assists, {player.steals} steals</li>
          ))}
        </ul>
      </div>
      <div className="results-container">
        <h3>Simulation Results</h3>
        <ul>
          {simulationResults.map((result, index) => (
            <li key={index}>
              {result.scoreTeamA} - {result.scoreTeamB}: {result.playerName} scored {result.pointsScored} points
            </li>
          ))}
        </ul>
      </div>
      <div className="event-log-container">
        <h3>Game Events</h3>
        <ul>
          {gameDetails.events.map((event, index) => (
            <li key={index}>{event.timestamp}: {event.description}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GameDetails;
