import { createClient, RealtimeChannel } from '@supabase/supabase-js';

// Supabase configuration
// IMPORTANT: Set these environment variables in Netlify:
// - VITE_SUPABASE_URL: Your Supabase project URL
// - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Game channel manager
export class GameChannel {
  private channel: RealtimeChannel | null = null;
  private gameCode: string;

  constructor(gameCode: string) {
    this.gameCode = gameCode;
  }

  // Subscribe to game updates
  subscribe(
    onPlayerJoined: (player: any) => void,
    onPlayerLeft: (playerId: string) => void,
    onGameStarted: () => void,
    onQuestionStarted: (question: any, index: number) => void,
    onAnswerSubmitted: (playerId: string) => void,
    onQuestionEnded: (results: any[]) => void,
    onGameEnded: (finalScores: any[]) => void,
    onPlayerReconnected: (playerId: string) => void
  ) {
    // Create a channel for this specific game
    this.channel = supabase.channel(`game:${this.gameCode}`, {
      config: {
        broadcast: { self: true }
      }
    });

    // Listen for broadcast events
    this.channel
      .on('broadcast', { event: 'player_joined' }, ({ payload }) => {
        onPlayerJoined(payload.player);
      })
      .on('broadcast', { event: 'player_left' }, ({ payload }) => {
        onPlayerLeft(payload.playerId);
      })
      .on('broadcast', { event: 'game_started' }, () => {
        onGameStarted();
      })
      .on('broadcast', { event: 'question_started' }, ({ payload }) => {
        onQuestionStarted(payload.question, payload.index);
      })
      .on('broadcast', { event: 'answer_submitted' }, ({ payload }) => {
        onAnswerSubmitted(payload.playerId);
      })
      .on('broadcast', { event: 'question_ended' }, ({ payload }) => {
        onQuestionEnded(payload.results);
      })
      .on('broadcast', { event: 'game_ended' }, ({ payload }) => {
        onGameEnded(payload.finalScores);
      })
      .on('broadcast', { event: 'player_reconnected' }, ({ payload }) => {
        onPlayerReconnected(payload.playerId);
      })
      .subscribe();

    return this;
  }

  // Broadcast events to all players
  async broadcast(eventType: string, payload: any) {
    if (!this.channel) {
      console.error('Channel not initialized');
      return;
    }

    await this.channel.send({
      type: 'broadcast',
      event: eventType,
      payload
    });
  }

  // Unsubscribe and clean up
  unsubscribe() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }
}

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}
