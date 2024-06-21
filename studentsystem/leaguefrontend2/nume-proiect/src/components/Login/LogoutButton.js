import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        localStorage.removeItem('jwtToken'); // Remove token from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-200"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
