# WorldLeader.io — Launch TODO

## Must-do before launch

- [ ] **Stripe production keys** — Switch from `sk_test_` to `sk_live_`, create webhook endpoint in Stripe dashboard pointing to `https://yourdomain.com/api/webhooks/stripe`
- [ ] **Legal pages** — Update terms/privacy with payment disclosures ("Payments processed by Stripe"), add refund policy page, dispute resolution process
- [ ] **Security headers** — Add `X-Frame-Options`, `X-Content-Type-Options`, CSP headers in `next.config.ts`

## High priority (before or shortly after launch)

- [x] **Persistent rate limiting** — Upstash Redis with automatic in-memory fallback (set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`)
- [x] **Error monitoring** — Sentry integrated with error boundaries, instrumentation hook, and `captureException` in all critical catch blocks (set `NEXT_PUBLIC_SENTRY_DSN`)
- [x] **Declined payment hardening** — Cancel page (`/purchase/cancel`), cleanup cron (every 6h), `async_payment_failed` webhook handler, retry button on failure states

## Engagement features

- [x] **Public leaderboard** — Removed auth gate so visitors can browse the full leaderboard without logging in; shows Login/Join CTA for unauthenticated users
- [x] **Live activity ticker** — Scrolling ticker on homepage and leaderboard showing recent purchases (`/api/activity`), polls every 20s
- [x] **Real-time leaderboard polling** — 30s auto-refresh with visibility pause, rank change detection with animated up/down arrows
- [x] **Smart purchase preview** — Debounced preview in purchase modal showing predicted ranks and users you'd overtake (`/api/leaderboard/preview`)
- [x] **Share your rank** — Public profile pages (`/u/[username]`), dynamic OG images (`/api/og/[username]`), share modal on leaderboard, share button on profile
- [x] **In-app notification bell** — Header bell icon with unread count + dropdown (`/api/notifications`, `NotificationBell` component, 30s polling, mark-as-read)
- [x] **Achievement badges** — 7 badge tiers shown on leaderboard, profile, and public profiles (`lib/badges.ts`, `/api/badges/[username]`)
- [x] **"Someone's catching up" alerts** — Continental catching-up notifications when gap is ≤5 positions, 24h dedup
- [x] **Homepage stats from real data** — Real DB stats via `/api/stats` with animated count-up

## Nice to have

- [x] **UX polish** — Quick purchase presets ($5, $10, $25, $50), confetti on success page, improved transaction history on profile
- [x] **Testing infrastructure** — Vitest with 50 unit tests across 8 files covering badges, auth, rankings, purchase flow, admin, and API routes (`npm test`)
- [x] **Admin dashboard** — Role-based admin system (`lib/admin.ts`), dashboard with revenue chart, transaction table with filters, user search (`/admin`), promote script (`npm run db:promote-admin`)
- [x] **"Battle log" on profile** — RankEvent model tracks overtakes, battle log on profile page and public profiles (`/api/profile/battle-log`, `/api/battle-log/[username]`)
- [ ] **Seasonal resets or events** — e.g. "February Sprint: double positions this weekend"
