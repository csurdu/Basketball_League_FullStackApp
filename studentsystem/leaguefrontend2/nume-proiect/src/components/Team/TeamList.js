import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './TableStyle.css'; // Make sure your CSS is correctly linked to this file

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
    <div className="table-container">
      <h2>Team List</h2>
      <div className="sort-controls">
        <label htmlFor="sortField">Sort by: </label>
        <select
          id="sortField"
          value={sortField}
          onChange={e => setSortField(e.target.value)}
        >
                  <option value="games">Games</option>

          <option value="points">Points</option>
          <option value="rebounds">Rebounds</option>
          <option value="steals">Steals</option>
          <option value="assists">Assists</option>
        </select>
        <label htmlFor="sortOrder">Order: </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
        >
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
        <label htmlFor="searchTerm">Search: </label>
        <input
          id="searchTerm"
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by team name"
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Games Won</th>
            <th>Games Lost</th>
            <th>Total Points</th>
            <th>Total Rebounds</th>
            <th>Total Steals</th>
            <th>Total Assists</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeams.map(team => (
            <tr key={team.id}>
              <td>
                <button onClick={() => handleTeamClick(team.name)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
                  {team.name}
                </button>
              </td>
              <td>{team.gamesWon}</td>
              <td>{team.gamesLost}</td>
              <td>{team.totalPoints.toFixed(1)}</td>
              <td>{team.totalRebounds.toFixed(1)}</td>
              <td>{team.totalSteals.toFixed(1)}</td>
              <td>{team.totalAssists.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeamList;
