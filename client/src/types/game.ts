// Category colors matching Trivial Pursuit style
export enum Category {
  GEOGRAPHY = 'GEOGRAPHY',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HISTORY = 'HISTORY',
  ARTS_LITERATURE = 'ARTS_LITERATURE',
  SCIENCE_NATURE = 'SCIENCE_NATURE',
  SPORTS_LEISURE = 'SPORTS_LEISURE'
}

// Color scheme for each category (easy to customize)
export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.GEOGRAPHY]: '#3B82F6',        // Blue
  [Category.ENTERTAINMENT]: '#EC4899',   // Pink
  [Category.HISTORY]: '#F59E0B',         // Yellow/Orange
  [Category.ARTS_LITERATURE]: '#8B5CF6', // Purple
  [Category.SCIENCE_NATURE]: '#10B981',  // Green
  [Category.SPORTS_LEISURE]: '#EF4444'   // Red
};

export interface Question {
  id: string;
  category: Category;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Player {
  id: string;
  nickname: string;
  score: number;
  wedges: Set<Category>; // Categories completed
  currentAnswer?: number;
  isConnected: boolean;
  joinedAt: number;
}

export interface GameState {
  gameCode: string;
  hostId: string;
  players: Map<string, Player>;
  currentQuestionIndex: number;
  questions: Question[];
  gameStatus: 'waiting' | 'playing' | 'question' | 'reveal' | 'finished';
  questionStartTime?: number;
  createdAt: number;
}

// Scoring configuration (easy to modify)
export const SCORING_CONFIG = {
  CORRECT_ANSWER: 100,        // Base points for correct answer
  TIME_BONUS_ENABLED: true,   // Enable time-based bonus
  TIME_BONUS_MAX: 50,         // Max bonus points for fast answers
  QUESTION_TIME_LIMIT: 20,    // Seconds per question
  GAME_LENGTH: 12             // Total questions per game
};

// Player answer submission
export interface AnswerSubmission {
  playerId: string;
  questionId: string;
  answerIndex: number;
  timestamp: number;
}

// Real-time event types
export type GameEvent =
  | { type: 'player_joined'; player: Player }
  | { type: 'player_left'; playerId: string }
  | { type: 'game_started' }
  | { type: 'question_started'; question: Question; index: number }
  | { type: 'answer_submitted'; playerId: string }
  | { type: 'question_ended'; results: QuestionResult[] }
  | { type: 'game_ended'; finalScores: PlayerScore[] }
  | { type: 'player_reconnected'; playerId: string };

export interface QuestionResult {
  playerId: string;
  correct: boolean;
  pointsEarned: number;
  answerIndex: number;
}

export interface PlayerScore {
  playerId: string;
  nickname: string;
  score: number;
  wedges: Category[];
  rank: number;
}
