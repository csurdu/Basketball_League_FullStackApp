import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/Login/AuthContext';
import ProtectedRoute from './components/Login/ProtectedRoute';
import PlayerList from './components/Player/PlayerList';
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

function NavBar() {
  const { user } = useAuth();

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

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm onRegisterSuccess={handleRegisterSuccess} />} />
            <Route path="/" element={<ProtectedRoute><PlayerList /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><TeamList /></ProtectedRoute>} />
            <Route path="/team/:teamName" element={<ProtectedRoute><TeamDetails /></ProtectedRoute>} />
            <Route path="/user-profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
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
