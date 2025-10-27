# Database Setup Guide for WorldLeader.io

## Current Status
- ✅ Prisma schema configured for PostgreSQL
- ✅ Schema supports both SQLite (dev) and PostgreSQL (production)
- ⏳ Ready to connect to a real database

## Quick Start Options

### Option 1: Vercel Postgres (Recommended for Vercel deployments)

**Pros:** Seamless integration with Vercel, serverless, generous free tier
**Cons:** Tied to Vercel platform

1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database → Postgres
3. Vercel will automatically set these environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_URL_NON_POOLING`
4. Update your `.env` file:
   ```bash
   DATABASE_URL="your-vercel-postgres-url"
   ```
5. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### Option 2: Neon (Serverless Postgres)

**Pros:** Generous free tier (0.5GB storage), serverless, auto-scaling, branching
**Cons:** Newer platform

1. Sign up at https://neon.tech
2. Create a new project
3. Copy your connection string
4. Update `.env`:
   ```bash
   DATABASE_URL="postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
5. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### Option 3: Supabase

**Pros:** PostgreSQL + Auth + Storage + Realtime, generous free tier
**Cons:** More features than you might need

1. Sign up at https://supabase.com
2. Create a new project
3. Go to Project Settings → Database
4. Copy the connection string (use "Transaction" mode for Prisma)
5. Update `.env`:
   ```bash
   DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
   ```
6. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### Option 4: Railway

**Pros:** Simple, includes free tier, supports many databases
**Cons:** Smaller free tier than others

1. Sign up at https://railway.app
2. Create a new project → Add PostgreSQL
3. Copy the DATABASE_URL from the PostgreSQL service
4. Update `.env`:
   ```bash
   DATABASE_URL="postgresql://postgres:xxxxx@xxxxx.railway.app:5432/railway"
   ```
5. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### Option 5: PlanetScale (MySQL)

**Pros:** Highly scalable, branching, no downtime migrations
**Cons:** Uses MySQL instead of PostgreSQL

1. Sign up at https://planetscale.com
2. Create a new database
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mysql"
     url = env("DATABASE_URL")
     relationMode = "prisma"
   }
   ```
4. Get connection string from PlanetScale
5. Update `.env`
6. Run migrations:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

## Local PostgreSQL Setup (For Development)

If you want to run PostgreSQL locally:

### Using Docker:
```bash
docker run --name worldleader-db \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_USER=worldleader \
  -e POSTGRES_DB=worldleader \
  -p 5432:5432 \
  -d postgres:15
```

Update `.env`:
```bash
DATABASE_URL="postgresql://worldleader:yourpassword@localhost:5432/worldleader?schema=public"
```

### Using Homebrew (Mac):
```bash
brew install postgresql@15
brew services start postgresql@15
createdb worldleader
```

Update `.env`:
```bash
DATABASE_URL="postgresql://yourusername@localhost:5432/worldleader?schema=public"
```

## Migration Commands

### Create and apply migrations:
```bash
# For development (creates migration files)
npx prisma migrate dev --name descriptive_name

# For production (applies existing migrations)
npx prisma migrate deploy

# Generate Prisma Client after schema changes
npx prisma generate
```

### View database in Prisma Studio:
```bash
npx prisma studio
```

### Reset database (⚠️ WARNING: Deletes all data):
```bash
npx prisma migrate reset
```

## Environment Variables

Make sure your `.env` file has:

```bash
# Database
DATABASE_URL="your-postgres-connection-string"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-secure-32-char-minimum-secret"

# App Configuration
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Email (optional for now)
EMAIL_SERVER="smtp://user:pass@smtp.example.com:587"
EMAIL_FROM="noreply@worldleader.io"
```

## Security Best Practices

1. ✅ **Never commit `.env` to git** - it's already in `.gitignore`
2. ✅ **Use different databases for dev/staging/production**
3. ✅ **Generate a strong JWT_SECRET**: `openssl rand -base64 32`
4. ✅ **Use SSL for production database connections** (`sslmode=require`)
5. ✅ **Regularly backup your production database**
6. ✅ **Set up connection pooling for serverless environments**

## Troubleshooting

### "Can't reach database server"
- Check if your IP is whitelisted (for cloud databases)
- Verify connection string format
- Check if database service is running

### "Schema does not exist"
- Run `npx prisma migrate deploy` or `npx prisma db push`

### "Type 'xxx' is not a valid scalar type"
- Run `npx prisma generate` to regenerate Prisma Client

### Migration conflicts
- In development: `npx prisma migrate reset`
- In production: Resolve conflicts manually or create new migration

## Next Steps After Database Setup

1. ✅ Run initial migration: `npx prisma migrate dev --name init`
2. ✅ Generate Prisma Client: `npx prisma generate`
3. ✅ Test connection by starting the dev server
4. ✅ Create your first user via the registration page
5. ✅ Verify data in Prisma Studio: `npx prisma studio`

## Monitoring & Maintenance

- **Backups**: Set up automated backups through your database provider
- **Monitoring**: Use your provider's dashboard to monitor performance
- **Connection Limits**: Be aware of connection limits on free tiers
- **Indexes**: Current schema has indexes on frequently queried fields

## Production Deployment Checklist

- [ ] Production database created and secured
- [ ] DATABASE_URL environment variable set in production
- [ ] JWT_SECRET is strong and different from development
- [ ] SSL/TLS enabled for database connection
- [ ] Migrations applied: `npx prisma migrate deploy`
- [ ] Database backups configured
- [ ] Connection pooling enabled (if using serverless)
- [ ] IP whitelisting configured (if applicable)
- [ ] Monitoring/alerting set up

## Support

- Prisma Docs: https://www.prisma.io/docs
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
- Neon Docs: https://neon.tech/docs
- Supabase Docs: https://supabase.com/docs
