import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ChatInterface from './components/ChatInterface';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            isLoggedIn ? 
                            <Navigate to="/chat" /> : 
                            <Login onLogin={() => setIsLoggedIn(true)} />
                        } 
                    />
                    <Route 
                        path="/chat" 
                        element={
                            isLoggedIn ? 
                            <ChatInterface /> : 
                            <Navigate to="/" />
                        } 
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
