import { Handler } from '@netlify/functions';

// Simple in-memory store for games (in production, use a database)
const games = new Map<string, any>();

// Generate random 4-character game code
function generateGameCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar-looking chars
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { hostId } = JSON.parse(event.body || '{}');

    if (!hostId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'hostId is required' })
      };
    }

    // Generate unique game code
    let gameCode = generateGameCode();
    while (games.has(gameCode)) {
      gameCode = generateGameCode();
    }

    // Create new game
    const game = {
      gameCode,
      hostId,
      players: {},
      currentQuestionIndex: -1,
      questions: [],
      gameStatus: 'waiting',
      createdAt: Date.now()
    };

    games.set(gameCode, game);

    // Clean up old games (older than 2 hours)
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    for (const [code, g] of games.entries()) {
      if (g.createdAt < twoHoursAgo) {
        games.delete(code);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ gameCode, hostId })
    };
  } catch (error) {
    console.error('Error creating game:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create game' })
    };
  }
};
