# WorldLeader.io - Troubleshooting Guide

## Common Issues and Solutions

### 1. TypeScript Error: Module has no exported member 'Continent'

**Error:**
```
Type error: Module '"@prisma/client"' has no exported member 'Continent'.
```

**Cause:** Prisma client needs to be regenerated after schema changes or fresh install.

**Solution:**
```bash
npx prisma generate
```

This regenerates the Prisma client with all TypeScript types from your schema.

---

### 2. TypeScript Error: Property 'errors' does not exist on type 'ZodError'

**Error:**
```
Type error: Property 'errors' does not exist on type 'ZodError<unknown>'.
```

**Cause:** Zod uses `issues` not `errors` for validation errors.

**Solution:** Change error handling from:
```typescript
error.errors  // ❌ Wrong
```
to:
```typescript
error.issues  // ✅ Correct
```

---

### 3. Database Connection Issues

**Error:**
```
PrismaClientInitializationError: Can't reach database server
```

**Solutions:**

1. **Check DATABASE_URL in .env:**
   ```bash
   cat .env | grep DATABASE_URL
   ```
   Should be: `DATABASE_URL="file:./dev.db"`

2. **Reset database:**
   ```bash
   npx prisma migrate reset
   npx prisma migrate dev
   ```

3. **Regenerate Prisma client:**
   ```bash
   npx prisma generate
   ```

---

### 4. Port Already in Use

**Error:**
```
Port 3000 is already in use
```

**Solution:**

Next.js automatically uses the next available port (3001, 3002, etc.). Check the terminal output for the actual URL:
```
- Local:        http://localhost:3001
```

Or manually kill the process:
```bash
# Find process using port 3000
lsof -ti:3000

# Kill it
kill -9 $(lsof -ti:3000)

# Then restart
npm run dev
```

---

### 5. Module Not Found Errors

**Error:**
```
Module not found: Can't resolve '@/lib/db'
```

**Solutions:**

1. **Check tsconfig.json has path alias:**
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

2. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

---

### 6. Authentication Issues - JWT Errors

**Error:**
```
JWTInvalid: Invalid Compact JWS
```

**Solutions:**

1. **Check JWT_SECRET in .env:**
   ```bash
   cat .env | grep JWT_SECRET
   ```

2. **Clear cookies in browser:**
   - Open DevTools → Application → Cookies
   - Delete 'auth-token' cookie

3. **Ensure JWT_SECRET is at least 32 characters**

---

### 7. Prisma Migration Errors

**Error:**
```
Migration failed to apply
```

**Solutions:**

1. **Reset database (development only):**
   ```bash
   npx prisma migrate reset
   ```

2. **Delete migration and recreate:**
   ```bash
   rm -rf prisma/migrations
   npx prisma migrate dev --name init
   ```

3. **Check schema syntax:**
   ```bash
   npx prisma format
   npx prisma validate
   ```

---

### 8. Build Failures

**Error:**
```
Failed to compile
```

**Solutions:**

1. **Check TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

2. **Clear cache and rebuild:**
   ```bash
   rm -rf .next
   rm -rf node_modules
   npm install
   npm run build
   ```

3. **Check for missing dependencies:**
   ```bash
   npm install
   ```

---

### 9. Environment Variables Not Loading

**Problem:** .env variables not accessible

**Solutions:**

1. **Ensure .env file exists:**
   ```bash
   ls -la .env
   ```

2. **Restart dev server** (required after .env changes)
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

3. **For client-side variables, use NEXT_PUBLIC_ prefix:**
   ```
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

---

### 10. Ranking Calculation Issues

**Problem:** Ranks not updating correctly

**Solutions:**

1. **Manually trigger recalculation:**
   - Make a purchase (triggers recalculateRankings)
   - Or add a manual recalculation endpoint

2. **Check database state:**
   ```bash
   npx prisma studio
   ```
   - Opens GUI to view/edit database
   - Check totalPositionsPurchased values

3. **Reset test data:**
   ```bash
   npx prisma migrate reset
   ```

---

### 11. CSS Not Loading / Styling Issues

**Problem:** Styles not applying

**Solutions:**

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Check Tailwind config:**
   ```bash
   cat tailwind.config.ts
   ```

3. **Clear browser cache:**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

---

### 12. Git Push Rejected

**Error:**
```
! [rejected] main -> main (fetch first)
```

**Solution:**

1. **Pull first, then push:**
   ```bash
   git pull origin main
   # Resolve any conflicts
   git push origin main
   ```

2. **Or force push (use carefully!):**
   ```bash
   git push --force origin main
   ```

---

## Quick Diagnostic Commands

### Check Everything is Working
```bash
# 1. Check dependencies
npm list --depth=0

# 2. Check Prisma
npx prisma validate
npx prisma generate

# 3. Check TypeScript
npx tsc --noEmit

# 4. Test build
npm run build

# 5. Start dev server
npm run dev
```

### Fresh Start (Nuclear Option)
```bash
# Stop dev server (Ctrl+C)

# Clean everything
rm -rf node_modules
rm -rf .next
rm -rf prisma/dev.db

# Reinstall
npm install
npx prisma migrate dev
npx prisma generate

# Restart
npm run dev
```

---

## Logs and Debugging

### View Console Logs
Email notifications (MVP) are logged to the terminal where `npm run dev` is running.

### Browser DevTools
- **Console**: See client-side errors
- **Network**: Check API requests/responses
- **Application**: View cookies and localStorage

### Server Logs
All API routes log errors with `console.error()`. Check the terminal running `npm run dev`.

---

## When to Ask for Help

If you've tried the above and still have issues:

1. **Check the error message carefully** - it usually tells you exactly what's wrong
2. **Search the error on Google/Stack Overflow**
3. **Check the docs:**
   - Next.js: https://nextjs.org/docs
   - Prisma: https://www.prisma.io/docs
   - Zod: https://zod.dev
4. **Review GIT_WORKFLOW.md** for Git-related issues

---

## Preventive Measures

### Before Committing
```bash
# Run these checks
npm run build      # Ensure it builds
git status         # Review changes
git diff           # See what changed
```

### After Pulling
```bash
npm install                 # Update dependencies
npx prisma generate        # Update Prisma client
npm run dev                # Test locally
```

### Regular Maintenance
```bash
# Update dependencies (weekly/monthly)
npm update

# Clean old builds
rm -rf .next

# Optimize database (if large)
npx prisma db push --force-reset
```

---

**Last Updated:** October 27, 2025

Keep this guide handy for quick reference when issues arise!
