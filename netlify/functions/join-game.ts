import { Handler } from '@netlify/functions';

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

    // Game validation happens client-side via Supabase
    // Just acknowledge the join request
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        gameCode,
        playerId,
        isReconnect: false,
        gameStatus: 'waiting'
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
