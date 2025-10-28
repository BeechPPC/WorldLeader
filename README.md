# WorldLeader.io

**Climb your continent. Conquer the world.**

WorldLeader.io is a competitive leaderboard web application where users buy their way up rankings, competing on their continent and globally to become the ultimate World Leader.

## Features

- User authentication with JWT tokens and secure password reset
- 7 continental leaderboards (Africa, Asia, Europe, North America, South America, Oceania, Antarctica)
- Global leaderboard aggregating all continents
- Position climbing system ($1 USD = 1 position)
- Real-time rank updates
- **Production email notifications** (Resend):
  - Welcome emails on registration
  - Password reset emails
  - Overtaken notifications when someone passes you
  - In-app notification feed
- User profile dashboard with stats and transaction history
- Mobile-responsive design with visual rank cards and Olympic podium
- Dark mode theme with gradient backgrounds and global imagery

## Tech Stack

- **Frontend**: React 19, Next.js 16, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon) via Prisma ORM
- **Authentication**: JWT with jose library, bcrypt password hashing
- **Email**: Resend API (transactional emails with branded templates)
- **Hosting**: Vercel (serverless)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
npx prisma migrate dev
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to the URL shown in terminal (likely http://localhost:3000 or http://localhost:3001)

## Environment Variables

The `.env` file should contain:

```env
# Database (use PostgreSQL for production)
DATABASE_URL="postgresql://username:password@host:5432/database"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-secret-key-change-in-production-min-32-chars-long"

# Email (Resend API)
RESEND_API_KEY="re_xxxxx"
EMAIL_FROM="WorldLeader.io <onboarding@resend.dev>"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Production Setup**:
- Use PostgreSQL (Neon, Vercel Postgres, or Supabase)
- Generate secure JWT_SECRET: `openssl rand -base64 32`
- Get Resend API key from [resend.com](https://resend.com) (free tier: 3,000 emails/month)
- See `EMAIL_SETUP_GUIDE.md` for detailed email configuration

## Project Structure

```
WorldLeader/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── leaderboard/  # Leaderboard data
│   │   └── purchase/     # Position purchase
│   ├── leaderboard/      # Leaderboard page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── lib/
│   ├── auth.ts           # Authentication utilities
│   ├── countries.ts      # Country/continent data
│   ├── db.ts             # Database client
│   ├── notifications.ts  # Email notification system
│   └── rankings.ts       # Ranking calculation engine
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
└── public/               # Static assets
```

## How It Works

1. **Registration**: Users sign up with email, username, password, continent, and country
2. **Starting Position**: New users start at the bottom of their continental leaderboard
3. **Climbing**: Users purchase positions to move up ($1 = 1 position)
4. **Continental Rankings**: Users compete within their continent
5. **Global Rankings**: All users are ranked globally based on total positions purchased
6. **Notifications**: Users receive emails when someone overtakes them (console logged in MVP)

## Key Features

### Landing Page
- Hero section with branding and taglines
- Live preview of top 10 world leaders
- "How It Works" section
- Call-to-action buttons

### Registration
- Email and password authentication
- Continent selection (7 continents)
- Country selection (dynamic based on continent)
- Auto-assignment to bottom of continent leaderboard

### Leaderboard
- Tabbed interface for each continent + worldwide view
- User stats card showing current ranks
- Highlighted current user row
- Crown/medal icons for top 3 positions
- Country flags using emoji

### Purchase System
- Modal for purchasing positions
- Amount input with live preview
- Simulated payment (always successful for MVP)
- Real-time rank updates after purchase
- Automatic notifications to overtaken users

## Database Schema

### Users
- id, username, email, password (hashed)
- continent, countryCode
- totalPositionsPurchased (private)
- currentContinentRank, currentGlobalRank
- timestamps

### Transactions
- id, userId, amountUsd, positionsPurchased
- paymentStatus (PENDING/COMPLETED/FAILED)
- timestamp

### Notifications
- id, userId, message, readStatus
- createdAt

## Ranking System

- Rankings are recalculated after every purchase
- Continental rank: based on positions purchased within that continent
- Global rank: based on total positions purchased across all users
- Tie-breaker: Earlier registration = higher rank
- Cap at position #1 (can't buy past #1)

## Current Implementation Status

### ✅ Completed Features
- [x] User authentication with JWT and secure password hashing
- [x] 7 continental + global leaderboards
- [x] Visual leaderboard with Olympic podium for top 3
- [x] User profile dashboard with stats and transaction history
- [x] Real email notifications (Resend integration)
- [x] Password reset flow with secure tokens
- [x] Rate limiting on auth endpoints
- [x] Password strength validation
- [x] In-app notification feed
- [x] PostgreSQL database (Neon)
- [x] Mobile-responsive design
- [x] SEO optimization (metadata, sitemap, robots.txt)

### 🚧 Next Phase (Payment Integration)
- [ ] Stripe payment integration
- [ ] Enhanced transaction security (idempotency, CSRF protection)
- [ ] Webhook event handling
- [ ] Error tracking and monitoring
- [ ] Email rate limiting with persistence
- [ ] Fraud detection patterns
- [ ] Admin dashboard

See `PRE_PAYMENT_CHECKLIST.md` for detailed payment integration tasks.

## Development Notes

### Current Status
- **Email System**: ✅ Production-ready with Resend (3,000 emails/month free)
- **Database**: ✅ PostgreSQL (Neon serverless)
- **Hosting**: ✅ Vercel with automatic deployments
- **Payment Processing**: ⚠️ Simulated (always successful) - Stripe integration pending
- **Rate Limiting**: ⚠️ In-memory (resets on deploy) - Needs Redis/KV for production

### Production Checklist
- [x] Secure JWT_SECRET configured
- [x] Real email service (Resend)
- [x] PostgreSQL database
- [x] Basic rate limiting
- [x] Password strength validation
- [ ] Stripe payment integration
- [ ] Persistent rate limiting (Redis/Upstash)
- [ ] Error tracking (Sentry)
- [ ] Webhook signature verification
- [ ] CSRF protection for payments

## License

MIT

---

**WorldLeader.io** - Your position. The world's watching.
