# S&H Trivia

A multiplayer trivia game inspired by Trivial Pursuit's category system and Kahoot's join-by-phone experience. Perfect for parties, classrooms, and team-building events!

## Features

- 🎯 **6 Trivial Pursuit-style categories** with color-coded questions
- 👥 **Multiplayer gameplay** - Host on laptop, players join on phones
- ⚡ **Real-time synchronization** using Supabase Realtime
- 🏆 **Score tracking and leaderboards** with category completion badges
- 📱 **Mobile-optimized player interface**
- 🖥️ **Desktop-optimized host screen** for projection
- 🔄 **Reconnection support** for dropped connections
- ⏱️ **Time-based scoring** with configurable bonuses

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Netlify Functions (serverless)
- **Real-time**: Supabase Realtime
- **Deployment**: Netlify
- **Styling**: Inline React styles (no external CSS framework needed)

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- A Supabase account (free tier works!)
- A Netlify account (free tier works!)

### Local Development

1. **Clone and install dependencies**

```bash
cd "S&H Trivia"
npm install
cd netlify/functions
npm install
cd ../..
```

2. **Set up Supabase**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy your project URL and anon/public key

3. **Create environment file**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server**

```bash
npm run functions:dev
```

This starts both the Vite dev server (port 3000) and Netlify Functions.

5. **Open the game**

- Host screen: http://localhost:3000
- Players can join from their phones using the same URL

## Deployment to Netlify

### One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### Manual Deployment

1. **Build the project**

```bash
npm run build
```

2. **Deploy to Netlify**

   - Push your code to GitHub
   - Connect your repo to Netlify
   - Set build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Functions directory: `netlify/functions`

3. **Set environment variables in Netlify**

   Go to Site Settings > Environment Variables and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. **Deploy!**

   Your site will be live at `https://your-site-name.netlify.app`

## How to Play

### For Hosts

1. Click **"Host a Game"** on the home screen
2. Share the game code displayed on screen
3. Wait for players to join
4. Click **"Start Game"** when ready
5. Control the game flow with "Next Question" button
6. View real-time scores and category completion

### For Players

1. Open the game URL on your phone
2. Click **"Join a Game"**
3. Enter the game code and your nickname
4. Wait in the lobby for the host to start
5. Answer questions as fast as you can
6. Watch your score climb!

## Customization

### Modifying Categories

Edit `client/src/types/game.ts`:

```typescript
// Line 3-10: Define your categories
export enum Category {
  YOUR_CATEGORY = 'YOUR_CATEGORY',
  // Add more...
}

// Line 13-20: Set category colors
export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.YOUR_CATEGORY]: '#YOUR_COLOR',
  // Add more...
};
```

### Adjusting Scoring

Edit `client/src/types/game.ts`:

```typescript
// Line 44-50: Scoring configuration
export const SCORING_CONFIG = {
  CORRECT_ANSWER: 100,        // Base points per correct answer
  TIME_BONUS_ENABLED: true,   // Enable/disable time bonus
  TIME_BONUS_MAX: 50,         // Max bonus points
  QUESTION_TIME_LIMIT: 20,    // Seconds per question
  GAME_LENGTH: 12             // Total questions per game
};
```

### Adding Questions

Edit `questions/trivia-questions.json`:

```json
{
  "id": "unique_id",
  "category": "CATEGORY_NAME",
  "question": "Your question here?",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": 0,
  "difficulty": "easy"
}
```

**Important**: The `correctAnswer` field is the **index** of the correct option (0-3).

### Changing Timer Settings

The question timer can be modified in `client/src/types/game.ts`:

```typescript
QUESTION_TIME_LIMIT: 20,    // Change this value (in seconds)
```

## Project Structure

```
S&H Trivia/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── HostLobby.tsx       # Host waiting room
│   │   │   ├── HostGame.tsx        # Host game screen
│   │   │   ├── HostFinished.tsx    # Host end screen
│   │   │   ├── PlayerJoin.tsx      # Player join screen
│   │   │   ├── PlayerWaiting.tsx   # Player lobby
│   │   │   ├── PlayerGame.tsx      # Player game screen
│   │   │   └── PlayerFinished.tsx  # Player results
│   │   ├── contexts/        # React context
│   │   │   └── GameContext.tsx     # Game state management
│   │   ├── types/           # TypeScript types
│   │   │   └── game.ts             # Game types & config
│   │   ├── utils/           # Utility functions
│   │   │   └── supabase.ts         # Supabase client
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   └── index.html           # HTML template
├── netlify/
│   └── functions/           # Serverless functions
│       ├── create-game.ts   # Create new game
│       └── join-game.ts     # Join existing game
├── questions/
│   └── trivia-questions.json # Question database
├── netlify.toml             # Netlify config
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── vite.config.ts           # Vite config
```

## Real-time Service Setup

This project uses **Supabase Realtime** for synchronization. Here's how it works:

### Why Supabase?

- Free tier includes real-time features
- WebSocket-based (fast and reliable)
- Easy to set up
- No database required (we use broadcasts only)

### Setting Up Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. No database setup needed - we only use the real-time broadcast feature
4. Copy your credentials to `.env`

### Alternative Real-time Services

You can swap Supabase for other services:

#### Using Ably

1. Install: `npm install ably`
2. Modify `client/src/utils/supabase.ts` to use Ably client
3. Update broadcast/subscribe logic

#### Using Pusher

1. Install: `npm install pusher-js`
2. Modify `client/src/utils/supabase.ts` to use Pusher
3. Update event handling

## Troubleshooting

### Players can't join

- Check that environment variables are set correctly
- Verify Supabase project is active
- Ensure game code is typed correctly (case-sensitive)

### Real-time sync not working

- Check browser console for Supabase connection errors
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct
- Make sure Supabase project is not paused (free tier auto-pauses after inactivity)

### Netlify Functions failing

- Check function logs in Netlify dashboard
- Verify `netlify/functions/package.json` dependencies are installed
- Ensure build completed successfully

### Questions not loading

- Verify `questions/trivia-questions.json` is valid JSON
- Check that question categories match the Category enum
- Ensure `correctAnswer` is a valid index (0-3)

## Performance Notes

- **In-memory storage**: Game state is stored in memory (resets on function cold starts)
- **For production**: Consider using Redis or a database for persistent storage
- **Supabase free tier**: Supports up to 200 concurrent connections
- **Netlify free tier**: 125k function requests/month

## Future Enhancements

Potential features to add:

- [ ] Persistent game storage (Redis/MongoDB)
- [ ] Custom question sets
- [ ] Audio/visual effects
- [ ] Chat between players
- [ ] Multiple game rooms
- [ ] Admin dashboard
- [ ] Question difficulty weighting
- [ ] Power-ups and special abilities

## License

MIT License - feel free to use this for your own events!

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Netlify function logs
3. Check browser console for errors
4. Verify Supabase connection status

## Credits

Built with ❤️ for multiplayer trivia fun!

Inspired by:
- Trivial Pursuit (category system & wedges)
- Kahoot (join-by-code multiplayer experience)
