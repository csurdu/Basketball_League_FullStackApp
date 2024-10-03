// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Verifică calea

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        // Dacă nu există un utilizator autentificat, redirecționează la pagina de login
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
