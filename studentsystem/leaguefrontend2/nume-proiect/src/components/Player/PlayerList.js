import React, { useEffect, useState } from 'react';
import './TableStyle.css';

function PlayerList() {
  const [players, setPlayers] = useState([]);
  const [sortField, setSortField] = useState('points');
  const [sortOrder, setSortOrder] = useState('ascending');
  const [searchFirstName, setSearchFirstName] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [filter, setFilter] = useState('all');

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

  return (
    <div className="table-container">
      <h2>Player List</h2>
      <div className="sort-controls">
        <label htmlFor="sortField">Sort by: </label>
        <select
          id="sortField"
          value={sortField}
          onChange={e => setSortField(e.target.value)}
        >
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
        <label htmlFor="searchFirstName">Search by First Name: </label>
        <input
          id="searchFirstName"
          type="text"
          value={searchFirstName}
          onChange={e => setSearchFirstName(e.target.value)}
          placeholder="First Name"
        />
        <label htmlFor="searchLastName">Search by Last Name: </label>
        <input
          id="searchLastName"
          type="text"
          value={searchLastName}
          onChange={e => setSearchLastName(e.target.value)}
          placeholder="Last Name"
        />
        <button onClick={() => setFilter('without-team')}>Show Players Without Team</button>
        <button onClick={() => setFilter('with-team')}>Show Players With Team</button>
        <button onClick={() => setFilter('all')}>Show All Players</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Height</th>
            <th>Points per Game</th>
            <th>Rebounds per Game</th>
            <th>Steals per Game</th>
            <th>Assists per Game</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map(player => (
            <tr key={player.id}>
              <td>{player.firstName} {player.lastName}</td>
              <td>{player.height}</td>
              <td>{player.pointsPerGame !== undefined ? player.pointsPerGame.toFixed(1) : 'N/A'}</td>
              <td>{player.reboundsPerGame !== undefined ? player.reboundsPerGame.toFixed(1) : 'N/A'}</td>
              <td>{player.stealsPerGame !== undefined ? player.stealsPerGame.toFixed(1) : 'N/A'}</td>
              <td>{player.assistsPerGame !== undefined ? player.assistsPerGame.toFixed(1) : 'N/A'}</td>
              <td>{player.teamName !== null ? player.teamName : 'No Team'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlayerList;
