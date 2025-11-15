# Quick Start Guide - S&H Trivia

Get up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
cd netlify/functions
npm install
cd ../..
```

## Step 2: Set Up Supabase (Free)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Choose a name, password, and region
4. Wait for project to be created (2-3 minutes)
5. Once ready, go to **Settings > API**
6. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## Step 3: Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 4: Run Locally

```bash
npm run functions:dev
```

The game will open at http://localhost:3000

## Step 5: Test It Out

### On Your Computer (Host):
1. Open http://localhost:3000
2. Click "Host a Game"
3. Note the 4-letter game code

### On Your Phone (Player):
1. Open http://localhost:3000 (or your computer's IP address on same network)
2. Click "Join a Game"
3. Enter the game code and your name
4. Click "Join Game"

### Back on Computer:
1. You should see the player appear in the lobby
2. Click "Start Game"
3. Answer questions!

## Deploy to Netlify

### Option 1: Connect GitHub

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" > "Import an existing project"
4. Choose your GitHub repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables (from Step 2)
7. Deploy!

### Option 2: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set VITE_SUPABASE_URL "your-url"
netlify env:set VITE_SUPABASE_ANON_KEY "your-key"
netlify deploy --prod
```

## Troubleshooting

**"Supabase is not configured" error**
- Make sure `.env` file exists in the root directory
- Verify the values are correct (no extra spaces or quotes)
- Restart the dev server

**Players can't connect**
- If testing locally on phones, use your computer's IP address (e.g., http://192.168.1.100:3000)
- Make sure all devices are on the same WiFi network
- Check firewall isn't blocking port 3000

**Functions not working**
- Make sure you ran `npm install` in both root AND `netlify/functions`
- Check the terminal for error messages

## Next Steps

- Add your own questions in `questions/trivia-questions.json`
- Customize categories and colors in `client/src/types/game.ts`
- Adjust scoring in `client/src/types/game.ts`
- Deploy to Netlify and share with friends!

## Need Help?

Check the full README.md for detailed documentation.
