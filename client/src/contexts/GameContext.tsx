import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  GameState,
  Player,
  Question,
  GameEvent,
  QuestionResult,
  PlayerScore,
  SCORING_CONFIG,
  Category
} from '../types/game';
import { GameChannel } from '../utils/supabase';

interface GameContextType {
  // State
  gameCode: string | null;
  isHost: boolean;
  playerId: string | null;
  nickname: string | null;
  players: Player[];
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  gameStatus: GameState['gameStatus'];
  timeRemaining: number;

  // Host actions
  createGame: () => Promise<string>;
  startGame: (questions: Question[]) => void;
  nextQuestion: () => void;
  endGame: () => void;

  // Player actions
  joinGame: (code: string, nick: string) => Promise<boolean>;
  submitAnswer: (answerIndex: number) => void;

  // Shared
  leaveGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [gameStatus, setGameStatus] = useState<GameState['gameStatus']>('waiting');
  const [timeRemaining, setTimeRemaining] = useState(SCORING_CONFIG.QUESTION_TIME_LIMIT);
  const [gameChannel, setGameChannel] = useState<GameChannel | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);

  // Generate unique player ID
  const generatePlayerId = useCallback(() => {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Timer effect for questions
  useEffect(() => {
    if (gameStatus === 'question' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && gameStatus === 'question' && isHost) {
      // Auto-advance to reveal when time runs out (host only)
      revealAnswer();
    }
  }, [gameStatus, timeRemaining, isHost]);

  // Create game (host)
  const createGame = useCallback(async (): Promise<string> => {
    const hostId = generatePlayerId();
    setPlayerId(hostId);
    setIsHost(true);

    try {
      const response = await fetch('/.netlify/functions/create-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostId })
      });

      const data = await response.json();
      const code = data.gameCode;

      setGameCode(code);
      setGameStatus('waiting');

      // Set up real-time channel
      const channel = new GameChannel(code);
      channel.subscribe(
        handlePlayerJoined,
        handlePlayerLeft,
        handleGameStarted,
        handleQuestionStarted,
        handleAnswerSubmitted,
        handleQuestionEnded,
        handleGameEnded,
        handlePlayerReconnected
      );
      setGameChannel(channel);

      return code;
    } catch (error) {
      console.error('Failed to create game:', error);
      throw error;
    }
  }, [generatePlayerId]);

  // Join game (player)
  const joinGame = useCallback(async (code: string, nick: string): Promise<boolean> => {
    const pId = generatePlayerId();
    setPlayerId(pId);
    setNickname(nick);
    setIsHost(false);

    try {
      const response = await fetch('/.netlify/functions/join-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameCode: code, nickname: nick, playerId: pId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to join game');
      }

      const data = await response.json();
      setGameCode(code);
      setGameStatus(data.gameStatus);

      // Set up real-time channel
      const channel = new GameChannel(code);
      channel.subscribe(
        handlePlayerJoined,
        handlePlayerLeft,
        handleGameStarted,
        handleQuestionStarted,
        handleAnswerSubmitted,
        handleQuestionEnded,
        handleGameEnded,
        handlePlayerReconnected
      );
      setGameChannel(channel);

      // Broadcast join event
      await channel.broadcast('player_joined', {
        player: {
          id: pId,
          nickname: nick,
          score: 0,
          wedges: [],
          isConnected: true,
          joinedAt: Date.now()
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to join game:', error);
      return false;
    }
  }, [generatePlayerId]);

  // Start game (host)
  const startGame = useCallback((questions: Question[]) => {
    if (!isHost || !gameChannel) return;

    setAllQuestions(questions);
    setGameStatus('playing');
    gameChannel.broadcast('game_started', {});

    // Start first question after a short delay
    setTimeout(() => nextQuestion(), 2000);
  }, [isHost, gameChannel]);

  // Next question (host)
  const nextQuestion = useCallback(() => {
    if (!isHost || !gameChannel) return;

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= allQuestions.length) {
      endGame();
      return;
    }

    const question = allQuestions[nextIndex];
    setCurrentQuestion(question);
    setCurrentQuestionIndex(nextIndex);
    setGameStatus('question');
    setTimeRemaining(SCORING_CONFIG.QUESTION_TIME_LIMIT);

    // Clear previous answers
    setPlayers(prev => prev.map(p => ({ ...p, currentAnswer: undefined })));

    gameChannel.broadcast('question_started', { question, index: nextIndex });
  }, [isHost, gameChannel, currentQuestionIndex, allQuestions]);

  // Reveal answer and calculate scores (host)
  const revealAnswer = useCallback(() => {
    if (!isHost || !gameChannel || !currentQuestion) return;

    const results: QuestionResult[] = [];
    const updatedPlayers = players.map(player => {
      if (player.currentAnswer === undefined) {
        results.push({
          playerId: player.id,
          correct: false,
          pointsEarned: 0,
          answerIndex: -1
        });
        return player;
      }

      const correct = player.currentAnswer === currentQuestion.correctAnswer;
      let pointsEarned = 0;

      if (correct) {
        pointsEarned = SCORING_CONFIG.CORRECT_ANSWER;

        // Time bonus
        if (SCORING_CONFIG.TIME_BONUS_ENABLED) {
          const timeBonus = Math.floor(
            (timeRemaining / SCORING_CONFIG.QUESTION_TIME_LIMIT) * SCORING_CONFIG.TIME_BONUS_MAX
          );
          pointsEarned += timeBonus;
        }

        // Add wedge for category
        const wedges = new Set(player.wedges);
        wedges.add(currentQuestion.category);

        results.push({
          playerId: player.id,
          correct: true,
          pointsEarned,
          answerIndex: player.currentAnswer
        });

        return {
          ...player,
          score: player.score + pointsEarned,
          wedges
        };
      } else {
        results.push({
          playerId: player.id,
          correct: false,
          pointsEarned: 0,
          answerIndex: player.currentAnswer
        });
        return player;
      }
    });

    setPlayers(updatedPlayers);
    setGameStatus('reveal');
    gameChannel.broadcast('question_ended', { results });
  }, [isHost, gameChannel, currentQuestion, players, timeRemaining]);

  // End game (host)
  const endGame = useCallback(() => {
    if (!isHost || !gameChannel) return;

    const finalScores: PlayerScore[] = players
      .map(player => ({
        playerId: player.id,
        nickname: player.nickname,
        score: player.score,
        wedges: Array.from(player.wedges),
        rank: 0
      }))
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({ ...player, rank: index + 1 }));

    setGameStatus('finished');
    gameChannel.broadcast('game_ended', { finalScores });
  }, [isHost, gameChannel, players]);

  // Submit answer (player)
  const submitAnswer = useCallback((answerIndex: number) => {
    if (isHost || !gameChannel || !playerId) return;

    // Update local state
    setPlayers(prev =>
      prev.map(p => (p.id === playerId ? { ...p, currentAnswer: answerIndex } : p))
    );

    gameChannel.broadcast('answer_submitted', { playerId });
  }, [isHost, gameChannel, playerId]);

  // Leave game
  const leaveGame = useCallback(() => {
    if (gameChannel) {
      if (playerId) {
        gameChannel.broadcast('player_left', { playerId });
      }
      gameChannel.unsubscribe();
    }

    setGameCode(null);
    setIsHost(false);
    setPlayerId(null);
    setNickname(null);
    setPlayers([]);
    setCurrentQuestion(null);
    setCurrentQuestionIndex(-1);
    setGameStatus('waiting');
    setGameChannel(null);
  }, [gameChannel, playerId]);

  // Event handlers
  const handlePlayerJoined = useCallback((player: Player) => {
    setPlayers(prev => {
      const exists = prev.find(p => p.id === player.id);
      if (exists) return prev;
      return [...prev, player];
    });
  }, []);

  const handlePlayerLeft = useCallback((playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  }, []);

  const handleGameStarted = useCallback(() => {
    setGameStatus('playing');
  }, []);

  const handleQuestionStarted = useCallback((question: Question, index: number) => {
    setCurrentQuestion(question);
    setCurrentQuestionIndex(index);
    setGameStatus('question');
    setTimeRemaining(SCORING_CONFIG.QUESTION_TIME_LIMIT);
    setPlayers(prev => prev.map(p => ({ ...p, currentAnswer: undefined })));
  }, []);

  const handleAnswerSubmitted = useCallback((playerId: string) => {
    // Just visual feedback - actual answer stored locally
  }, []);

  const handleQuestionEnded = useCallback((results: QuestionResult[]) => {
    setGameStatus('reveal');

    // Update player scores based on results
    setPlayers(prev =>
      prev.map(player => {
        const result = results.find(r => r.playerId === player.id);
        if (!result) return player;

        if (result.correct && currentQuestion) {
          const wedges = new Set(player.wedges);
          wedges.add(currentQuestion.category);
          return {
            ...player,
            score: player.score + result.pointsEarned,
            wedges
          };
        }
        return player;
      })
    );
  }, [currentQuestion]);

  const handleGameEnded = useCallback((finalScores: PlayerScore[]) => {
    setGameStatus('finished');
  }, []);

  const handlePlayerReconnected = useCallback((playerId: string) => {
    setPlayers(prev =>
      prev.map(p => (p.id === playerId ? { ...p, isConnected: true } : p))
    );
  }, []);

  const value: GameContextType = {
    gameCode,
    isHost,
    playerId,
    nickname,
    players,
    currentQuestion,
    currentQuestionIndex,
    gameStatus,
    timeRemaining,
    createGame,
    startGame,
    nextQuestion,
    endGame,
    joinGame,
    submitAnswer,
    leaveGame
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
