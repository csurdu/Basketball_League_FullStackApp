import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        console.log('AuthProvider useEffect - jwtToken:', jwtToken);
        if (jwtToken) {
            axios.get('http://localhost:8080/api/v1/auth/user', {
                headers: { Authorization: `Bearer ${jwtToken}` }
            }).then(response => {
                console.log('Reautentificare cu succes:', response.data);
                setUser(response.data);
            }).catch(error => {
                console.error('Eroare la reautentificare:', error);
                localStorage.removeItem('jwtToken');
                setUser(null);
            });
        }
    }, []);

    const login = (userData) => {
        console.log('Login func - user data:', userData);
        setUser(userData);
        localStorage.setItem('jwtToken', userData.token);
    };

    const logout = () => {
        console.log('Logout func');
        localStorage.removeItem('jwtToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
