// src/components/Login/LogoutButton.js
import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        localStorage.removeItem('jwtToken'); // Șterge tokenul din localStorage
        navigate('/login'); // Redirecționează la pagina de login
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;
