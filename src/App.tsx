import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { Layout } from './components/layout/Layout';
import { MusicNotification } from './components/ui/MusicNotification';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GameProvider>
        <MusicNotification />
        <Layout />
      </GameProvider>
    </AuthProvider>
  );
};

export default App;
