import { Handler } from '@netlify/functions';

// Generate random 4-character game code
function generateGameCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

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
    const { hostId } = JSON.parse(event.body || '{}');

    if (!hostId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'hostId is required' })
      };
    }

    // Just generate a unique game code
    // Game state is managed client-side via Supabase
    const gameCode = generateGameCode();

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
