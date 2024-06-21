import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Login/AuthContext';
import './CreateTeam.css'; // Import the CSS file

function CreateTeam() {
  const [team, setTeam] = useState({
    name: '',
    year: new Date().getFullYear()
  });
  const [deleteTeamName, setDeleteTeamName] = useState('');
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/user/me', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        setProfile(data);
        // Check if the user has the admin role
        if (data.role == 'ADMIN') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("There was an error fetching user profile!", error);
        alert("Failed to fetch user profile.");
      }
    };

    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeam(prevTeam => ({ ...prevTeam, [name]: value }));
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!profile?.id) {
      alert('User ID is undefined. Please log in.');
      return;
    }

    try {
      const { data } = await axios.post(`http://localhost:8080/player/createAndJoinTeam/${profile.id}`, team, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });

      console.log('Team created:', data);
      navigate('/team');
    } catch (error) {
      console.error('Error creating team:', error);
      setErrorMessage(error.response?.data || "Unknown error");
    }
  };

  const handleDeleteTeam = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('You do not have permission to delete a team.');
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/team/delete/${deleteTeamName}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });

      console.log('Team deleted');
      navigate('/team'); // Redirect to another page after deletion
    } catch (error) {
      console.error('Error deleting team:', error);
      setDeleteErrorMessage(error.response?.data || "Unknown error");
    }
  };

  return (
    <div className="background-container">
      <div className="form-container">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Manage Teams</h1>

        {/* Create Team Form */}
        <form onSubmit={handleCreateTeam} className="space-y-4 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Create a New Team</h2>
          <div>
            <label htmlFor="teamName" className="block text-gray-700">Team Name:</label>
            <input
              type="text"
              id="teamName"
              name="name"
              value={team.name}
              onChange={handleInputChange}
              placeholder="Enter team name"
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="teamYear" className="block text-gray-700">Team Year:</label>
            <input
              type="number"
              id="teamYear"
              name="year"
              value={team.year}
              onChange={handleInputChange}
              placeholder="Enter year"
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Create Team
          </button>
        </form>

        {/* Delete Team Form */}
        <form onSubmit={handleDeleteTeam} className="space-y-4">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Delete a Team</h2>
          <div>
            <label htmlFor="deleteTeamName" className="block text-gray-700">Team Name:</label>
            <input
              type="text"
              id="deleteTeamName"
              name="deleteTeamName"
              value={deleteTeamName}
              onChange={(e) => setDeleteTeamName(e.target.value)}
              placeholder="Enter team name to delete"
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          {deleteErrorMessage && <p className="text-red-500">{deleteErrorMessage}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
            disabled={!isAdmin} // Disable the button if not admin
          >
            Delete Team
          </button>
          {!isAdmin && <p className="text-red-500">Only admins can delete teams.</p>}
        </form>
      </div>
    </div>
  );
}

export default CreateTeam;
