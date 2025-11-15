import { Handler } from '@netlify/functions';

// Shared game store (same as create-game)
// In production, use Redis or a database
const games = new Map<string, any>();

export const handler: Handler = async (event) => {
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
    const { gameCode, nickname, playerId } = JSON.parse(event.body || '{}');

    if (!gameCode || !nickname || !playerId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'gameCode, nickname, and playerId are required' })
      };
    }

    const game = games.get(gameCode.toUpperCase());

    if (!game) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Game not found' })
      };
    }

    if (game.gameStatus !== 'waiting' && game.gameStatus !== 'playing') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Game has already started or ended' })
      };
    }

    // Check if nickname is already taken
    const existingPlayer = Object.values(game.players).find(
      (p: any) => p.nickname === nickname && p.id !== playerId
    );

    if (existingPlayer) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Nickname already taken' })
      };
    }

    // Add or reconnect player
    const isReconnect = !!game.players[playerId];

    if (isReconnect) {
      game.players[playerId].isConnected = true;
    } else {
      game.players[playerId] = {
        id: playerId,
        nickname,
        score: 0,
        wedges: [],
        isConnected: true,
        joinedAt: Date.now()
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        gameCode,
        playerId,
        isReconnect,
        gameStatus: game.gameStatus
      })
    };
  } catch (error) {
    console.error('Error joining game:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to join game' })
    };
  }
};
