import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = ({ onRegisterSuccess }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [height, setHeight] = useState('');
    const [error, setError] = useState('');
    const [role, setRole] = useState('');
    const [profilePicture, setProfilePicture] = useState(null); // State to hold the profile picture
    const [successMessage, setSuccessMessage] = useState('');  // State to hold the success message

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
        formData.append('profilePicture', profilePicture); // Add the profile picture to form data
    
        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/signup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Signup successful, response:', response);
            setSuccessMessage('You have registered successfully!');  // Set the success message

            onRegisterSuccess(response.data);

        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'A apărut o eroare');
                console.error('Signup failed, error response:', error.response);
            } else if (error.request) {
                setError('No response from server');
                console.error('Signup failed, no response:', error.request);
            } else {
                setError(error.message);
                console.error('Error', error.message);
            }
        }
    };

    return (
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>
    );
};

export default RegisterForm;
