import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useNavigate } from 'react-router-dom';

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
  const [simulationTimeLeft, setSimulationTimeLeft] = useState(0);
  const timerRef = useRef(null);
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

        if (timerRef.current === null) {
          setSimulationTimeLeft(10); // Setează timpul de simulare la 10 secunde
          timerRef.current = setInterval(() => {
            setSimulationTimeLeft(prev => {
              if (prev <= 1) {
                clearInterval(timerRef.current);
                timerRef.current = null;
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }

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
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
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
      setSimulationResults([]); // Resetează rezultatele simulării
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
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between mb-8">
        <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#333' }}>Create Game</h2>
          <input
            type="text"
            name="teamAname"
            value={gameDetails.teamAname}
            onChange={handleInputChange}
            placeholder="Team A Name"
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: '#333' }}
          />
          <input
            type="text"
            name="teamBname"
            value={gameDetails.teamBname}
            onChange={handleInputChange}
            placeholder="Team B Name"
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: '#333' }}
          />
          <select
            name="location"
            value={gameDetails.location}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: '#333' }}
          >
            <option value="">Select Location</option>
            <option value="Stadium A">Stadium A</option>
            <option value="Stadium B">Stadium B</option>
            <option value="Stadium C">Stadium C</option>
            <option value="Stadium D">Stadium D</option>
          </select>
          <input
            type="datetime-local"
            name="date"
            value={gameDetails.date}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: '#333' }}
          />
          <button onClick={createGame} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">Create Game</button>
        </div>
        {selectedGameId && (
          <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md mt-8 md:mt-0">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#333' }}>Simulation Details</h2>
            <div className="flex flex-col space-y-4">
              <div>
                <h4 className="text-lg font-bold" style={{ color: '#333' }}>Team A Player Stats</h4>
                <ul className="list-disc list-inside">
                  {teamAPlayers.map((player, index) => (
                    <li key={index} style={{ color: '#333' }}>{player.firstName} {player.lastName}: {player.inGamePoints} points, {player.inGameRebounds} rebounds, {player.inGameAssists} assists, {player.inGameSteals} steals</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold" style={{ color: '#333' }}>Team B Player Stats</h4>
                <ul className="list-disc list-inside">
                  {teamBPlayers.map((player, index) => (
                    <li key={index} style={{ color: '#333' }}>{player.firstName} {player.lastName}: {player.inGamePoints} points, {player.inGameRebounds} rebounds, {player.inGameAssists} assists, {player.inGameSteals} steals</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold" style={{ color: '#333' }}>Simulation Results</h4>
                <p style={{ color: '#333' }}>Team A Score: {gameDetails.teamAScore} — Team B Score: {gameDetails.teamBScore}</p>
                <ul className="list-disc list-inside">
                  {simulationResults.map((result, index) => (
                    <li key={index} style={{ color: '#333' }}>
                      {result.scoreTeamA} - {result.scoreTeamB} -- Score Change
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4" style={{ color: '#333' }}>
                <h4 className="text-lg font-bold">Time left: {simulationTimeLeft} seconds</h4>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#333' }}>Scheduled Games</h2>
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Team A</th>
                <th className="px-4 py-2">Team B</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Simulate</th>
              </tr>
            </thead>
            <tbody>
              {scheduledGames.map((game, index) => (
                <tr key={index} className="bg-gray-100 border-b border-gray-200 hover:bg-gray-200">
                  <td className="px-4 py-2" style={{ color: '#333' }}>{new Date(game.date).toLocaleString()}</td>
                  <td className="px-4 py-2" style={{ color: '#333' }}>{game.team1Name}</td>
                  <td className="px-4 py-2" style={{ color: '#333' }}>{game.team2Name}</td>
                  <td className="px-4 py-2" style={{ color: '#333' }}>{game.location}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => simulateGame(game.id)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">Simulate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md mt-8 md:mt-0">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#333' }}>Game History</h2>
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Team A</th>
                <th className="px-4 py-2">Team B</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {gameHistory.map((game, index) => (
                <tr key={index} onClick={() => handleGameClick(game.id)} className="bg-gray-100 border-b border-gray-200 hover:bg-gray-200 cursor-pointer">
                  <td className="px-4 py-2" style={{ color: '#333' }}>{new Date(game.date).toLocaleString()}</td>
                  <td className="px-4 py-2" style={{ color: '#333' }}>{game.team1Name}</td>
                  <td className="px-4 py-2" style={{ color: '#333' }}>{game.team2Name}</td>
                  <td className="px-4 py-2" style={{ color: '#333' }}>{game.scoreA} - {game.scoreB}</td>
                  <td className="px-4 py-2" style={{ color: '#333' }}>{game.location}</td>
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
