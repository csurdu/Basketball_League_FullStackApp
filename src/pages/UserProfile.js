import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

function UserProfile() {
    const [team, setTeam] = useState([]);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetchTeam();
        fetchPlayers();
    }, []);

    const fetchTeam = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/team/my-team`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setTeam(response.data);
        } catch (error) {
            console.error('Error fetching team:', error);
        }
    };

    const fetchPlayers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/player`);
            setPlayers(response.data);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    const invitePlayer = async (playerId) => {
        try {
            await axios.post(`${API_BASE_URL}/team/invite`, { playerId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchTeam();
        } catch (error) {
            console.error('Error inviting player:', error);
        }
    };

    const removePlayer = async (playerId) => {
        try {
            await axios.delete(`${API_BASE_URL}/team/remove/${playerId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchTeam();
        } catch (error) {
            console.error('Error removing player:', error);
        }
    };

    return (
        <div>
            <h1>User Profile</h1>
            <h2>My Team</h2>
            <ul>
                {team.map((player) => (
                    <li key={player.id}>
                        {player.name}
                        <button onClick={() => removePlayer(player.id)}>Remove</button>
                    </li>
                ))}
            </ul>
            <h2>Available Players</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>
                        {player.name}
                        <button onClick={() => invitePlayer(player.id)}>Invite</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserProfile;