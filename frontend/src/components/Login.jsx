import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (isRegistering) {
                // Handle registration
                await axios.post('http://localhost:5000/register', {
                    username,
                    password,
                    email
                }, { withCredentials: true });
                
                // After successful registration, log the user in
                await handleLogin();
            } else {
                await handleLogin();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };
    
    const handleLogin = async () => {
        const response = await axios.post('http://localhost:5000/login', {
            username,
            password
        }, { withCredentials: true });
        
        if (response.status === 200) {
            onLogin();
            navigate('/chat');
        }
    };
    
    return (
        <div className="login-container">
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                {isRegistering && (
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                )}
                
                <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
            </form>
            
            <button 
                className="toggle-mode"
                onClick={() => setIsRegistering(!isRegistering)}
            >
                {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </button>
        </div>
    );
};

export default Login;
