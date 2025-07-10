import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { DashboardLayout } from './components/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { ChatUpload } from './pages/ChatUpload';
import { MediaLibrary } from './pages/MediaLibrary';
import { ConvertedDeals } from './pages/ConvertedDeals';
import { AISuggestions } from './pages/AISuggestions';
import { Settings } from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<ChatUpload />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="deals" element={<ConvertedDeals />} />
            <Route path="ai" element={<AISuggestions />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;