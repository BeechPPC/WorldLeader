# WorldLeader.io - Deployment Guide (Vercel)

## 🚀 Steps to Deploy to Vercel

### Prerequisites
- ✅ GitHub repository (https://github.com/BeechPPC/WorldLeader)
- ✅ Vercel account (sign up at https://vercel.com)
- ⚠️ PostgreSQL database (required - SQLite doesn't work on Vercel)

---

## Step-by-Step Deployment Process

### Step 1: Set Up PostgreSQL Database

**Option A: Vercel Postgres (Recommended)**

1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database"
3. Select "Postgres"
4. Choose a name: `worldleader-db`
5. Select region (closest to your users)
6. Click "Create"
7. **Save the connection string** - you'll need it!

**Option B: Neon.tech (Free PostgreSQL)**

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create a new project: "WorldLeader"
4. Copy the connection string (looks like: `postgresql://user:pass@host/db?sslmode=require`)

**Option C: Supabase (Free PostgreSQL)**

1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy the connection string (URI format)

---

### Step 2: Update Prisma Schema for PostgreSQL

**Edit `prisma/schema.prisma`:**

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

**Commit this change:**
```bash
git add prisma/schema.prisma
git commit -m "chore: Switch to PostgreSQL for production"
git push origin main
```

---

### Step 3: Deploy to Vercel

#### 3.1 Connect Repository

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select `BeechPPC/WorldLeader`
4. Click "Import"

#### 3.2 Configure Project

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `./` (leave as is)

**Build Command**: `npm run build` (default)

**Output Directory**: `.next` (default)

#### 3.3 Add Environment Variables

Click "Environment Variables" and add these:

| Name | Value | Notes |
|------|-------|-------|
| `DATABASE_URL` | `postgresql://user:pass@host/db` | From Step 1 |
| `JWT_SECRET` | Generate new secret | See below |
| `EMAIL_SERVER` | Optional for MVP | Leave blank or add SMTP |
| `EMAIL_FROM` | `noreply@worldleader.io` | Or your email |
| `NEXT_PUBLIC_APP_URL` | Leave blank for now | Will add after deploy |

**Generate JWT_SECRET:**
```bash
# Run this locally to generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and paste as `JWT_SECRET` value.

#### 3.4 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. ✅ Deployment complete!

---

### Step 4: Run Database Migrations

After first deployment, you need to set up the database schema.

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migration using production env
DATABASE_URL="your-postgres-url" npx prisma migrate deploy
```

**Option B: Using Prisma Data Platform**

```bash
# Run migrations locally pointing to production DB
DATABASE_URL="your-postgres-url" npx prisma migrate deploy
```

**Option C: Manual via Prisma Studio**

```bash
# Generate SQL migration
npx prisma migrate dev --create-only

# Copy SQL from prisma/migrations/xxx/migration.sql
# Run it manually in your database provider's console
```

---

### Step 5: Update Environment Variables

1. Go to your Vercel deployment page
2. Copy your production URL (e.g., `https://worldleader.vercel.app`)
3. Go to Settings → Environment Variables
4. Update or add:
   - `NEXT_PUBLIC_APP_URL` = `https://worldleader.vercel.app`
5. Click "Save"
6. Redeploy (Deployments → ... → Redeploy)

---

### Step 6: Verify Deployment

**Test these features:**

1. ✅ Visit your site: `https://your-project.vercel.app`
2. ✅ Register a new user
3. ✅ Login
4. ✅ View leaderboards
5. ✅ Make a purchase
6. ✅ Check rankings update

**Check Vercel Logs:**
- Go to Deployments → Latest → Functions
- Click on any function to see logs
- Email notifications will appear here

---

## 📝 Production Checklist

### Before Going Live

- [ ] PostgreSQL database set up
- [ ] Prisma schema updated to PostgreSQL
- [ ] All environment variables configured
- [ ] JWT_SECRET is cryptographically secure
- [ ] Database migrations ran successfully
- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test leaderboard loading
- [ ] Test purchase system
- [ ] Check Vercel function logs for errors

### Security Improvements

- [ ] Generate new JWT_SECRET (don't use dev one)
- [ ] Update CORS settings if needed
- [ ] Review Prisma schema indexes for performance
- [ ] Consider rate limiting (Vercel Edge Config)
- [ ] Add error tracking (Sentry, LogRocket)

### Optional Enhancements

- [ ] Custom domain (Settings → Domains)
- [ ] Set up real SMTP for emails (SendGrid, Resend, etc.)
- [ ] Add analytics (Vercel Analytics)
- [ ] Set up monitoring (Vercel Speed Insights)
- [ ] Configure caching headers
- [ ] Add OG images for social sharing

---

## 🔧 Common Deployment Issues

### Issue: Build Fails with Prisma Error

**Error:**
```
Prisma Client could not locate the Query Engine
```

**Solution:**

Add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

Commit and push:
```bash
git add package.json
git commit -m "fix: Add postinstall script for Prisma"
git push origin main
```

---

### Issue: Database Connection Fails

**Error:**
```
Can't reach database server
```

**Solutions:**

1. **Check DATABASE_URL format for PostgreSQL:**
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
   ```

2. **Ensure SSL mode is included:**
   ```
   ?sslmode=require
   ```

3. **Test connection locally:**
   ```bash
   DATABASE_URL="your-prod-url" npx prisma db push
   ```

---

### Issue: Environment Variables Not Loading

**Solution:**

1. Ensure variables are set in Vercel dashboard
2. Redeploy after adding variables
3. For client-side: use `NEXT_PUBLIC_` prefix

---

### Issue: JWT Errors in Production

**Error:**
```
JWTInvalid: Invalid Compact JWS
```

**Solution:**

1. Ensure JWT_SECRET is set in Vercel
2. Clear browser cookies
3. Verify JWT_SECRET is at least 32 characters

---

## 📊 Post-Deployment Monitoring

### Vercel Dashboard

**Check these regularly:**

1. **Functions** - API route performance
2. **Analytics** - User traffic
3. **Logs** - Error messages
4. **Speed Insights** - Page performance

### Database Monitoring

**For Vercel Postgres:**
- Go to Storage → Your DB
- Check "Metrics" tab
- Monitor query performance

**For Neon/Supabase:**
- Check their dashboards for metrics

---

## 🔄 Continuous Deployment

**Automatic Deployments:**

Every push to `main` branch will automatically deploy to Vercel!

```bash
# Make changes locally
git add .
git commit -m "feat: new feature"
git push origin main

# Vercel automatically deploys in ~2 minutes
```

**Preview Deployments:**

Create a feature branch for testing:
```bash
git checkout -b feature/stripe-integration
# Make changes
git push origin feature/stripe-integration
# Vercel creates a preview deployment
# Merge to main when ready
```

---

## 💰 Cost Estimates

### Free Tier (Hobby Plan)

**Vercel:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments

**Vercel Postgres:**
- ✅ Free tier: 256MB storage
- ⚠️ Limited to 60 hours compute/month
- 💰 Upgrade: $20/month for more

**Neon.tech:**
- ✅ Free tier: 3GB storage
- ✅ Generous compute limits
- 💰 Upgrade: $19/month

**Supabase:**
- ✅ Free tier: 500MB database
- ✅ Unlimited API requests
- 💰 Upgrade: $25/month

### Recommended for MVP
- **Vercel**: Free (Hobby)
- **Database**: Neon.tech Free or Supabase Free
- **Total**: $0/month

---

## 🎯 Quick Deploy Checklist

```bash
# 1. Update for PostgreSQL
# Edit prisma/schema.prisma: provider = "postgresql"

# 2. Commit changes
git add .
git commit -m "chore: Prepare for production deployment"
git push origin main

# 3. Set up database (choose one):
# - Vercel Postgres
# - Neon.tech
# - Supabase

# 4. Deploy on Vercel:
# - Import from GitHub
# - Add environment variables
# - Click Deploy

# 5. Run migrations
DATABASE_URL="prod-url" npx prisma migrate deploy

# 6. Test your site!
```

---

## 📞 Getting Help

**Vercel Issues:**
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

**Prisma Issues:**
- Docs: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- Discord: https://discord.gg/prisma

**Database Issues:**
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
- Neon: https://neon.tech/docs
- Supabase: https://supabase.com/docs

---

## 🎉 After Successful Deployment

Your app is live at: `https://your-project.vercel.app`

**Share it:**
- Update README.md with live URL
- Share on social media
- Get feedback from users

**Monitor:**
- Check Vercel Analytics daily
- Monitor database usage
- Review error logs

**Iterate:**
- Gather user feedback
- Plan Phase 2 features
- Keep improving!

---

**Ready to deploy? Let's get WorldLeader.io live!** 🚀🌍

Last Updated: October 27, 2025
