import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

function PlayerStats() {
    const [players, setPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/player`);
            setPlayers(response.data);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    const filteredPlayers = players.filter((player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>Player Stats</h1>
            <input
                type='text'
                placeholder='Search players'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
                {filteredPlayers.map((player) => (
                    <li key={player.id}>
                        {player.name} - {player.stats}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PlayerStats;