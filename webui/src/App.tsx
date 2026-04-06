import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { ChatPage } from './pages/ChatPage';
import { useAuth } from './contexts/AuthContext';
import styled from 'styled-components';

const AppContainer = styled.div`
  color: var(--text-primary);
  background: var(--bg-primary);
  min-height: 100vh;
`;

export const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <AppContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Cargando...</p>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/chat" />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/auth" />} />
        <Route path="/chat/:chatId" element={user ? <ChatPage /> : <Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AppContainer>
  );
};
