# 🎮 START HERE - S&H Trivia

Welcome to your complete multiplayer trivia game! This guide will get you playing in under 10 minutes.

## 🚀 What You Got

A fully functional trivia game with:
- ✅ Host screen (laptop/desktop)
- ✅ Player screens (phones/tablets)
- ✅ Real-time synchronization
- ✅ 6 Trivial Pursuit-style categories
- ✅ 24 sample questions
- ✅ Ready to deploy to Netlify
- ✅ Complete documentation

## 📋 Quick Setup (3 Steps)

### Step 1: Install Everything (2 minutes)

```bash
# Install main dependencies
npm install

# Install function dependencies
cd netlify/functions
npm install
cd ../..
```

### Step 2: Set Up Supabase (3 minutes)

1. Go to [supabase.com](https://supabase.com) - create free account
2. Click "New Project"
3. Wait 2-3 minutes for project creation
4. Go to **Settings → API**
5. Copy these values:
   - Project URL
   - anon/public key

### Step 3: Configure Environment (1 minute)

```bash
# Copy the example file
cp .env.example .env

# Edit .env and paste your Supabase credentials
# Use any text editor (Notepad, VS Code, etc.)
```

Your `.env` should look like:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## ▶️ Run It!

```bash
npm run functions:dev
```

Open http://localhost:3000

## 🎯 Test It (5 minutes)

### On Your Computer:
1. Open http://localhost:3000
2. Click "Host a Game"
3. Note the 4-letter code

### On Your Phone:
1. Open http://localhost:3000 (same WiFi network)
2. Click "Switch to Join Game" at bottom
3. Enter the game code
4. Enter your name
5. Join!

### Play:
1. Click "Start Game" on computer
2. Answer questions on phone
3. Watch scores update in real-time
4. See who wins!

## 📖 Documentation Files

Start with these in order:

1. **QUICKSTART.md** - Detailed setup guide
2. **README.md** - Full documentation
3. **DEPLOYMENT.md** - Deploy to Netlify
4. **INSTALLATION_CHECKLIST.md** - Verify everything works

## 🎨 Customize It

### Add Questions
Edit `questions/trivia-questions.json`:
```json
{
  "id": "unique_id",
  "category": "GEOGRAPHY",
  "question": "What is the capital of France?",
  "options": ["London", "Berlin", "Paris", "Madrid"],
  "correctAnswer": 2
}
```

### Change Categories
Edit `client/src/types/game.ts` lines 3-20

### Adjust Scoring
Edit `client/src/types/game.ts` lines 44-50

### Modify Timer
Change `QUESTION_TIME_LIMIT` in `client/src/types/game.ts`

## 🚀 Deploy to Netlify

### Quick Deploy (Recommended)

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

2. Go to [netlify.com](https://netlify.com)

3. "Add new site" → "Import from Git"

4. Select your repo

5. Settings:
   - Build: `npm run build`
   - Publish: `dist`

6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

7. Deploy!

Full deployment guide in **DEPLOYMENT.md**

## 🎮 Game Features

### For Hosts:
- Create games with unique codes
- See all connected players
- Control game flow
- View live scoreboard
- See category completion
- Display final leaderboard

### For Players:
- Join with simple code
- Answer on mobile device
- See category colors
- Get instant feedback
- Track personal score
- View final ranking

### Categories Included:
1. 🌍 Geography (Blue)
2. 🎬 Entertainment (Pink)
3. 📚 History (Orange)
4. 🎨 Arts & Literature (Purple)
5. 🔬 Science & Nature (Green)
6. ⚽ Sports & Leisure (Red)

## 🆘 Troubleshooting

### "Supabase is not configured"
- Check `.env` file exists
- Restart dev server

### Players can't connect
- Use computer's IP address (not localhost) on phones
- Ensure same WiFi network

### Build errors
- Run `npm install` again
- Check Node.js version: `node --version` (need 20+)

See **INSTALLATION_CHECKLIST.md** for complete troubleshooting.

## 📁 Project Structure

```
S&H Trivia/
├── client/              # React frontend
│   └── src/
│       ├── components/  # 8 UI screens
│       ├── contexts/    # Game state
│       └── types/       # TypeScript types
├── netlify/functions/   # Backend API
├── questions/           # Trivia questions
└── [docs]              # 5 documentation files
```

## 🎯 Next Steps

1. ✅ Get it running locally (follow steps above)
2. ✅ Test with friends
3. ✅ Add your own questions
4. ✅ Customize categories/colors
5. ✅ Deploy to Netlify
6. ✅ Share and play!

## 💡 Tips

- **Host on laptop** - Better for displaying to group
- **Players use phones** - Easy to join and answer
- **Same WiFi** - Required for local testing
- **Project to TV** - Great for parties!
- **Custom questions** - Make it your own topic

## 🎉 Features You Can Add

The code is ready for:
- More questions (just edit JSON)
- Custom categories (edit game.ts)
- Different scoring (edit SCORING_CONFIG)
- Longer games (change GAME_LENGTH)
- Custom colors (change CATEGORY_COLORS)

## 📞 Need Help?

1. Check error message in browser console (F12)
2. Review QUICKSTART.md
3. Verify INSTALLATION_CHECKLIST.md
4. Check Supabase project is active

## 🏆 Success Looks Like

- ✅ Dev server running without errors
- ✅ Can create and join games
- ✅ Questions display correctly
- ✅ Real-time sync works
- ✅ Scores update live
- ✅ Game completes successfully

## 🚀 Ready to Play!

```bash
# Run this and you're good to go:
npm run functions:dev
```

Then open http://localhost:3000 and start playing!

---

**Important Files:**
- 📘 QUICKSTART.md - Detailed setup
- 📗 README.md - Full documentation
- 📙 DEPLOYMENT.md - Deploy guide
- 📕 INSTALLATION_CHECKLIST.md - Testing guide

**Questions?** Everything is documented in the files above!

**Have fun! 🎊**
