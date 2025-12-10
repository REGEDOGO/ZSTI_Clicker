import React from 'react';
import { GameProvider } from './context/GameContext';
import { Layout } from './components/layout/Layout';

const App: React.FC = () => {
  return (
    <GameProvider>
      <Layout />
    </GameProvider>
  );
};

export default App;
