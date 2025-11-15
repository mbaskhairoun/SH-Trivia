import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';

export function PlayerJoin() {
  const [gameCode, setGameCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { joinGame } = useGame();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!gameCode.trim() || !nickname.trim()) {
      setError('Please enter both game code and nickname');
      return;
    }

    if (nickname.length > 20) {
      setError('Nickname must be 20 characters or less');
      return;
    }

    setIsJoining(true);

    try {
      const success = await joinGame(gameCode.toUpperCase().trim(), nickname.trim());
      if (!success) {
        setError('Failed to join game. Please check the code and try again.');
        setIsJoining(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to join game');
      setIsJoining(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>S&H Trivia</h1>
        <p style={styles.subtitle}>Join a Game</p>

        <form onSubmit={handleJoin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Game Code</label>
            <input
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              placeholder="XXXX"
              maxLength={4}
              style={styles.input}
              autoCapitalize="characters"
              disabled={isJoining}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Your Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              style={styles.input}
              disabled={isJoining}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={isJoining}
            style={{
              ...styles.button,
              opacity: isJoining ? 0.5 : 1,
              cursor: isJoining ? 'not-allowed' : 'pointer'
            }}
          >
            {isJoining ? 'Joining...' : 'Join Game'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0F172A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: '1rem',
    padding: '2rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'white'
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: '0.5rem',
    marginBottom: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  input: {
    padding: '0.75rem',
    fontSize: '1.125rem',
    borderRadius: '0.5rem',
    border: '2px solid #334155',
    backgroundColor: '#0F172A',
    color: 'white',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  error: {
    padding: '0.75rem',
    backgroundColor: '#7F1D1D',
    color: '#FCA5A5',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    textAlign: 'center'
  },
  button: {
    padding: '1rem',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: '#667eea',
    color: 'white',
    transition: 'all 0.2s'
  }
};
