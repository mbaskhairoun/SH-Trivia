import React from 'react';
import { useGame } from '../contexts/GameContext';
import { CATEGORY_COLORS } from '../types/game';
import triviaQuestions from '../../../questions/trivia-questions.json';

export function HostLobby() {
  const { gameCode, players, startGame } = useGame();

  const handleStartGame = () => {
    // Shuffle and select questions
    const shuffled = [...triviaQuestions].sort(() => Math.random() - 0.5);
    startGame(shuffled.slice(0, 12)); // Use 12 questions
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>S&H Trivia</h1>
        <p style={styles.subtitle}>Waiting for players to join...</p>
      </div>

      <div style={styles.codeDisplay}>
        <div style={styles.codeLabel}>Join at:</div>
        <div style={styles.url}>{window.location.origin}</div>
        <div style={styles.codeLabel}>Game Code:</div>
        <div style={styles.code}>{gameCode}</div>
      </div>

      <div style={styles.playersSection}>
        <h2 style={styles.playersTitle}>
          Players ({players.length})
        </h2>
        <div style={styles.playersList}>
          {players.length === 0 ? (
            <div style={styles.emptyState}>
              Waiting for players to join...
            </div>
          ) : (
            players.map((player) => (
              <div key={player.id} style={styles.playerCard}>
                <div style={styles.playerAvatar}>
                  {player.nickname.charAt(0).toUpperCase()}
                </div>
                <div style={styles.playerName}>{player.nickname}</div>
                <div
                  style={{
                    ...styles.playerStatus,
                    backgroundColor: player.isConnected ? '#10B981' : '#EF4444'
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={handleStartGame}
        disabled={players.length === 0}
        style={{
          ...styles.startButton,
          opacity: players.length === 0 ? 0.5 : 1,
          cursor: players.length === 0 ? 'not-allowed' : 'pointer'
        }}
      >
        Start Game
      </button>

      <div style={styles.categoryLegend}>
        <h3 style={styles.legendTitle}>Categories</h3>
        <div style={styles.legendGrid}>
          {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
            <div key={category} style={styles.legendItem}>
              <div style={{ ...styles.legendColor, backgroundColor: color }} />
              <span style={styles.legendText}>
                {category.replace('_', ' & ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0F172A',
    color: 'white',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    margin: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#94A3B8',
    margin: '0.5rem 0 0 0'
  },
  codeDisplay: {
    backgroundColor: '#1E293B',
    borderRadius: '1rem',
    padding: '2rem',
    textAlign: 'center',
    marginBottom: '2rem',
    border: '2px solid #334155'
  },
  codeLabel: {
    fontSize: '1rem',
    color: '#94A3B8',
    marginBottom: '0.5rem'
  },
  url: {
    fontSize: '1.5rem',
    color: '#60A5FA',
    marginBottom: '1.5rem'
  },
  code: {
    fontSize: '4rem',
    fontWeight: 'bold',
    letterSpacing: '0.5rem',
    color: '#F472B6'
  },
  playersSection: {
    width: '100%',
    maxWidth: '800px',
    marginBottom: '2rem'
  },
  playersTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  playersList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '1rem'
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '3rem',
    color: '#64748B',
    fontSize: '1.125rem'
  },
  playerCard: {
    backgroundColor: '#1E293B',
    borderRadius: '0.5rem',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    position: 'relative'
  },
  playerAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  playerName: {
    fontSize: '1rem',
    textAlign: 'center',
    wordBreak: 'break-word'
  },
  playerStatus: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    width: '12px',
    height: '12px',
    borderRadius: '50%'
  },
  startButton: {
    backgroundColor: '#10B981',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '1rem 3rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    transition: 'all 0.2s'
  },
  categoryLegend: {
    backgroundColor: '#1E293B',
    borderRadius: '1rem',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '600px'
  },
  legendTitle: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  legendGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  legendColor: {
    width: '24px',
    height: '24px',
    borderRadius: '4px'
  },
  legendText: {
    fontSize: '0.875rem',
    textTransform: 'capitalize'
  }
};
