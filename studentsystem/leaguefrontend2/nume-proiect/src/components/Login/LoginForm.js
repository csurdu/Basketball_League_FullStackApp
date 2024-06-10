import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import './FormStyle.css'; // Import the new CSS file
import loginImage from './TheBasketBallLeague_Logo.jpeg'; // Import your image

const LoginForm = ({ onLoginSuccess }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/signin', { email, password });
            login(response.data);
            navigate('/team');
            onLoginSuccess && onLoginSuccess(response.data);
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'A apărut o eroare');
            } else {
                setError('Nu s-a putut face conexiunea cu serverul.');
            }
        }
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <img src={loginImage} alt="Login" />
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="password-container">
                        <label>Parolă</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </span>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit">Login</button>
                </form>
                <div className="form-footer">
                    <NavLink to="/register">Don't have an account? Sign Up</NavLink>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;