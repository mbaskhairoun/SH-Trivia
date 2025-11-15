import React from 'react';
import { useGame } from '../contexts/GameContext';

export function PlayerWaiting() {
  const { gameCode, nickname, players } = useGame();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Waiting for Game to Start</h1>

        <div style={styles.infoCard}>
          <div style={styles.infoRow}>
            <span style={styles.label}>Game Code:</span>
            <span style={styles.value}>{gameCode}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Your Name:</span>
            <span style={styles.value}>{nickname}</span>
          </div>
        </div>

        <div style={styles.playersSection}>
          <h2 style={styles.playersTitle}>
            Players in Lobby ({players.length})
          </h2>
          <div style={styles.playersList}>
            {players.map((player) => (
              <div
                key={player.id}
                style={{
                  ...styles.playerChip,
                  border: player.nickname === nickname ? '2px solid #667eea' : 'none'
                }}
              >
                <div style={styles.playerAvatar}>
                  {player.nickname.charAt(0).toUpperCase()}
                </div>
                <span style={styles.playerName}>{player.nickname}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.waitingIndicator}>
          <div style={styles.spinner} />
          <p style={styles.waitingText}>Waiting for host to start the game...</p>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },
  content: {
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontSize: '1rem',
    color: '#94A3B8'
  },
  value: {
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },
  playersSection: {
    backgroundColor: '#1E293B',
    borderRadius: '0.75rem',
    padding: '1.5rem'
  },
  playersTitle: {
    fontSize: '1.25rem',
    marginTop: 0,
    marginBottom: '1rem',
    textAlign: 'center'
  },
  playersList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    justifyContent: 'center'
  },
  playerChip: {
    backgroundColor: '#0F172A',
    borderRadius: '2rem',
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  playerAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  playerName: {
    fontSize: '1rem'
  },
  waitingIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #334155',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  waitingText: {
    fontSize: '1rem',
    color: '#94A3B8',
    textAlign: 'center',
    margin: 0
  }
};

// Add keyframe animation via style tag
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
