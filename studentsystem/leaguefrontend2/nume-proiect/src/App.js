import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import axios from 'axios';
import { AuthProvider, useAuth } from './components/Login/AuthContext';
import ProtectedRoute from './components/Login/ProtectedRoute';
import PlayerList from './components/Player/PlayerList';
import PlayerProfilePage from './components/Player/PlayerProfilePage';
import TeamList from './components/Team/TeamList';
import CreateTeam from './components/Player/CreateTeam';
import LoginForm from './components/Login/LoginForm';
import RegisterForm from './components/Login/RegisterForm';
import LogoutButton from './components/Login/LogoutButton';
import UserProfilePage from './components/Player/UserProfilePage';
import GameManagement from './components/Game/GameManagment';
import GameDetails from './components/Game/GameDetails';
import TeamDetails from './components/Team/TeamDetails';
import './App.css';

function NavBar({ onUpdate }) {
  const { user } = useAuth();
  const [pendingInvitationsCount, setPendingInvitationsCount] = useState(0);
  const token = localStorage.getItem('jwtToken');

  const fetchPendingInvitationsCount = useCallback((userId) => {
    axios.get(`http://localhost:8080/player/invitations/${userId}/pending/count`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setPendingInvitationsCount(response.data);
      if (onUpdate) {
        onUpdate(response.data); // Call the update function
      }
    })
    .catch(error => {
      console.error("Failed to fetch pending invitations count", error);
    });
  }, [token, onUpdate]);

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:8080/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const userId = response.data.id;
        fetchPendingInvitationsCount(userId);
      })
      .catch(error => console.error("Error loading user data", error));
    }
  }, [user, token, fetchPendingInvitationsCount]);

  return (
    <nav className="nav-bar">
      {!user ? (
        <>
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>Login</NavLink>
          <NavLink to="/register" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>Register</NavLink>
        </>
      ) : (
        <>
          <NavLink to="/team" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>Team List</NavLink>
          <NavLink to="/create-team" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>Create Team</NavLink>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>Player List</NavLink>
          <NavLink to="/user-profile" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>UserProfilePage</NavLink>
          <NavLink to="/manage-games" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>Manage Games</NavLink>
          <NavLink to="/user-profile" style={{ textDecoration: 'none', color: 'inherit' }}>
            <IconButton color="inherit">
              <Badge badgeContent={pendingInvitationsCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </NavLink>
          <LogoutButton />
        </>
      )}
    </nav>
  );
}

function App() {
  const handleRegisterSuccess = (data) => {
    console.log('Registration successful:', data);
    // Additional actions after registration, e.g., navigate to another route or display a success message
  };

  const handleNotificationUpdate = (count) => {
    console.log('Notification count updated:', count);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar onUpdate={handleNotificationUpdate} />
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm onRegisterSuccess={handleRegisterSuccess} />} />
            <Route path="/" element={<ProtectedRoute><PlayerList /></ProtectedRoute>} />
            <Route path="/player/:playerId" element={<ProtectedRoute><PlayerProfilePage /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><TeamList /></ProtectedRoute>} />
            <Route path="/team/:teamName" element={<ProtectedRoute><TeamDetails /></ProtectedRoute>} />
            <Route path="/user-profile" element={<ProtectedRoute><UserProfilePage onUpdate={handleNotificationUpdate} /></ProtectedRoute>} />
            <Route path="/create-team" element={<ProtectedRoute><CreateTeam /></ProtectedRoute>} />
            <Route path="/manage-games" element={<ProtectedRoute><GameManagement /></ProtectedRoute>} />
            <Route path="/games/:gameId" element={<ProtectedRoute><GameDetails /></ProtectedRoute>} />
            <Route path="*" element={<Navigate replace to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
