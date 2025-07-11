import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuizPage from './pages/QuizPage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoute';

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/quiz" element={
        <PrivateRoute>
          <QuizPage />
        </PrivateRoute>
      } />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/admin" element={
        <PrivateRoute adminOnly={true}>
          <AdminPanel />
        </PrivateRoute>
      } />
      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;