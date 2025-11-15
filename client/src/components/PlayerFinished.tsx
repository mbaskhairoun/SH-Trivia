import React from 'react';
import { useGame } from '../contexts/GameContext';
import { CATEGORY_COLORS } from '../types/game';

export function PlayerFinished() {
  const { players, playerId, leaveGame } = useGame();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const currentPlayer = sortedPlayers.find(p => p.id === playerId);
  const rank = sortedPlayers.findIndex(p => p.id === playerId) + 1;

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🎯';
  };

  const getRankMessage = (rank: number, total: number) => {
    if (rank === 1) return 'Winner!';
    if (rank <= 3) return 'Great job!';
    if (rank <= total / 2) return 'Well played!';
    return 'Thanks for playing!';
  };

  if (!currentPlayer) return null;

  return (
    <div style={styles.container}>
      {/* Rank display */}
      <div style={styles.rankDisplay}>
        <div style={styles.rankEmoji}>{getRankEmoji(rank)}</div>
        <h1 style={styles.rankTitle}>{getRankMessage(rank, players.length)}</h1>
        <p style={styles.rankText}>
          You placed #{rank} out of {players.length} players
        </p>
      </div>

      {/* Player stats */}
      <div style={styles.statsCard}>
        <div style={styles.scoreSection}>
          <p style={styles.scoreLabel}>Final Score</p>
          <p style={styles.scoreValue}>{currentPlayer.score}</p>
        </div>

        <div style={styles.wedgesSection}>
          <p style={styles.wedgesLabel}>Categories Completed</p>
          <div style={styles.wedgesGrid}>
            {Object.entries(CATEGORY_COLORS).map(([category, color]) => {
              const completed = currentPlayer.wedges.has(category as any);
              return (
                <div
                  key={category}
                  style={{
                    ...styles.wedgeItem,
                    opacity: completed ? 1 : 0.3
                  }}
                >
                  <div
                    style={{
                      ...styles.wedgeColor,
                      backgroundColor: color
                    }}
                  />
                  <span style={styles.wedgeText}>
                    {category.replace('_', ' & ')}
                  </span>
                  {completed && <span style={styles.checkmark}>✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div style={styles.leaderboardCard}>
        <h2 style={styles.leaderboardTitle}>Final Standings</h2>
        <div style={styles.leaderboardList}>
          {sortedPlayers.slice(0, 10).map((player, index) => {
            const isCurrentPlayer = player.id === playerId;
            return (
              <div
                key={player.id}
                style={{
                  ...styles.leaderboardItem,
                  backgroundColor: isCurrentPlayer ? '#667eea' : '#1E293B'
                }}
              >
                <span style={styles.position}>
                  {index < 3 ? getRankEmoji(index + 1) : `#${index + 1}`}
                </span>
                <span style={styles.playerName}>{player.nickname}</span>
                <span style={styles.playerScore}>{player.score}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action button */}
      <button onClick={leaveGame} style={styles.homeButton}>
        Return Home
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0F172A',
    color: 'white',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    alignItems: 'center'
  },
  rankDisplay: {
    textAlign: 'center',
    padding: '2rem 1rem'
  },
  rankEmoji: {
    fontSize: '5rem',
    marginBottom: '1rem'
  },
  rankTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  rankText: {
    fontSize: '1.125rem',
    color: '#94A3B8',
    margin: 0
  },
  statsCard: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#1E293B',
    borderRadius: '1rem',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  scoreSection: {
    textAlign: 'center',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #334155'
  },
  scoreLabel: {
    fontSize: '1rem',
    color: '#94A3B8',
    margin: '0 0 0.5rem 0'
  },
  scoreValue: {
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#60A5FA'
  },
  wedgesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  wedgesLabel: {
    fontSize: '1rem',
    fontWeight: 'bold',
    margin: 0
  },
  wedgesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  wedgeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem',
    backgroundColor: '#0F172A',
    borderRadius: '0.5rem',
    transition: 'opacity 0.2s'
  },
  wedgeColor: {
    width: '28px',
    height: '28px',
    borderRadius: '4px',
    flexShrink: 0
  },
  wedgeText: {
    fontSize: '0.875rem',
    flex: 1,
    textTransform: 'capitalize'
  },
  checkmark: {
    fontSize: '1.25rem',
    color: '#10B981'
  },
  leaderboardCard: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#1E293B',
    borderRadius: '1rem',
    padding: '1.5rem'
  },
  leaderboardTitle: {
    fontSize: '1.25rem',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: '1rem'
  },
  leaderboardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  leaderboardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s'
  },
  position: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    minWidth: '45px'
  },
  playerName: {
    fontSize: '1rem',
    flex: 1
  },
  playerScore: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#60A5FA'
  },
  homeButton: {
    backgroundColor: '#475569',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '1rem 2rem',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '300px'
  }
};
