# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WorldLeader.io is a competitive leaderboard web app where users purchase positions ($1 = 1 position) to climb continental and global rankings. Built with Next.js 16, React 19, TypeScript, Prisma ORM, and PostgreSQL.

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build (prisma generate + next build)
npm run lint             # ESLint
npm run db:migrate       # Run Prisma migrations (dev)
npm run db:migrate:deploy # Deploy migrations to production
npm run db:generate      # Regenerate Prisma client
npm run db:studio        # Prisma Studio GUI
npm run db:seed          # Seed database (tsx prisma/seed.ts)
npm run db:push          # Push schema without migration
```

## Architecture

### Tech Stack
- **Frontend**: React 19 + Next.js 16 (App Router) + Tailwind CSS 4
- **Backend**: Next.js API Routes (`app/api/`)
- **Database**: PostgreSQL (Neon serverless) via Prisma 6; SQLite for local dev
- **Auth**: JWT (jose) in HTTP-only cookies, bcrypt password hashing
- **Email**: Resend API with branded HTML templates
- **Payments**: Stripe Checkout (redirect-based) — Stripe hosts the payment page
- **Validation**: Zod schemas in API routes

### Key Directories
- `app/api/` — API routes (auth, leaderboard, checkout, webhooks, profile, health)
- `lib/` — Shared utilities (auth, db, email, rankings, rate-limit, stripe, purchase, countries, password-validation, password-reset)
- `prisma/` — Schema, migrations, seed file

### Core Domain Logic

**Ranking system** (`lib/rankings.ts`): Rankings recalculate after every purchase. Continental rank = position within continent by `totalPositionsPurchased`. Global rank = position across all users. Tie-breaker: earlier `createdAt` wins. All rank updates execute in a single Prisma `$transaction`.

**Authentication** (`lib/auth.ts`): JWT tokens (7-day expiry, HS256) stored in HTTP-only secure cookies. `getCurrentUser()` extracts user from the `auth-token` cookie. Password hashing uses bcrypt with 12 rounds. Password reset uses random tokens with 1-hour expiry.

**Purchase flow** (Stripe Checkout): User clicks "Pay with Stripe" → `POST /api/checkout` creates a PENDING transaction + Stripe Checkout session → user redirects to Stripe-hosted payment page → on success, Stripe sends a webhook to `POST /api/webhooks/stripe` → `fulfillPurchase()` (`lib/purchase.ts`) marks transaction COMPLETED, increments positions, recalculates rankings, and sends overtaken notifications → user lands on `/purchase/success` which polls `/api/checkout/status` until COMPLETED.

**Email** (`lib/email.ts`): Resend-based email system with templates for welcome, password reset, and overtaken notifications. Gracefully degrades to console logging when `RESEND_API_KEY` is not set.

**Rate limiting** (`lib/rate-limit.ts`): In-memory IP-based rate limiting with per-endpoint configuration. Resets on server restart — needs Redis/KV for production persistence.

### Database Schema (Prisma)
Three models: `User`, `Transaction`, `Notification`. The `User` model tracks `totalPositionsPurchased`, `currentContinentRank`, and `currentGlobalRank`. `Continent` enum: AFRICA, ASIA, EUROPE, NORTH_AMERICA, SOUTH_AMERICA, OCEANIA, ANTARCTICA.

### Frontend Patterns
- Pages use `'use client'` directive for interactivity
- `react-hot-toast` for user notifications
- Dark theme with custom animations defined in `app/globals.css` (blob, float, gradient, fade-in)
- Geist font family via Google Fonts

## Environment Variables

Required: `DATABASE_URL`, `JWT_SECRET` (≥32 chars), `NEXT_PUBLIC_APP_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
Optional: `RESEND_API_KEY`, `EMAIL_FROM`

## Current Status

Payment processing uses Stripe Checkout. Next phase involves persistent rate limiting (Redis), error tracking (Sentry), and an admin dashboard. See `PRE_PAYMENT_CHECKLIST.md` for details.
