// Player.js
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function PlayerForm() {
    const [name, setName] = useState('');
    const [teamName, setTeamName] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchTeam, setSearchTeam] = useState('');
    const [playerResult, setPlayerResult] = useState(null);

    const handleClick = (e) => {
        e.preventDefault();
        const player = { name, team: { name: teamName } };
        fetch("http://localhost:8080/player/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(player)
        })
        .then(response => response.json())
        .then(data => {
            console.log("New player added", data);
        })
        .catch(error => console.error('Error:', error));
    };

    const handleSearch = () => {
        const url = `http://localhost:8080/player/search?name=${encodeURIComponent(searchName)}&teamName=${encodeURIComponent(searchTeam)}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setPlayerResult(data);
            })
            .catch(error => {
                console.error('Search failed:', error);
                setPlayerResult(null);
            });
    };

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <TextField id="player-name" label="Player Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField id="team-name" label="Player Team" variant="outlined" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
            <Button variant="contained" onClick={handleClick}>Add Player</Button>

            <TextField label="Search Player Name" variant="outlined" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
            <TextField label="Search Player Team" variant="outlined" value={searchTeam} onChange={(e) => setSearchTeam(e.target.value)} />
            <Button variant="contained" onClick={handleSearch} style={{ marginLeft: '8px' }}>Search Player</Button>
            
            {playerResult && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Player Name: {playerResult.name}</Typography>
                    <Typography>Team: {playerResult.team?.name}</Typography>
                    <Typography>Height: {playerResult.height}</Typography>
                </Box>
            )}
        </Box>
    );
}
