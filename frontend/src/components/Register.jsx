// src/components/Auth/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser  } from '../services/api'; // Ensure this function exists

const Register = () => {
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('clerk'); // Default role
    const navigate = useNavigate();

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { username, email, password, role }; // Include role in user data

        try {
            const response = await registerUser (userData); // Call the register function from the API service

            if (response.success) {
                alert('Registration successful!');
                navigate('/login'); // Redirect to login page after successful registration
            } else {
                alert('Registration failed: ' + response.message);
            }
        } catch (error) {
            alert('An error occurred: ' + error.message); // Handle any errors that occur during the API call
        }
    };

    return (
        <div className="auth-container"> {/* Styles the full-page background */}
            <div className="auth-box"> {/* Styles the register form container */}
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="auth-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        className="auth-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="auth-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <select
                        className="auth-input"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="clerk">Clerk</option>
                        <option value="admin">Admin</option>
                        <option value="merchant">Merchant</option>
                    </select>
                    <button type="submit" className="login-btn"> {/* Reusing the styled button */}
                        Register
                    </button>
                </form>
            </div>
           
        </div>
    );
};

export default Register;