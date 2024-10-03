// Team.js
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Team() {
    const [teamSearch, setTeamSearch] = useState('');
    const [teamInfo, setTeamInfo] = useState(null);

    const handleTeamSearch = () => {
        const url = `http://localhost:8080/team/players?teamName=${encodeURIComponent(teamSearch)}`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setTeamInfo(data);
            })
            .catch(error => console.error('Team search failed:', error));
    };
    
    return (
        <Box sx={{ mt: 2 }}>
            <TextField 
                label="Search Team Name" 
                variant="outlined" 
                value={teamSearch} 
                onChange={(e) => setTeamSearch(e.target.value)} 
            />
            <Button variant="contained" onClick={handleTeamSearch} style={{ marginLeft: '8px' }}>
                Search Team
            </Button>

            {teamInfo && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Team: {teamInfo.teamName}</Typography>
                    <Typography>Year: {teamInfo.teamYear}</Typography>
                    {teamInfo.players && teamInfo.players.length > 0 ? (
                        teamInfo.players.map((player, index) => (
                            <Box key={index} sx={{ mt: 1 }}>
                                <Typography>Player Name: {player.name}</Typography>
                                <Typography>Height: {player.height}</Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography>No players found for this team.</Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}
