import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { CATEGORY_COLORS, SCORING_CONFIG } from '../types/game';

export function PlayerGame() {
  const {
    currentQuestion,
    currentQuestionIndex,
    gameStatus,
    timeRemaining,
    submitAnswer,
    playerId,
    players
  } = useGame();

  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(undefined);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset when new question starts
  useEffect(() => {
    if (gameStatus === 'question') {
      setSelectedAnswer(undefined);
      setHasSubmitted(false);
    }
  }, [currentQuestionIndex, gameStatus]);

  if (!currentQuestion) return null;

  const categoryColor = CATEGORY_COLORS[currentQuestion.category];
  const currentPlayer = players.find(p => p.id === playerId);

  const handleAnswerClick = (index: number) => {
    if (hasSubmitted || gameStatus !== 'question') return;

    setSelectedAnswer(index);
    setHasSubmitted(true);
    submitAnswer(index);
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div style={{ ...styles.container, backgroundColor: categoryColor }}>
      {/* Header */}
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
      </div>

      {/* Category */}
      <div style={styles.category}>
        {currentQuestion.category.replace('_', ' & ')}
      </div>

      {/* Question */}
      <div style={styles.questionBox}>
        <p style={styles.question}>{currentQuestion.question}</p>
      </div>

      {/* Answer Options */}
      {gameStatus === 'question' && !hasSubmitted && (
        <div style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              style={styles.optionButton}
            >
              <div style={styles.optionLetter}>
                {String.fromCharCode(65 + index)}
              </div>
              <div style={styles.optionText}>{option}</div>
            </button>
          ))}
        </div>
      )}

      {/* Waiting for results */}
      {hasSubmitted && gameStatus === 'question' && (
        <div style={styles.lockedIn}>
          <div style={styles.checkmark}>✓</div>
          <p style={styles.lockedText}>Answer Locked In!</p>
          <p style={styles.selectedAnswer}>
            {String.fromCharCode(65 + (selectedAnswer || 0))}.{' '}
            {currentQuestion.options[selectedAnswer || 0]}
          </p>
        </div>
      )}

      {/* Results */}
      {gameStatus === 'reveal' && (
        <div style={styles.result}>
          <div
            style={{
              ...styles.resultIcon,
              backgroundColor: isCorrect ? '#10B981' : '#EF4444'
            }}
          >
            {isCorrect ? '✓' : '✗'}
          </div>
          <h2 style={styles.resultTitle}>
            {isCorrect ? 'Correct!' : 'Incorrect!'}
          </h2>
          <p style={styles.correctAnswer}>
            Correct Answer: {String.fromCharCode(65 + currentQuestion.correctAnswer)}.{' '}
            {currentQuestion.options[currentQuestion.correctAnswer]}
          </p>
          {currentPlayer && (
            <div style={styles.scoreUpdate}>
              <p style={styles.scoreLabel}>Your Score</p>
              <p style={styles.scoreValue}>{currentPlayer.score}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    transition: 'background-color 0.3s'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '1rem',
    borderRadius: '0.5rem'
  },
  questionNumber: {
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  timer: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  category: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '0.5rem'
  },
  questionBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    flex: '0 0 auto'
  },
  question: {
    fontSize: '1.5rem',
    textAlign: 'center',
    margin: 0,
    lineHeight: 1.4,
    fontWeight: 'bold'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    flex: 1
  },
  optionButton: {
    backgroundColor: 'white',
    color: '#0F172A',
    border: 'none',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: '80px',
    textAlign: 'left'
  },
  optionLetter: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    backgroundColor: '#0F172A',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    flexShrink: 0
  },
  optionText: {
    flex: 1
  },
  lockedIn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem'
  },
  checkmark: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    fontWeight: 'bold'
  },
  lockedText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0
  },
  selectedAnswer: {
    fontSize: '1.125rem',
    textAlign: 'center',
    margin: 0,
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem',
    maxWidth: '90%'
  },
  result: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem'
  },
  resultIcon: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
    fontWeight: 'bold'
  },
  resultTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0
  },
  correctAnswer: {
    fontSize: '1.125rem',
    textAlign: 'center',
    margin: 0,
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem',
    maxWidth: '90%'
  },
  scoreUpdate: {
    marginTop: '1rem',
    textAlign: 'center'
  },
  scoreLabel: {
    fontSize: '1rem',
    margin: '0 0 0.5rem 0',
    opacity: 0.9
  },
  scoreValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: 0
  }
};
