import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PlayerList() {
  const [players, setPlayers] = useState([]);
  const [sortField, setSortField] = useState('points');
  const [sortOrder, setSortOrder] = useState('ascending');
  const [searchFirstName, setSearchFirstName] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetchPlayers();
  }, [sortField, sortOrder, filter]);

  const fetchPlayers = () => {
    let url = `http://localhost:8080/player/${sortField}/${sortOrder}`;
    if (filter === 'with-team') {
      url = 'http://localhost:8080/player/with-team';
    } else if (filter === 'without-team') {
      url = 'http://localhost:8080/player/without-team';
    }

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Server response was not OK');
      }
      return response.json();
    })
    .then(data => setPlayers(data))
    .catch(error => console.error("There was an error!", error));
  };

  // Filter players based on search term
  const filteredPlayers = players.filter(player =>
    (player.firstName?.toLowerCase() ?? '').includes(searchFirstName.toLowerCase()) &&
    (player.lastName?.toLowerCase() ?? '').includes(searchLastName.toLowerCase())
  );

  const handleRowClick = (playerId) => {
    navigate(`/player/${playerId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#333' }}>Player List</h2>
      <div className="flex flex-wrap mb-4 space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="sortField" className="text-gray-700">Sort by:</label>
          <select
            id="sortField"
            value={sortField}
            onChange={e => setSortField(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: '#333' }}
          >
            <option value="points">Points</option>
            <option value="rebounds">Rebounds</option>
            <option value="steals">Steals</option>
            <option value="assists">Assists</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="sortOrder" className="text-gray-700">Order:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: '#333' }}
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="searchFirstName" className="text-gray-700">Search by First Name:</label>
          <input
            id="searchFirstName"
            type="text"
            value={searchFirstName}
            onChange={e => setSearchFirstName(e.target.value)}
            placeholder="First Name"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: '#333' }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="searchLastName" className="text-gray-700">Search by Last Name:</label>
          <input
            id="searchLastName"
            type="text"
            value={searchLastName}
            onChange={e => setSearchLastName(e.target.value)}
            placeholder="Last Name"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: '#333' }}
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('without-team')}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Show Players Without Team
          </button>
          <button
            onClick={() => setFilter('with-team')}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Show Players With Team
          </button>
          <button
            onClick={() => setFilter('all')}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Show All Players
          </button>
        </div>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Height</th>
              <th className="px-4 py-2">Points per Game</th>
              <th className="px-4 py-2">Rebounds per Game</th>
              <th className="px-4 py-2">Steals per Game</th>
              <th className="px-4 py-2">Assists per Game</th>
              <th className="px-4 py-2">Team</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map(player => (
              <tr
                key={player.id}
                onClick={() => handleRowClick(player.id)}
                className="bg-gray-100 border-b border-gray-200 hover:bg-gray-200 cursor-pointer"
                style={{ color: '#333' }}
              >
                <td className="border px-4 py-2">{player.firstName} {player.lastName}</td>
                <td className="border px-4 py-2">{player.height}</td>
                <td className="border px-4 py-2">{player.pointsPerGame !== undefined ? player.pointsPerGame.toFixed(1) : 'N/A'}</td>
                <td className="border px-4 py-2">{player.reboundsPerGame !== undefined ? player.reboundsPerGame.toFixed(1) : 'N/A'}</td>
                <td className="border px-4 py-2">{player.stealsPerGame !== undefined ? player.stealsPerGame.toFixed(1) : 'N/A'}</td>
                <td className="border px-4 py-2">{player.assistsPerGame !== undefined ? player.assistsPerGame.toFixed(1) : 'N/A'}</td>
                <td className="border px-4 py-2">{player.teamName !== null ? player.teamName : 'No Team'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PlayerList;
