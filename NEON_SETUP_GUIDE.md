# Neon Database Setup Guide for WorldLeader.io

## Step-by-Step Setup

### 1. Create Neon Account
1. Go to https://neon.tech
2. Click "Sign Up" (you can use GitHub, Google, or email)
3. Verify your email if required

### 2. Create Your Database
1. Once logged in, click **"Create a project"**
2. Fill in the details:
   - **Project name**: `worldleader` (or your preference)
   - **Region**: Choose closest to your users (e.g., US East for North America)
   - **Postgres version**: 15 or 16 (latest)
3. Click **"Create project"**

### 3. Get Your Connection String
After creating the project, you'll see a connection string. It looks like:
```
postgresql://username:password@ep-xxxxx-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**IMPORTANT**: Copy this entire connection string - you'll need it in the next step!

### 4. Update Your .env File

Open `/Users/chrisbeechey/WorldLeader/.env` and update the DATABASE_URL:

```bash
# Replace this with your Neon connection string
DATABASE_URL="postgresql://username:password@ep-xxxxx-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Keep your JWT secret (or generate a new one)
JWT_SECRET="your-secret-key-change-in-production-min-32-chars-long"

# Keep these for now
EMAIL_SERVER="smtp://user:pass@smtp.example.com:587"
EMAIL_FROM="noreply@worldleader.io"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Update Prisma Schema (Already Done!)
✅ Your schema is already configured for PostgreSQL!

### 6. Run Database Migrations

Open your terminal in the WorldLeader project directory and run:

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply the initial migration
npx prisma migrate dev --name init

# Verify the migration worked
npx prisma studio
```

This will:
- Create the database tables (User, Transaction, Notification)
- Set up all indexes and relationships
- Open Prisma Studio so you can view your database

### 7. Test Your Connection

Start your development server:
```bash
npm run dev
```

Then:
1. Go to http://localhost:3000
2. Click "Join Now"
3. Fill out the registration form
4. If registration succeeds, your database connection is working! 🎉

### 8. View Your Data in Prisma Studio

Anytime you want to view/edit your database:
```bash
npx prisma studio
```

This opens a visual database browser at http://localhost:5555

## Neon Dashboard Features

### Connection Pooling
Neon automatically handles connection pooling - no extra configuration needed!

### Database Branching
You can create database branches (like git branches) for:
- Testing new features
- Running migrations safely
- Separate staging environments

### Monitoring
In your Neon dashboard you can monitor:
- Database size
- Active connections
- Query performance
- Storage usage

## Neon Free Tier Limits

✅ **0.5 GB storage** - plenty for thousands of users
✅ **Unlimited compute time** - no time limits!
✅ **3 GB data transfer/month**
✅ **10 database branches**
✅ **Auto-suspend after inactivity** - saves resources

## Production Deployment

When deploying to production (Vercel, Railway, etc.):

1. Add DATABASE_URL to your production environment variables
2. Run migrations in production:
   ```bash
   npx prisma migrate deploy
   ```
3. Your app will automatically connect to Neon!

## Troubleshooting

### "Can't reach database server"
- Check your internet connection
- Verify the connection string is correct
- Make sure you copied the entire string including `?sslmode=require`

### "Schema does not exist"
Run:
```bash
npx prisma migrate dev --name init
```

### "Password authentication failed"
- Regenerate connection string in Neon dashboard
- Update .env with new connection string
- Restart your dev server

### Database is slow
- Neon auto-suspends after inactivity (takes ~1 second to wake up)
- First query after inactivity may be slower
- Subsequent queries will be fast

## Security Best Practices

1. ✅ **Never commit .env file** - already in .gitignore
2. ✅ **Use different databases for dev/prod** - create separate Neon projects
3. ✅ **Rotate passwords periodically** - regenerate in Neon dashboard
4. ✅ **Enable IP allowlist** (optional) - in Neon project settings
5. ✅ **Monitor usage** - check Neon dashboard regularly

## Useful Commands

```bash
# View database in browser
npm run db:studio

# Create new migration
npm run db:migrate

# Apply migrations (production)
npm run db:migrate:deploy

# Push schema without migration (quick prototyping)
npm run db:push

# Regenerate Prisma Client
npm run db:generate
```

## Next Steps

1. ✅ Database is set up
2. ✅ Test registration and login
3. ✅ Make some test purchases
4. ✅ View leaderboard
5. Ready to deploy to production!

## Support

- Neon Docs: https://neon.tech/docs
- Neon Discord: https://discord.gg/92vNTzKDGp
- Prisma Docs: https://www.prisma.io/docs

---

**You're all set!** 🎉

Your WorldLeader.io app is now connected to a production-ready PostgreSQL database on Neon!
