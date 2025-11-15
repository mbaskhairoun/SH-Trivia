# Deployment Guide - S&H Trivia

Complete guide for deploying your trivia game to Netlify.

## Prerequisites Checklist

- [ ] Supabase account created
- [ ] Supabase project set up
- [ ] Environment variables copied
- [ ] Code tested locally
- [ ] GitHub account (for deployment)

## Method 1: GitHub + Netlify (Recommended)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - S&H Trivia game"
git branch -M main
git remote add origin https://github.com/yourusername/sh-trivia.git
git push -u origin main
```

### Step 2: Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and authorize Netlify
4. Select your repository
5. Configure build settings:
   - **Branch**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

### Step 3: Add Environment Variables

1. In Netlify dashboard, go to **Site settings** → **Environment variables**
2. Click "Add a variable"
3. Add these two variables:
   - **Key**: `VITE_SUPABASE_URL`
     **Value**: Your Supabase project URL
   - **Key**: `VITE_SUPABASE_ANON_KEY`
     **Value**: Your Supabase anon key

### Step 4: Deploy

1. Click "Deploy site"
2. Wait for build to complete (2-3 minutes)
3. Your site will be live at `https://random-name.netlify.app`

### Step 5: Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click "Add custom domain"
3. Follow instructions to configure DNS

## Method 2: Netlify CLI

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

### Step 3: Initialize Site

```bash
netlify init
```

Follow the prompts:
- Create & configure a new site? **Yes**
- Choose team: Select your team
- Site name: `sh-trivia` (or your choice)
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

### Step 4: Set Environment Variables

```bash
netlify env:set VITE_SUPABASE_URL "your-supabase-url"
netlify env:set VITE_SUPABASE_ANON_KEY "your-supabase-key"
```

### Step 5: Deploy

For a draft deploy (testing):
```bash
netlify deploy
```

For production deploy:
```bash
netlify deploy --prod
```

## Method 3: Netlify Drop (Drag & Drop)

### Step 1: Build Locally

```bash
npm run build
```

### Step 2: Prepare Functions

```bash
cd netlify/functions
npm run build  # if you have a build step
cd ../..
```

### Step 3: Upload to Netlify

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `dist` folder to the upload area
3. Wait for deployment

**Note**: Functions and environment variables need to be configured separately for drag & drop deploys.

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Can create a game (host)
- [ ] Can join a game (player)
- [ ] Real-time sync works
- [ ] Questions load properly
- [ ] Scoring works correctly
- [ ] Mobile view looks good

## Testing Your Deployed Site

### Test 1: Host Flow

1. Open `https://your-site.netlify.app`
2. Click "Host a Game"
3. Verify game code appears
4. Check that lobby loads

### Test 2: Player Flow (Different Device)

1. Open site on phone
2. Click "Join a Game"
3. Enter game code
4. Verify connection

### Test 3: Full Game

1. Have at least 2 players join
2. Start game
3. Answer questions
4. Verify real-time sync
5. Check final leaderboard

## Continuous Deployment

Once connected to GitHub, Netlify will automatically:

1. Deploy when you push to `main` branch
2. Create preview deploys for pull requests
3. Run build and deploy in ~2-3 minutes

### Updating Questions

```bash
# Edit questions file
nano questions/trivia-questions.json

# Commit and push
git add questions/trivia-questions.json
git commit -m "Add new trivia questions"
git push

# Netlify will automatically redeploy
```

## Environment Variable Management

### Updating Variables

**Via Netlify UI:**
1. Site settings → Environment variables
2. Click on variable to edit
3. Save changes
4. Trigger redeploy

**Via Netlify CLI:**
```bash
netlify env:set VARIABLE_NAME "new-value"
netlify deploy --prod
```

### Checking Current Variables

```bash
netlify env:list
```

## Troubleshooting Deployment

### Build Fails

Check build logs in Netlify dashboard:
- Look for missing dependencies
- Verify Node version compatibility
- Check for TypeScript errors

**Solution**: Fix errors locally first, then push

### Functions Not Working

1. Verify functions are in `netlify/functions` directory
2. Check function logs in Netlify dashboard
3. Ensure dependencies are installed:
   ```json
   // netlify/functions/package.json must exist
   ```

### Environment Variables Not Loading

1. Restart deployment after adding variables
2. Variables must start with `VITE_` for Vite apps
3. No quotes needed in Netlify UI

### Real-time Not Working

1. Check Supabase project status (not paused)
2. Verify URL and key are correct
3. Check browser console for errors
4. Test Supabase connection:
   ```javascript
   // In browser console
   console.log(import.meta.env.VITE_SUPABASE_URL)
   ```

## Performance Optimization

### Caching

Netlify automatically caches:
- Static assets (CSS, JS, images)
- Function responses (if configured)

### Headers (Optional)

Create `netlify.toml` section:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Cache-Control = "public, max-age=31536000"
```

### Redirects

Already configured in `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Monitoring

### Netlify Analytics (Paid)

- Pageviews
- Unique visitors
- Top pages
- Bandwidth usage

### Free Monitoring Options

1. **Netlify Dashboard**
   - Deploy history
   - Function invocations
   - Build minutes used

2. **Supabase Dashboard**
   - Real-time connections
   - API requests
   - Bandwidth

3. **Browser Console**
   - Check for JavaScript errors
   - Monitor network requests

## Scaling Considerations

### Free Tier Limits

**Netlify:**
- 100 GB bandwidth/month
- 125k function requests/month
- 300 build minutes/month

**Supabase:**
- 500 MB database (not used)
- 2 GB bandwidth
- 200 concurrent connections

### When to Upgrade

- Regular events with 50+ players
- Multiple simultaneous games
- High question count (1000+)
- Custom branding needs

## Backup & Recovery

### Backup Strategy

1. **Code**: Stored in GitHub
2. **Questions**: In version control
3. **Config**: Environment variables documented

### Recovery Process

1. Clone repository
2. Set up new Netlify site
3. Add environment variables
4. Deploy

## Security Best Practices

1. **Never commit `.env` file**
2. **Rotate Supabase keys** if exposed
3. **Use HTTPS only** (automatic on Netlify)
4. **Monitor function logs** for suspicious activity
5. **Keep dependencies updated**:
   ```bash
   npm audit
   npm update
   ```

## Next Steps

- Set up custom domain
- Add monitoring
- Create backup/staging environment
- Add custom questions
- Share with friends!

---

**Need help?** Check the main README.md or Netlify documentation.
