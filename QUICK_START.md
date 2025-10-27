# WorldLeader.io - Quick Start

## 🚀 Get Your Database Running in 5 Minutes

### Step 1: Sign up for Neon (2 minutes)
1. Go to https://neon.tech
2. Sign up (free, no credit card required)
3. Create a new project called "worldleader"

### Step 2: Copy Connection String (30 seconds)
Copy the connection string that looks like:
```
postgresql://user:pass@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Step 3: Update .env (30 seconds)
Edit `.env` file and replace the DATABASE_URL:
```bash
DATABASE_URL="paste-your-neon-connection-string-here"
```

### Step 4: Run Migrations (2 minutes)
In your terminal:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Step 5: Start Development (10 seconds)
```bash
npm run dev
```

Visit http://localhost:3000 and register a user!

## 🎯 That's It!

Your app is now connected to a real PostgreSQL database in the cloud!

## 📊 View Your Data

Open Prisma Studio anytime:
```bash
npx prisma studio
```

## 🔧 Useful Commands

```bash
npm run dev              # Start dev server
npm run db:studio        # Open database browser
npm run db:migrate       # Create new migration
npm run build            # Build for production
```

## 📚 Full Guides

- **Detailed Setup**: See `NEON_SETUP_GUIDE.md`
- **All Database Options**: See `DATABASE_SETUP.md`
- **Deployment**: See `DEPLOYMENT.md` (coming soon)

## ⚠️ Before Production

1. Generate strong JWT secret:
   ```bash
   openssl rand -base64 32
   ```
2. Update JWT_SECRET in .env
3. Set NEXT_PUBLIC_APP_URL to your domain
4. Create separate Neon project for production

---

**Need help?** Check the detailed guides or open an issue!
