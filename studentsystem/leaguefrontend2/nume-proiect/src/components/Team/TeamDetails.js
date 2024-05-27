import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function TeamDetails() {
  const { teamName } = useParams();
  const [teamDetails, setTeamDetails] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const url = `http://localhost:8080/team/name/${encodeURIComponent(teamName)}`;
    
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch team details');
        }
        return response.json();
      })
      .then(data => {
        setTeamDetails(data);
      })
      .catch(error => console.error('Failed to fetch team details:', error));
  }, [teamName, token]);

  if (!teamDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4">Team: {teamDetails.name}</Typography>
      <Typography variant="h6">Year: {teamDetails.year}</Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Player Name</TableCell>
              <TableCell>Height</TableCell>
              <TableCell>Points Per Game</TableCell>
              <TableCell>Rebounds Per Game</TableCell>
              <TableCell>Steals Per Game</TableCell>
              <TableCell>Assists Per Game</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamDetails.playerList.map((player, index) => (
              <TableRow key={index}>
                <TableCell>{`${player.firstName} ${player.lastName}`}</TableCell>
                <TableCell>{player.height} cm</TableCell>
                <TableCell>{player.pointsPerGame}</TableCell>
                <TableCell>{player.reboundsPerGame}</TableCell>
                <TableCell>{player.stealsPerGame}</TableCell>
                <TableCell>{player.assistsPerGame}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TeamDetails;
