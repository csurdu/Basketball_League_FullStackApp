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
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';

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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar
          alt={teamDetails.name}
          sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
        />
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Team: {teamDetails.name}
        </Typography>
        <Typography variant="h6" component="h2" color="textSecondary">
          Year: {teamDetails.year}
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ color: 'white', backgroundColor: 'gray' }}>Player Name</TableCell>
              <TableCell align="center" sx={{ color: 'white', backgroundColor: 'gray' }}>Height</TableCell>
              <TableCell align="center" sx={{ color: 'white', backgroundColor: 'gray' }}>Points Per Game</TableCell>
              <TableCell align="center" sx={{ color: 'white', backgroundColor: 'gray' }}>Rebounds Per Game</TableCell>
              <TableCell align="center" sx={{ color: 'white', backgroundColor: 'gray' }}>Steals Per Game</TableCell>
              <TableCell align="center" sx={{ color: 'white', backgroundColor: 'gray' }}>Assists Per Game</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamDetails.playerList.map((player, index) => (
              <TableRow key={index}>
                <TableCell align="center">{`${player.firstName} ${player.lastName}`}</TableCell>
                <TableCell align="center">{player.height} cm</TableCell>
                <TableCell align="center">{player.pointsPerGame.toFixed(1)}</TableCell>
                <TableCell align="center">{player.reboundsPerGame.toFixed(1)}</TableCell>
                <TableCell align="center">{player.stealsPerGame.toFixed(1)}</TableCell>
                <TableCell align="center">{player.assistsPerGame.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TeamDetails;
