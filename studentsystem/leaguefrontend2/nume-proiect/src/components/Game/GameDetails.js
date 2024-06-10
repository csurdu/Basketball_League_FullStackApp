import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './GameDetails.css'; // Import the new CSS file
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
    <div className="game-details-container">
      <div className="game-details-header">
        <h2>Game Details</h2>
      </div>
      <div className="basketball-court">
        <img src={basketballCourtImage} alt="Basketball Court" />
        <div className="team-scores">
          <div className="team-score">{gameDetails.scoreTeamA}</div>
          <div className="team-score">{gameDetails.scoreTeamB}</div>
        </div>
      </div>
      <div className="stats-container">
        <div className="player-stats">
          <h4>Team A Player Stats</h4>
          <ul>
            {gameDetails.teamAPlayerStats.map((player, index) => (
              <li key={index}>{player.name}: {player.points} points, {player.rebounds} rebounds, {player.assists} assists, {player.steals} steals</li>
            ))}
          </ul>
        </div>
        <div className="player-stats">
          <h4>Team B Player Stats</h4>
          <ul>
            {gameDetails.teamBPlayerStats.map((player, index) => (
              <li key={index}>{player.name}: {player.points} points, {player.rebounds} rebounds, {player.assists} assists, {player.steals} steals</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="event-log-container">
        <h3>Game Events</h3>
        <ul>
          {gameDetails.events.map((event, index) => (
            <li key={index}>Play {index + 1}: {event.description}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GameDetails;
