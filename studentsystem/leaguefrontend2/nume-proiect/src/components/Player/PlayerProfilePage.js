import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserProfilePage.css';

const PlayerProfilePage = () => {
  const { playerId } = useParams();
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const url = `http://localhost:8080/player/${playerId}`;
    axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {

      setProfile(response.data);
    })
    .catch(error => console.error("There was an error fetching player profile!", error));
  }, [token, playerId]);

  const exitTeam = () => {
    if (!profile) return;

    axios.post(`http://localhost:8080/player/removeFromTeam/${profile.id}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      alert('Player successfully removed from the team.');
      // Optionally update the profile state or perform other actions here
    })
    .catch(error => {
      console.error("Failed to remove player from team", error);
      alert('Failed to remove player from team: ' + error.message);
    });
  };

  if (!profile) {
    return <p>Loading player data...</p>;
  }

  const player = profile.player || {};
  const profileImageUrl = player.profilePicture ? `http://localhost:8080/${player.profilePicture}` : '/profilePicture';

  return (
    <div className="userProfile">
      <h1 className="header">Player Profile</h1>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-image-placeholder">
            <img src={profileImageUrl} alt="Profile" className="profile-image" onError={(e) => { e.target.src = '/default-profile.png'; }} />
          </div>
          <div className="profile-details">
            <h2>{player.firstName} {player.lastName}</h2>
            <p><strong>Team:</strong> {player.team ? player.team.name : 'Free Agent'}</p>
            <p><strong>Height:</strong> {player.height || 'Not specified'}</p>
            <p><strong>Captain:</strong> {profile.captain ? 'Yes' : 'No'}</p> {/* Afișează dacă este căpitan din profile */}
            <p><strong>Total Scoring Percentage:</strong> {player.scoringPercentage ? player.scoringPercentage.toFixed(1) + '%' : 'N/A'}</p>
            <p><strong>Games Played:</strong> {player.gamesPlayed || 'N/A'}</p>
          </div>
        </div>
        <button className="button" onClick={exitTeam}>Exit Team</button>
        <div className="stats-container">
          <h3>Player Stats</h3>
          <table className="statsTable">
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Height</th>
                <th>Points Per Game</th>
                <th>Rebounds Per Game</th>
                <th>Steals Per Game</th>
                <th>Assists Per Game</th>
                <th>1-Point %</th>
                <th>2-Point %</th>
                <th>3-Point %</th>
                <th>Captain</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{player.team ? player.team.name : 'No Team'}</td>
                <td>{player.height || 'Not specified'}</td>
                <td>{player.pointsPerGame ? player.pointsPerGame.toFixed(1) : 'N/A'}</td>
                <td>{player.reboundsPerGame ? player.reboundsPerGame.toFixed(1) : 'N/A'}</td>
                <td>{player.stealsPerGame ? player.stealsPerGame.toFixed(1) : 'N/A'}</td>
                <td>{player.assistsPerGame ? player.assistsPerGame.toFixed(1) : 'N/A'}</td>
                <td>{player.onePointPercentage ? player.onePointPercentage.toFixed(1) + '%' : 'N/A'}</td>
                <td>{player.twoPointPercentage ? player.twoPointPercentage.toFixed(1) + '%' : 'N/A'}</td>
                <td>{player.threePointPercentage ? player.threePointPercentage.toFixed(1) + '%' : 'N/A'}</td>
                <td>{profile.captain ? 'Yes' : 'No'}</td> {/* Afișează dacă este căpitan din profile */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfilePage;
