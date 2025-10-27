# WorldLeader.io

**Climb your continent. Conquer the world.**

WorldLeader.io is a competitive leaderboard web application where users buy their way up rankings, competing on their continent and globally to become the ultimate World Leader.

## Features

- User authentication with JWT tokens
- 7 continental leaderboards (Africa, Asia, Europe, North America, South America, Oceania, Antarctica)
- Global leaderboard aggregating all continents
- Position climbing system ($1 USD = 1 position)
- Real-time rank updates
- Email notifications when overtaken (console logging in MVP)
- Mobile-responsive design
- Dark mode theme with world map background

## Tech Stack

- **Frontend**: React 19, Next.js 16, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: JWT with jose library
- **Email**: Nodemailer (console logging for MVP)

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

The `.env` file contains:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production-min-32-chars-long"
EMAIL_SERVER="smtp://user:pass@smtp.example.com:587"
EMAIL_FROM="noreply@worldleader.io"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Note**: For production, change the JWT_SECRET to a secure random string and configure real SMTP settings for email notifications.

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

## Future Enhancements (Phase 2+)

- [ ] Stripe payment integration
- [ ] Real email notifications via SMTP
- [ ] In-app notification system with bell icon
- [ ] User profile pages
- [ ] Achievement badges
- [ ] Transaction history
- [ ] Leaderboard position change animations
- [ ] WebSocket for real-time updates
- [ ] Admin dashboard
- [ ] PostgreSQL for production scalability

## Development Notes

### MVP Shortcuts
- Payment processing is simulated (always successful)
- Email notifications logged to console instead of sent
- SQLite database (switch to PostgreSQL for production)
- No rate limiting or fraud protection yet

### Production Checklist
- [ ] Change JWT_SECRET to secure random value
- [ ] Configure real SMTP server
- [ ] Switch to PostgreSQL
- [ ] Add rate limiting
- [ ] Implement Stripe for payments
- [ ] Add error tracking (Sentry)
- [ ] Set up monitoring
- [ ] Configure proper CORS
- [ ] Add input sanitization
- [ ] Implement CSRF protection

## License

MIT

---

**WorldLeader.io** - Your position. The world's watching.
