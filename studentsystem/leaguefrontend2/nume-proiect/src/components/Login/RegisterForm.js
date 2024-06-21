import React, { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const RegisterForm = ({ onRegisterSuccess }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [height, setHeight] = useState('');
    const [error, setError] = useState('');
    const [role, setRole] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !firstName || !lastName || !height || !role || !profilePicture) {
            setError('Please fill in all fields and upload a profile picture');
            return;
        }
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('height', height);
        formData.append('role', role);
        formData.append('profilePicture', profilePicture);
        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/signup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccessMessage('You have registered successfully!');
            onRegisterSuccess(response.data);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'A apărut o eroare');
            } else if (error.request) {
                setError('No response from server');
            } else {
                setError(error.message);
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mt-4">Register</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">Nume</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Prenume</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Parolă</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Height</label>
                        <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1">
                            <option value="">Select a role</option>
                            <option value="PLAYER_NORMAL">PLAYER_NORMAL</option>
                            <option value="CAPTAIN">CAPTAIN</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Profile Picture</label>
                        <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} className="w-full p-2 border border-gray-300 rounded mt-1" />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">Înregistrare</button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
                </form>
                <div className="text-center mt-4">
                    <NavLink to="/login" className="text-blue-500 hover:underline">Already have an account? Sign In</NavLink>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
