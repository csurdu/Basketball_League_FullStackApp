import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import loginImage from './TheBasketBallLeague_Logo.jpeg'; // Update the path to your image

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
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <img src={loginImage} alt="Login" className="mx-auto w-24 h-24 rounded-full" />
                <h2 className="text-2xl font-bold text-center mt-4">Login</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-gray-700">Parolă</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </span>
                    </div>
                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">Login</button>
                </form>
                <div className="text-center mt-4">
                    <NavLink to="/register" className="text-blue-500 hover:underline">Don't have an account? Sign Up</NavLink>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
