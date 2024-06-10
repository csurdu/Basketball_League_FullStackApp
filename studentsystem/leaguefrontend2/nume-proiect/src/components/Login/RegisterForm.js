import React, { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import './FormStyle.css'; // Import the new CSS file

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
        <div className="form-container">
            <div className="form-card">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nume</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div>
                        <label>Prenume</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label>Parolă</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <label>Height</label>
                        <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} />
                    </div>
                    <div>
                        <label>Role</label>
                        <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
                    </div>
                    <div>
                        <label>Profile Picture</label>
                        <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
                    </div>
                    <button type="submit">Înregistrare</button>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </form>
                <div className="form-footer">
                    <NavLink to="/login">Already have an account? Sign In</NavLink>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
