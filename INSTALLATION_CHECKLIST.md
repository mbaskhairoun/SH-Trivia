# Installation & Testing Checklist

Use this checklist to verify your S&H Trivia installation is working correctly.

## ✅ Pre-Installation

- [ ] Node.js 20.x or higher installed
  ```bash
  node --version  # Should show v20.x.x or higher
  ```
- [ ] npm installed
  ```bash
  npm --version   # Should show 10.x.x or higher
  ```
- [ ] Git installed (optional, for version control)
  ```bash
  git --version
  ```

## ✅ Supabase Setup

- [ ] Created Supabase account at [supabase.com](https://supabase.com)
- [ ] Created new project
- [ ] Copied Project URL (Settings → API)
- [ ] Copied anon/public key (Settings → API)
- [ ] **Important**: No database setup needed! We only use broadcasts.

## ✅ File Verification

Ensure all these files exist:

### Root Files
- [ ] `package.json`
- [ ] `tsconfig.json`
- [ ] `vite.config.ts`
- [ ] `netlify.toml`
- [ ] `.env.example`
- [ ] `.gitignore`
- [ ] `README.md`
- [ ] `QUICKSTART.md`
- [ ] `DEPLOYMENT.md`

### Client Files
- [ ] `client/index.html`
- [ ] `client/src/App.tsx`
- [ ] `client/src/main.tsx`
- [ ] `client/src/index.css`
- [ ] `client/src/vite-env.d.ts`

### Components (8 files)
- [ ] `client/src/components/Home.tsx`
- [ ] `client/src/components/HostLobby.tsx`
- [ ] `client/src/components/HostGame.tsx`
- [ ] `client/src/components/HostFinished.tsx`
- [ ] `client/src/components/PlayerJoin.tsx`
- [ ] `client/src/components/PlayerWaiting.tsx`
- [ ] `client/src/components/PlayerGame.tsx`
- [ ] `client/src/components/PlayerFinished.tsx`

### Contexts & Types
- [ ] `client/src/contexts/GameContext.tsx`
- [ ] `client/src/types/game.ts`
- [ ] `client/src/utils/supabase.ts`

### Backend
- [ ] `netlify/functions/package.json`
- [ ] `netlify/functions/create-game.ts`
- [ ] `netlify/functions/join-game.ts`

### Questions
- [ ] `questions/trivia-questions.json` (24 questions)

## ✅ Installation Steps

### Step 1: Install Root Dependencies
```bash
npm install
```
- [ ] Installs React, Vite, TypeScript, etc.
- [ ] Should complete without errors
- [ ] Creates `node_modules` folder

### Step 2: Install Function Dependencies
```bash
cd netlify/functions
npm install
cd ../..
```
- [ ] Installs @netlify/functions
- [ ] Creates `netlify/functions/node_modules`
- [ ] Returns to root directory

### Step 3: Create Environment File
```bash
cp .env.example .env
```
- [ ] Creates `.env` file in root
- [ ] Edit `.env` with your Supabase credentials:
  ```env
  VITE_SUPABASE_URL=https://xxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGc...
  ```

## ✅ Local Testing

### Start Development Server
```bash
npm run functions:dev
```

**Expected Output:**
```
◈ Netlify Dev ◈
◈ Functions server running on port 8888
◈ Vite server running on http://localhost:3000
```

- [ ] Dev server starts without errors
- [ ] Port 3000 is accessible
- [ ] No TypeScript errors in terminal

### Test Host Flow

1. [ ] Open http://localhost:3000 in browser
2. [ ] See "S&H Trivia" title
3. [ ] Click "Host a Game"
4. [ ] See 4-letter game code displayed
5. [ ] Lobby screen loads correctly
6. [ ] Category legend shows 6 categories with colors

### Test Player Flow (Same Device)

1. [ ] Open http://localhost:3000 in **incognito/private window**
2. [ ] Click bottom button "Switch to Join Game"
3. [ ] See join form
4. [ ] Enter game code from host screen
5. [ ] Enter nickname (e.g., "TestPlayer")
6. [ ] Click "Join Game"
7. [ ] Player appears in host lobby
8. [ ] Player sees waiting screen

### Test Mobile Connection

1. [ ] Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   # Mac/Linux
   ifconfig
   ```
2. [ ] On phone (same WiFi), open: `http://YOUR_IP:3000`
3. [ ] Join game using game code
4. [ ] Player appears in lobby

### Test Full Game

1. [ ] Have 2+ players joined
2. [ ] Click "Start Game" on host screen
3. [ ] Questions appear on both screens
4. [ ] Timer counts down
5. [ ] Submit answers on player screens
6. [ ] "Locked In" message appears
7. [ ] Reveal shows correct answer
8. [ ] Scores update on host screen
9. [ ] Click "Next Question"
10. [ ] All 12 questions complete
11. [ ] Final leaderboard appears
12. [ ] Top 3 podium displays correctly

## ✅ Code Quality Checks

### TypeScript Compilation
```bash
npm run build
```
- [ ] Builds without TypeScript errors
- [ ] Creates `dist` folder
- [ ] No warnings about missing types

### JSON Validation
```bash
node -e "JSON.parse(require('fs').readFileSync('questions/trivia-questions.json'))"
```
- [ ] Completes without errors
- [ ] Questions file is valid JSON

### Environment Variables
```bash
cat .env
```
- [ ] File exists
- [ ] Contains VITE_SUPABASE_URL
- [ ] Contains VITE_SUPABASE_ANON_KEY
- [ ] No extra spaces or quotes

## ✅ Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari (iOS)

## ✅ Feature Testing

### Real-time Sync
- [ ] Player joins → appears in host lobby immediately
- [ ] Host starts game → players see question immediately
- [ ] Player answers → count updates on host screen
- [ ] Host clicks "Next" → new question on all screens
- [ ] All screens show same game state

### Reconnection
- [ ] Player closes tab
- [ ] Player reopens and rejoins with same code
- [ ] Score is preserved
- [ ] Game continues normally

### Late Join
- [ ] Start game with 1 player
- [ ] Try to join with 2nd player after game started
- [ ] Should show appropriate message or wait state

### Scoring
- [ ] Correct answer adds points
- [ ] Incorrect answer adds 0 points
- [ ] Time bonus applies (if enabled)
- [ ] Category wedges appear after correct answers
- [ ] Final scores match expected values

### UI/UX
- [ ] All text readable
- [ ] Buttons are clickable/touchable
- [ ] Colors match categories
- [ ] Mobile view is responsive
- [ ] Host view optimized for projection
- [ ] No layout overflow

## ✅ Common Issues & Solutions

### Issue: "Supabase is not configured"
- [ ] Check `.env` file exists
- [ ] Verify variable names are correct
- [ ] Restart dev server after creating `.env`
- [ ] Check for typos in Supabase URL/key

### Issue: Players can't connect
- [ ] All devices on same WiFi network
- [ ] Firewall not blocking port 3000
- [ ] Using correct IP address
- [ ] Game code typed correctly (case-sensitive)

### Issue: Real-time not working
- [ ] Supabase project is active (not paused)
- [ ] Check browser console for errors
- [ ] Verify WebSocket connection in Network tab
- [ ] Test Supabase credentials

### Issue: Build fails
- [ ] Run `npm install` again
- [ ] Clear `node_modules` and reinstall
- [ ] Check Node.js version (needs 20+)
- [ ] Review error messages for missing dependencies

## ✅ Pre-Deployment Checklist

Before deploying to Netlify:

- [ ] All tests pass locally
- [ ] No console errors
- [ ] Build completes successfully
- [ ] Questions file validated
- [ ] Environment variables documented
- [ ] README reviewed
- [ ] Git repository initialized (if using)

## ✅ Post-Deployment Checklist

After deploying to Netlify:

- [ ] Site loads at Netlify URL
- [ ] Environment variables set in Netlify
- [ ] Can create game
- [ ] Can join game
- [ ] Real-time sync works
- [ ] Functions execute successfully
- [ ] Mobile view works
- [ ] No console errors

## 🎉 Success Criteria

Your installation is successful when:

✅ Dev server starts without errors
✅ Host can create games
✅ Players can join games
✅ Questions load and display
✅ Real-time sync works across devices
✅ Scoring calculates correctly
✅ Game completes and shows leaderboard
✅ Build completes successfully
✅ All documentation is clear

## 📞 Need Help?

If you're stuck:

1. Check the error message in terminal/console
2. Review QUICKSTART.md for common setup issues
3. Verify all checklist items above
4. Check Supabase dashboard for connection status
5. Try restarting the dev server
6. Clear browser cache and reload

## 🚀 Ready to Go!

Once all items are checked, you're ready to:
- Customize questions
- Modify categories
- Adjust scoring
- Deploy to production
- Share with friends!

---

**Installation Date**: ___________
**Tested By**: ___________
**Status**: ⬜ Pass / ⬜ Fail
**Notes**: ___________
