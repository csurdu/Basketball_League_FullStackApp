import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PlayerProfilePage.css'; // Import the custom CSS file

const PlayerProfilePage = () => {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const url = `http://localhost:8080/player/${playerId}`;
    axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setPlayer(response.data);
    })
    .catch(error => console.error("There was an error fetching player profile!", error));
  }, [playerId, token]);

  if (!player) {
    return <p>Loading player data...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-r from-white to-gray-200 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-8 profile-text">Player Profile</h1>
      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold profile-text">{player.firstName} {player.lastName}</h2>
          <p className="text-lg profile-text"><strong>Email:</strong> {player.email}</p>
          <p className="text-lg profile-text"><strong>Team:</strong> {player.teamName ? player.teamName : 'Free Agent'}</p>
          <p className="text-lg profile-text"><strong>Height:</strong> {player.height || 'Not specified'}</p>
          <p className="text-lg profile-text"><strong>Total Scoring Percentage:</strong> {player.scoringPercentage ? player.scoringPercentage.toFixed(1) + '%' : 'N/A'}</p>
          <p className="text-lg profile-text"><strong>Games Played:</strong> {player.gamesPlayed || 'N/A'}</p>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 profile-text">Player Stats</h3>
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">Team Name</th>
              <th className="px-4 py-2">Height</th>
              <th className="px-4 py-2">Points Per Game</th>
              <th className="px-4 py-2">Rebounds Per Game</th>
              <th className="px-4 py-2">Steals Per Game</th>
              <th className="px-4 py-2">Assists Per Game</th>
              <th className="px-4 py-2">1-Point %</th>
              <th className="px-4 py-2">2-Point %</th>
              <th className="px-4 py-2">3-Point %</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center bg-gray-100 border-b border-gray-200 profile-text">
              <td className="px-4 py-2">{player.teamName ? player.teamName : 'No Team'}</td>
              <td className="px-4 py-2">{player.height || 'Not specified'}</td>
              <td className="px-4 py-2">{player.pointsPerGame ? player.pointsPerGame.toFixed(1) : 'N/A'}</td>
              <td className="px-4 py-2">{player.reboundsPerGame ? player.reboundsPerGame.toFixed(1) : 'N/A'}</td>
              <td className="px-4 py-2">{player.stealsPerGame ? player.stealsPerGame.toFixed(1) : 'N/A'}</td>
              <td className="px-4 py-2">{player.assistsPerGame ? player.assistsPerGame.toFixed(1) : 'N/A'}</td>
              <td className="px-4 py-2">{player.onePointPercentage ? player.onePointPercentage.toFixed(1) + '%' : 'N/A'}</td>
              <td className="px-4 py-2">{player.twoPointPercentage ? player.twoPointPercentage.toFixed(1) + '%' : 'N/A'}</td>
              <td className="px-4 py-2">{player.threePointPercentage ? player.threePointPercentage.toFixed(1) + '%' : 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerProfilePage;
