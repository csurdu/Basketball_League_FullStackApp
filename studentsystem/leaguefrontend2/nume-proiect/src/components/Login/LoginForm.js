import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLoginSuccess }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('LoginForm handleSubmit - email and password:', email, password);
        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/signin', { email, password });
            console.log('Login successful:', response.data);
            login(response.data); // Actualizează starea de autentificare
            navigate('/team'); // Navighează la pagina de TeamList după login
            onLoginSuccess && onLoginSuccess(response.data);
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'A apărut o eroare');
            } else {
                setError('Nu s-a putut face conexiunea cu serverul.');
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Parolă</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <div>{error}</div>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
