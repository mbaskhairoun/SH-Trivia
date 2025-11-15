import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { isSupabaseConfigured } from '../utils/supabase';

export function Home() {
  const [isCreating, setIsCreating] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const { createGame } = useGame();

  const handleHostGame = async () => {
    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured. Please check your environment variables.');
      return;
    }

    setIsCreating(true);
    try {
      await createGame();
    } catch (error) {
      console.error('Failed to create game:', error);
      alert('Failed to create game. Please try again.');
      setIsCreating(false);
    }
  };

  const handleJoinGame = () => {
    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured. Please check your environment variables.');
      return;
    }
    setShowJoin(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Title */}
        <h1 style={styles.title}>S&H Trivia</h1>
        <p style={styles.subtitle}>
          Test your knowledge in this exciting multiplayer trivia game!
        </p>

        {/* Feature highlights */}
        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🎯</div>
            <div style={styles.featureText}>6 Categories</div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>👥</div>
            <div style={styles.featureText}>Multiplayer</div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>⚡</div>
            <div style={styles.featureText}>Real-time</div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={styles.actions}>
          <button
            onClick={handleHostGame}
            disabled={isCreating}
            style={{
              ...styles.button,
              ...styles.hostButton,
              opacity: isCreating ? 0.5 : 1,
              cursor: isCreating ? 'not-allowed' : 'pointer'
            }}
          >
            {isCreating ? 'Creating...' : 'Host a Game'}
          </button>

          <button
            onClick={handleJoinGame}
            style={{
              ...styles.button,
              ...styles.joinButton
            }}
          >
            Join a Game
          </button>
        </div>

        {/* Instructions */}
        <div style={styles.instructions}>
          <h2 style={styles.instructionsTitle}>How to Play</h2>
          <ol style={styles.instructionsList}>
            <li>Host creates a game and shares the code</li>
            <li>Players join using their phones</li>
            <li>Answer questions across 6 categories</li>
            <li>Earn points for correct answers</li>
            <li>Compete for the top spot!</li>
          </ol>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Perfect for parties, classrooms, or team building events!
          </p>
        </div>
      </div>

      {/* Join modal */}
      {showJoin && (
        <div style={styles.modal} onClick={() => setShowJoin(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Join a Game</h2>
            <p style={styles.modalText}>
              This feature is handled on a separate screen.
              Click "Join a Game" to proceed.
            </p>
            <button
              onClick={() => setShowJoin(false)}
              style={styles.modalButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
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
    padding: '2rem'
  },
  content: {
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem'
  },
  title: {
    fontSize: '4rem',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    fontSize: '1.25rem',
    textAlign: 'center',
    color: '#94A3B8',
    margin: 0
  },
  features: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  feature: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  featureIcon: {
    fontSize: '2.5rem'
  },
  featureText: {
    fontSize: '1rem',
    color: '#94A3B8'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    maxWidth: '400px'
  },
  button: {
    padding: '1.25rem 2rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%'
  },
  hostButton: {
    backgroundColor: '#10B981',
    color: 'white'
  },
  joinButton: {
    backgroundColor: '#667eea',
    color: 'white'
  },
  instructions: {
    backgroundColor: '#1E293B',
    borderRadius: '1rem',
    padding: '2rem',
    width: '100%'
  },
  instructionsTitle: {
    fontSize: '1.5rem',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: '1rem'
  },
  instructionsList: {
    fontSize: '1.125rem',
    lineHeight: 1.8,
    color: '#94A3B8',
    paddingLeft: '1.5rem',
    margin: 0
  },
  footer: {
    textAlign: 'center'
  },
  footerText: {
    fontSize: '1rem',
    color: '#64748B',
    margin: 0,
    fontStyle: 'italic'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '400px',
    width: '100%'
  },
  modalTitle: {
    fontSize: '1.5rem',
    marginTop: 0,
    marginBottom: '1rem'
  },
  modalText: {
    fontSize: '1rem',
    color: '#94A3B8',
    marginBottom: '1.5rem'
  },
  modalButton: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%'
  }
};
