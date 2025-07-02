import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserFromToken } from './store/slices/authSlice';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import VoiceRecognizer from './components/VoiceRecognizer';
import UserSummaries from './components/UserSummaries';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                <Navigate to="/voice-recognizer" replace /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/voice-recognizer" replace /> : 
                <Login />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? 
                <Navigate to="/voice-recognizer" replace /> : 
                <Register />
              } 
            />
            <Route 
              path="/voice-recognizer" 
              element={
                <ProtectedRoute>
                  <VoiceRecognizer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/summaries" 
              element={
                <ProtectedRoute>
                  <UserSummaries />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
