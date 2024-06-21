import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Invitations from './Invitations'; // Ensure the path to this component is correct
import './UserProfilePage.css'; // Import the CSS file

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
      <div className="profile-container max-w-6xl mx-auto p-8 bg-gradient-to-r from-white to-gray-200 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">User Profile</h1>
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="flex-shrink-0 flex justify-center md:justify-start mb-4 md:mb-0">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-gray-300"
              onError={(e) => { e.target.src = '/default-profile.png'; }}
            />
          </div>
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-blue-500">{profile.firstName} {profile.lastName}</h2>
            <p className="text-lg text-gray-600"><strong>Team:</strong> {player.team ? player.team.name : 'Free Agent'}</p>
            <p className="text-lg text-gray-600"><strong>Height:</strong> {player.height || 'Not specified'}</p>
            <p className="text-lg text-gray-600"><strong>Captain:</strong> {profile.captain ? 'Yes' : 'No'}</p>
            <p className="text-lg text-gray-600"><strong>Total Scoring Percentage:</strong> {player.scoringPercentage ? player.scoringPercentage.toFixed(1) + '%' : 'N/A'}</p>
            <p className="text-lg text-gray-600"><strong>Games Played:</strong> {player.gamesPlayed || 'N/A'}</p>
            <button
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              onClick={exitTeam}
            >
              Exit Team
            </button>
          </div>
          <div className="flex-grow">
            <Invitations token={token} />
          </div>
        </div>
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Player Stats</h3>
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
                <th className="px-4 py-2">Captain</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center bg-gray-100 border-b border-gray-200">
                <td className="px-4 py-2">{player.team ? player.team.name : 'No Team'}</td>
                <td className="px-4 py-2">{player.height || 'Not specified'}</td>
                <td className="px-4 py-2">{player.pointsPerGame ? player.pointsPerGame.toFixed(1) : 'N/A'}</td>
                <td className="px-4 py-2">{player.reboundsPerGame ? player.reboundsPerGame.toFixed(1) : 'N/A'}</td>
                <td className="px-4 py-2">{player.stealsPerGame ? player.stealsPerGame.toFixed(1) : 'N/A'}</td>
                <td className="px-4 py-2">{player.assistsPerGame ? player.assistsPerGame.toFixed(1) : 'N/A'}</td>
                <td className="px-4 py-2">{player.onePointPercentage ? player.onePointPercentage.toFixed(1) + '%' : 'N/A'}</td>
                <td className="px-4 py-2">{player.twoPointPercentage ? player.twoPointPercentage.toFixed(1) + '%' : 'N/A'}</td>
                <td className="px-4 py-2">{player.threePointPercentage ? player.threePointPercentage.toFixed(1) + '%' : 'N/A'}</td>
                <td className="px-4 py-2">{profile.captain ? 'Yes' : 'No'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
