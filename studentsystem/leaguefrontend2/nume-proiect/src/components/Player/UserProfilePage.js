import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Invitations from './Invitations'; // Ensure the path to this component is correct
import './UserProfilePage.css'; // Import the CSS file for additional styling

const UserProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const url = `http://localhost:8080/user/me`;
    axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setProfile(response.data);
    })
    .catch(error => console.error("There was an error fetching user profile!", error));
  }, [token]);

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
    return <p>Loading user data...</p>;
  }

  const player = profile.player || {};
  const profileImageUrl = profile.profilePicture ? `http://localhost:8080/${profile.profilePicture}` : '/profilePicture';

  return (
    <div className="background-container">
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={profileImageUrl}
            alt="Profile"
            className="profile-picture"
            onError={(e) => { e.target.src = '/default-profile.png'; }}
          />
          <div className="profile-header-info">
            <h1 className="profile-name">{profile.firstName} {profile.lastName}</h1>
          </div>
        </div>
        <div className="profile-details">
          <div className="profile-status">
            <p className="profile-detail-item"><strong>Team:</strong> {player.team ? player.team.name : 'Free Agent'}</p>
            <p className="profile-detail-item"><strong>Height:</strong> {player.height || 'Not specified'}</p>
            <p className="profile-detail-item"><strong>Captain:</strong> {profile.captain ? 'Yes' : 'No'}</p>
            <p className="profile-detail-item"><strong>Games Played:</strong> {player.gamesPlayed || 'N/A'}</p>
            <p className="profile-detail-item"><strong>ScoringPercentage:</strong> {player.scoringPercentage + '%' || 'N/A'}</p>

          </div>
          <div className="profile-stats">
            <h2>Player Stats</h2>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Points Per Game</th>
                  <th>Rebounds Per Game</th>
                  <th>Steals Per Game</th>
                  <th>Assists Per Game</th>
                  <th>1-Point %</th>
                  <th>2-Point %</th>
                  <th>3-Point %</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{player.pointsPerGame ? player.pointsPerGame.toFixed(1) : 'N/A'}</td>
                  <td>{player.reboundsPerGame ? player.reboundsPerGame.toFixed(1) : 'N/A'}</td>
                  <td>{player.stealsPerGame ? player.stealsPerGame.toFixed(1) : 'N/A'}</td>
                  <td>{player.assistsPerGame ? player.assistsPerGame.toFixed(1) : 'N/A'}</td>
                  <td>{player.onePointPercentage ? player.onePointPercentage.toFixed(1) + '%' : 'N/A'}</td>
                  <td>{player.twoPointPercentage ? player.twoPointPercentage.toFixed(1) + '%' : 'N/A'}</td>
                  <td>{player.threePointPercentage ? player.threePointPercentage.toFixed(1) + '%' : 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="invitation-section">
          <Invitations token={token} />
        </div>
        <button className="exit-team-button" onClick={exitTeam}>Exit Team</button>
      </div>
    </div>
  );
};

export default UserProfilePage;
