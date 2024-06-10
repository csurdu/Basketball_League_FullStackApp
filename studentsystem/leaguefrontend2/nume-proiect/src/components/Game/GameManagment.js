import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useNavigate } from 'react-router-dom';
import './GameManagement.css';

function GameManagement() {
  const [gameDetails, setGameDetails] = useState({
    teamAname: '',
    teamBname: '',
    location: '',
    date: '',
    gameId: null,
    teamAScore: 0,
    teamBScore: 0
  });
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  const [simulationResults, setSimulationResults] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [scheduledGames, setScheduledGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stomp = Stomp.over(socket);
    stomp.connect({}, frame => {
      console.log('Connected: ' + frame);
      setStompClient(stomp);
    });

    return () => {
      if (stomp && stomp.connected) {
        stomp.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (stompClient && selectedGameId) {
      const gameSubscription = stompClient.subscribe(`/topic/gameplay/${selectedGameId}`, gameUpdate => {
        const gameData = JSON.parse(gameUpdate.body);
        console.log("Received game data:", gameData);

        const newResult = {
          scoreTeamA: gameData.scoreTeamA,
          scoreTeamB: gameData.scoreTeamB,
          pointsScored: gameData.pointsScored
        };
        console.log("New result to be added:", newResult);

        setSimulationResults(prevResults => [...prevResults, newResult]);
        setGameDetails(prev => ({
          ...prev,
          teamAScore: gameData.scoreTeamA,
          teamBScore: gameData.scoreTeamB
        }));

        setTeamAPlayers(gameData.teamA.playerList);
        setTeamBPlayers(gameData.teamB.playerList);
      });

      return () => {
        gameSubscription.unsubscribe();
      };
    }
  }, [stompClient, selectedGameId]);

  useEffect(() => {
    fetchGameHistory();
    fetchScheduledGames();
  }, []);

  const fetchGameHistory = () => {
    const url = `http://localhost:8080/games/history`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Fetched game history:', data);
      setGameHistory(data);
    })
    .catch(error => {
      console.error("Failed to fetch game history!", error);
      alert('Failed to fetch game history!');
    });
  };

  const fetchScheduledGames = () => {
    const url = `http://localhost:8080/games/scheduled`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Fetched scheduled games:', data);
      setScheduledGames(data);
    })
    .catch(error => {
      console.error("Failed to fetch scheduled games!", error);
      alert('Failed to fetch scheduled games!');
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setGameDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const createGame = () => {
    const url = `http://localhost:8080/games/create?teamAname=${encodeURIComponent(gameDetails.teamAname)}&teamBname=${encodeURIComponent(gameDetails.teamBname)}&location=${encodeURIComponent(gameDetails.location)}&date=${encodeURIComponent(gameDetails.date)}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setGameDetails(prev => ({ ...prev, gameId: data.id }));
      alert('Game created successfully!');
      fetchScheduledGames(); // Refresh the scheduled games list
    })
    .catch(error => {
      console.error("Failed to create game!", error);
      alert('Failed to create game!');
    });
  };

  const simulateGame = (gameId) => {
    if (selectedGameId !== gameId) { // Check to prevent duplicate simulations
      setSelectedGameId(gameId);
      const url = `http://localhost:8080/games/simulate/${gameId}`;

      fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
      .then(() => {
        console.log('Simulation started');
      })
      .catch(error => {
        console.error("Failed to simulate game!", error);
        alert('Failed to simulate game!');
      });
    }
  };

  const handleGameClick = (gameId) => {
    console.log(`Navigating to game details for game ID: ${gameId}`);
    navigate(`/games/${gameId}`);
  };

  return (
    <div className="game-management-container">
      <div className="top-container">
        <div className="create-game-container">
          <h2>Create Game</h2>
          <input
            type="text"
            name="teamAname"
            value={gameDetails.teamAname}
            onChange={handleInputChange}
            placeholder="Team A Name"
            className="input-field"
          />
          <input
            type="text"
            name="teamBname"
            value={gameDetails.teamBname}
            onChange={handleInputChange}
            placeholder="Team B Name"
            className="input-field"
          />
          <input
            type="text"
            name="location"
            value={gameDetails.location}
            onChange={handleInputChange}
            placeholder="Location"
            className="input-field"
          />
          <input
            type="datetime-local"
            name="date"
            value={gameDetails.date}
            onChange={handleInputChange}
            className="input-field"
          />
          <button onClick={createGame} className="button">Create Game</button>
        </div>
        {selectedGameId && (
          <div className="simulation-details-container">
            <h2>Simulation Details</h2>
            <div className="stats-results-container">
              <div className="team-stats">
                <h4>Team A Player Stats</h4>
                <ul>
                  {teamAPlayers.map((player, index) => (
                    <li key={index}>{player.firstName} {player.lastName}: {player.inGamePoints} points, {player.inGameRebounds} rebounds, {player.inGameAssists} assists, {player.inGameSteals} steals</li>
                  ))}
                </ul>
              </div>
              <div className="results-container">
                <h3>Simulation Results</h3>
                <p>Team A Score: {gameDetails.teamAScore} — Team B Score: {gameDetails.teamBScore}</p>
                <ul>
                  {simulationResults.map((result, index) => (
                    <li key={index}>
                      {result.scoreTeamA} - {result.scoreTeamB} -- Score Change
                    </li>
                  ))}
                </ul>
              </div>
              <div className="team-stats">
                <h4>Team B Player Stats</h4>
                <ul>
                  {teamBPlayers.map((player, index) => (
                    <li key={index}>{player.firstName} {player.lastName}: {player.inGamePoints} points, {player.inGameRebounds} rebounds, {player.inGameAssists} assists, {player.inGameSteals} steals</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bottom-container">
        <div className="scheduled-games-container">
          <h2>Scheduled Games</h2>
          <table className="scheduled-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Team A</th>
                <th>Team B</th>
                <th>Location</th>
                <th>Simulate</th>
              </tr>
            </thead>
            <tbody>
              {scheduledGames.map((game, index) => (
                <tr key={index} style={{ cursor: 'pointer' }}>
                  <td>{new Date(game.date).toLocaleString()}</td>
                  <td>{game.team1Name}</td>
                  <td>{game.team2Name}</td>
                  <td>{game.location}</td>
                  <td>
                    <button onClick={() => simulateGame(game.id)} className="button">Simulate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="game-history-container">
          <h2>Game History</h2>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Team A</th>
                <th>Team B</th>
                <th>Score</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {gameHistory.map((game, index) => (
                <tr key={index} onClick={() => handleGameClick(game.id)} style={{ cursor: 'pointer' }}>
                  <td>{new Date(game.date).toLocaleString()}</td>
                  <td>{game.team1Name}</td>
                  <td>{game.team2Name}</td>
                  <td>{game.scoreA} - {game.scoreB}</td>
                  <td>{game.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GameManagement;
