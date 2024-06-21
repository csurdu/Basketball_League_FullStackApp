import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamList.css'; // Import the CSS file

function TeamList() {
  const [teams, setTeams] = useState([]);
  const [sortField, setSortField] = useState('points'); // Default sorting field
  const [sortOrder, setSortOrder] = useState('ascending'); // Default sorting order
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const url = `http://localhost:8080/team/${sortField}/${sortOrder}`;
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
    .then(data => {
      console.log(data); // Log the data here
      setTeams(data);
    })
    .catch(error => console.error("There was an error!", error));
  }, [sortField, sortOrder]);

  // Filter teams based on search term
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle team click and navigate to team details page
  const handleTeamClick = (teamName) => {
    navigate(`/team/${teamName}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#333' }}>Team List</h2>
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
            <option value="games">Games</option>
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
          <label htmlFor="searchTerm" className="text-gray-700">Search:</label>
          <input
            id="searchTerm"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by team name"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: '#333' }}
          />
        </div>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg table-container">
        <table className="min-w-full bg-white">
          <thead className="table-header text-white">
            <tr>
              <th className="w-1/4 px-4 py-2">Team Name</th>
              <th className="w-1/6 px-4 py-2">Games Won</th>
              <th className="w-1/6 px-4 py-2">Games Lost</th>
              <th className="w-1/6 px-4 py-2">Total Points</th>
              <th className="w-1/6 px-4 py-2">Total Rebounds</th>
              <th className="w-1/6 px-4 py-2">Total Steals</th>
              <th className="w-1/6 px-4 py-2">Total Assists</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.map(team => (
              <tr key={team.id} className="table-row border-b border-gray-200 hover:bg-gray-200" style={{ color: '#333' }}>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleTeamClick(team.name)}
                    className="text-blue-500 hover:underline"
                    style={{ color: '#333' }}
                  >
                    {team.name}
                  </button>
                </td>
                <td className="border px-4 py-2">{team.gamesWon}</td>
                <td className="border px-4 py-2">{team.gamesLost}</td>
                <td className="border px-4 py-2">{team.totalPoints.toFixed(1)}</td>
                <td className="border px-4 py-2">{team.totalRebounds.toFixed(1)}</td>
                <td className="border px-4 py-2">{team.totalSteals.toFixed(1)}</td>
                <td className="border px-4 py-2">{team.totalAssists.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeamList;
