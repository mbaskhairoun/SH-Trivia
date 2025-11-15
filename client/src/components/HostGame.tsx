import React from 'react';
import { useGame } from '../contexts/GameContext';
import { CATEGORY_COLORS, SCORING_CONFIG } from '../types/game';

export function HostGame() {
  const {
    currentQuestion,
    currentQuestionIndex,
    players,
    gameStatus,
    timeRemaining,
    nextQuestion
  } = useGame();

  if (!currentQuestion) return null;

  const categoryColor = CATEGORY_COLORS[currentQuestion.category];
  const answeredCount = players.filter(p => p.currentAnswer !== undefined).length;

  return (
    <div style={styles.container}>
      {/* Header with question number and timer */}
      <div style={styles.header}>
        <div style={styles.questionNumber}>
          Question {currentQuestionIndex + 1} of {SCORING_CONFIG.GAME_LENGTH}
        </div>
        <div
          style={{
            ...styles.timer,
            color: timeRemaining <= 5 ? '#EF4444' : 'white'
          }}
        >
          {timeRemaining}s
        </div>
        <div style={styles.answerCount}>
          {answeredCount} / {players.length} answered
        </div>
      </div>

      {/* Category banner */}
      <div
        style={{
          ...styles.categoryBanner,
          backgroundColor: categoryColor
        }}
      >
        {currentQuestion.category.replace('_', ' & ')}
      </div>

      {/* Question */}
      <div style={styles.questionContainer}>
        <h1 style={styles.question}>{currentQuestion.question}</h1>
      </div>

      {/* Answer options */}
      <div style={styles.optionsGrid}>
        {currentQuestion.options.map((option, index) => {
          const isCorrect = index === currentQuestion.correctAnswer;
          const showResult = gameStatus === 'reveal';

          return (
            <div
              key={index}
              style={{
                ...styles.option,
                backgroundColor: showResult
                  ? isCorrect
                    ? '#10B981'
                    : '#334155'
                  : '#1E293B',
                border: showResult && isCorrect ? '3px solid #34D399' : 'none'
              }}
            >
              <div style={styles.optionLetter}>
                {String.fromCharCode(65 + index)}
              </div>
              <div style={styles.optionText}>{option}</div>
            </div>
          );
        })}
      </div>

      {/* Scoreboard */}
      <div style={styles.scoreboard}>
        <h3 style={styles.scoreboardTitle}>Leaderboard</h3>
        <div style={styles.scoreboardList}>
          {[...players]
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((player, index) => (
              <div key={player.id} style={styles.scoreItem}>
                <span style={styles.rank}>#{index + 1}</span>
                <span style={styles.playerNameScore}>{player.nickname}</span>
                <span style={styles.score}>{player.score}</span>
                <div style={styles.wedges}>
                  {Array.from(player.wedges).map(category => (
                    <div
                      key={category}
                      style={{
                        ...styles.wedge,
                        backgroundColor: CATEGORY_COLORS[category]
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Next button (only show during reveal) */}
      {gameStatus === 'reveal' && (
        <button onClick={nextQuestion} style={styles.nextButton}>
          Next Question
        </button>
      )}
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
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#1E293B',
    borderRadius: '0.5rem'
  },
  questionNumber: {
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },
  timer: {
    fontSize: '2rem',
    fontWeight: 'bold',
    minWidth: '80px',
    textAlign: 'center'
  },
  answerCount: {
    fontSize: '1.25rem',
    color: '#94A3B8'
  },
  categoryBanner: {
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
    letterSpacing: '0.1em'
  },
  questionContainer: {
    backgroundColor: '#1E293B',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '1.5rem',
    flex: '0 0 auto'
  },
  question: {
    fontSize: '2rem',
    textAlign: 'center',
    margin: 0,
    lineHeight: 1.4
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  option: {
    padding: '1.5rem',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    minHeight: '100px',
    transition: 'all 0.3s'
  },
  optionLetter: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#0F172A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    flexShrink: 0
  },
  optionText: {
    fontSize: '1.25rem',
    flex: 1
  },
  scoreboard: {
    backgroundColor: '#1E293B',
    borderRadius: '0.75rem',
    padding: '1rem',
    marginTop: 'auto'
  },
  scoreboardTitle: {
    fontSize: '1.25rem',
    marginBottom: '0.75rem',
    textAlign: 'center'
  },
  scoreboardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  scoreItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.5rem',
    backgroundColor: '#0F172A',
    borderRadius: '0.375rem'
  },
  rank: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#94A3B8',
    minWidth: '35px'
  },
  playerNameScore: {
    fontSize: '1rem',
    flex: 1
  },
  score: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#60A5FA'
  },
  wedges: {
    display: 'flex',
    gap: '0.25rem'
  },
  wedge: {
    width: '16px',
    height: '16px',
    borderRadius: '2px'
  },
  nextButton: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '1rem 2rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
    alignSelf: 'center'
  }
};
