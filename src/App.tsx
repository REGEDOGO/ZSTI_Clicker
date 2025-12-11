import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { Layout } from './components/layout/Layout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GameProvider>
        <Layout />
      </GameProvider>
    </AuthProvider>
  );
};

export default App;
