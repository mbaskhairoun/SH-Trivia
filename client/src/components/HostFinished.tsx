import React from 'react';
import { useGame } from '../contexts/GameContext';
import { CATEGORY_COLORS } from '../types/game';

export function HostFinished() {
  const { players, leaveGame } = useGame();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const topThree = sortedPlayers.slice(0, 3);

  const handlePlayAgain = () => {
    leaveGame();
    window.location.reload();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Game Over!</h1>

      {/* Podium */}
      <div style={styles.podium}>
        {topThree.map((player, index) => {
          const medals = ['🥇', '🥈', '🥉'];
          const heights = ['180px', '140px', '100px'];
          const colors = ['#F59E0B', '#94A3B8', '#CD7F32'];

          return (
            <div key={player.id} style={styles.podiumColumn}>
              <div style={styles.playerInfo}>
                <div
                  style={{
                    ...styles.playerAvatar,
                    backgroundColor: colors[index]
                  }}
                >
                  {player.nickname.charAt(0).toUpperCase()}
                </div>
                <div style={styles.playerNickname}>{player.nickname}</div>
                <div style={styles.playerScore}>{player.score} pts</div>
                <div style={styles.wedgesContainer}>
                  {Array.from(player.wedges).map(category => (
                    <div
                      key={category}
                      style={{
                        ...styles.wedge,
                        backgroundColor: CATEGORY_COLORS[category]
                      }}
                      title={category.replace('_', ' & ')}
                    />
                  ))}
                </div>
              </div>
              <div
                style={{
                  ...styles.podiumBlock,
                  height: heights[index],
                  backgroundColor: colors[index]
                }}
              >
                <div style={styles.medal}>{medals[index]}</div>
                <div style={styles.rank}>#{index + 1}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full leaderboard */}
      {sortedPlayers.length > 3 && (
        <div style={styles.fullLeaderboard}>
          <h2 style={styles.leaderboardTitle}>Final Standings</h2>
          <div style={styles.leaderboardList}>
            {sortedPlayers.map((player, index) => (
              <div key={player.id} style={styles.leaderboardItem}>
                <span style={styles.position}>#{index + 1}</span>
                <div
                  style={{
                    ...styles.avatar,
                    backgroundColor: index < 3 ? '#667eea' : '#475569'
                  }}
                >
                  {player.nickname.charAt(0).toUpperCase()}
                </div>
                <span style={styles.name}>{player.nickname}</span>
                <div style={styles.playerWedges}>
                  {Array.from(player.wedges).map(category => (
                    <div
                      key={category}
                      style={{
                        ...styles.smallWedge,
                        backgroundColor: CATEGORY_COLORS[category]
                      }}
                    />
                  ))}
                </div>
                <span style={styles.points}>{player.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={styles.actions}>
        <button onClick={handlePlayAgain} style={styles.playAgainButton}>
          Play Again
        </button>
        <button onClick={leaveGame} style={styles.homeButton}>
          Return Home
        </button>
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
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '3rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  podium: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '1rem',
    marginBottom: '3rem'
  },
  podiumColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  playerInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  playerAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    border: '4px solid white'
  },
  playerNickname: {
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },
  playerScore: {
    fontSize: '1rem',
    color: '#94A3B8'
  },
  wedgesContainer: {
    display: 'flex',
    gap: '0.25rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  wedge: {
    width: '20px',
    height: '20px',
    borderRadius: '3px'
  },
  podiumBlock: {
    width: '150px',
    borderRadius: '0.5rem 0.5rem 0 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '1rem',
    gap: '0.5rem'
  },
  medal: {
    fontSize: '2.5rem'
  },
  rank: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white'
  },
  fullLeaderboard: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#1E293B',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '2rem'
  },
  leaderboardTitle: {
    fontSize: '1.5rem',
    textAlign: 'center',
    marginBottom: '1rem'
  },
  leaderboardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  leaderboardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem',
    backgroundColor: '#0F172A',
    borderRadius: '0.5rem'
  },
  position: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#94A3B8',
    minWidth: '40px'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.125rem',
    fontWeight: 'bold'
  },
  name: {
    fontSize: '1.125rem',
    flex: 1
  },
  playerWedges: {
    display: 'flex',
    gap: '0.25rem'
  },
  smallWedge: {
    width: '16px',
    height: '16px',
    borderRadius: '2px'
  },
  points: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#60A5FA',
    minWidth: '60px',
    textAlign: 'right'
  },
  actions: {
    display: 'flex',
    gap: '1rem'
  },
  playAgainButton: {
    backgroundColor: '#10B981',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '1rem 2rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  homeButton: {
    backgroundColor: '#475569',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '1rem 2rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
