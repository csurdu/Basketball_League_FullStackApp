import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Login/AuthContext';

function CreateTeam() {
  const [team, setTeam] = useState({
    name: '',
    year: new Date().getFullYear()
  });
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // Stare pentru mesajul de eroare
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
      // Setează mesajul de eroare din răspunsul API
      setErrorMessage(error.response?.data || "Unknown error");
    }
  };

  return (
    <div>
      <h1>Create a New Team</h1>
      <form onSubmit={handleCreateTeam}>
        <div>
          <label htmlFor="teamName">Team Name:</label>
          <input
            type="text"
            id="teamName"
            name="name"
            value={team.name}
            onChange={handleInputChange}
            placeholder="Enter team name"
            required
          />
        </div>
        <div>
          <label htmlFor="teamYear">Team Year:</label>
          <input
            type="number"
            id="teamYear"
            name="year"
            value={team.year}
            onChange={handleInputChange}
            placeholder="Enter year"
            required
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Afișează mesajul de eroare */}
        <button type="submit">Create Team</button>
      </form>
    </div>
  );
}

export default CreateTeam;
