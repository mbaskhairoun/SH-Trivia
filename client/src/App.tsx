import React, { useState } from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import { Home } from './components/Home';
import { HostLobby } from './components/HostLobby';
import { HostGame } from './components/HostGame';
import { HostFinished } from './components/HostFinished';
import { PlayerJoin } from './components/PlayerJoin';
import { PlayerWaiting } from './components/PlayerWaiting';
import { PlayerGame } from './components/PlayerGame';
import { PlayerFinished } from './components/PlayerFinished';

function GameRouter() {
  const { gameCode, isHost, gameStatus } = useGame();
  const [viewMode, setViewMode] = useState<'home' | 'join'>('home');

  // No game active - show home or join screen
  if (!gameCode) {
    if (viewMode === 'join') {
      return <PlayerJoin />;
    }
    return (
      <div>
        <Home />
        {/* Simple navigation for joining */}
        <div style={styles.nav}>
          <button
            onClick={() => setViewMode('join')}
            style={styles.navButton}
          >
            Switch to Join Game
          </button>
        </div>
      </div>
    );
  }

  // Host screens
  if (isHost) {
    if (gameStatus === 'waiting') {
      return <HostLobby />;
    }
    if (gameStatus === 'question' || gameStatus === 'reveal' || gameStatus === 'playing') {
      return <HostGame />;
    }
    if (gameStatus === 'finished') {
      return <HostFinished />;
    }
  }

  // Player screens
  if (!isHost) {
    if (gameStatus === 'waiting') {
      return <PlayerWaiting />;
    }
    if (gameStatus === 'question' || gameStatus === 'reveal' || gameStatus === 'playing') {
      return <PlayerGame />;
    }
    if (gameStatus === 'finished') {
      return <PlayerFinished />;
    }
  }

  return <Home />;
}

function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100
  },
  navButton: {
    backgroundColor: '#334155',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    opacity: 0.7,
    transition: 'opacity 0.2s'
  }
};

export default App;
