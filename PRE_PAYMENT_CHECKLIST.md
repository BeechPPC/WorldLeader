# Pre-Payment Integration Checklist

This document outlines all tasks that should be completed before integrating real payment processing (Stripe) into WorldLeader.io.

---

## 1. Email Notification System (Currently Mock)

**Current State**: Emails are only logged to console via `lib/notifications.ts`

**Required Actions**:
- [ ] Choose and configure SMTP service (SendGrid, AWS SES, Postmark, or Resend)
- [ ] Add environment variables for email configuration:
  - `EMAIL_SERVER` - SMTP connection string
  - `EMAIL_FROM` - Sender email address
  - `EMAIL_FROM_NAME` - Sender display name
- [ ] Uncomment and test production email code in `lib/notifications.ts`
- [ ] Enable actual email sending for:
  - Welcome emails on registration
  - Password reset emails (already has template)
  - Overtaken notifications (competitive engagement driver)
- [ ] Test email deliverability and spam scores
- [ ] Add email templates with proper branding
- [ ] Implement email rate limiting to prevent abuse

**Files to Modify**:
- `lib/notifications.ts` (lines 4-10, 44-71, 102-133)
- `.env` and `.env.example`

---

## 2. Transaction Schema Enhancement

**Current State**: Basic transaction tracking without payment gateway integration

**Required Actions**:
- [ ] Add payment-specific fields to Transaction model:
  ```prisma
  model Transaction {
    id                 String            @id @default(cuid())
    userId             String
    amountUsd          Float
    positionsPurchased Int
    timestamp          DateTime          @default(now())
    paymentStatus      TransactionStatus @default(PENDING)

    // NEW FIELDS NEEDED:
    paymentIntentId    String?           @unique  // Stripe payment intent ID
    paymentMethod      String?                    // card, wallet, etc.
    refundStatus       RefundStatus?              // NEW ENUM
    refundedAt         DateTime?
    refundAmount       Float?
    metadata           Json?                      // Payment gateway metadata
    stripeCustomerId   String?                    // For recurring customers

    user               User              @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@index([userId])
    @@index([paymentIntentId])
    @@index([paymentStatus])
  }

  enum RefundStatus {
    NONE
    PARTIAL
    FULL
    PENDING
  }
  ```
- [ ] Create migration for new fields
- [ ] Update `app/api/purchase/route.ts` to handle new fields
- [ ] Add proper transaction status transitions (PENDING → COMPLETED/FAILED)

**Files to Modify**:
- `prisma/schema.prisma`
- `app/api/purchase/route.ts`

---

## 3. Error Handling & Logging

**Current State**: Basic console.error logging only

**Required Actions**:
- [ ] Integrate error tracking service (Sentry, LogRocket, or Datadog)
- [ ] Add comprehensive error logging for:
  - Payment processing failures
  - Database transaction failures
  - Rank calculation errors
  - Authentication failures
- [ ] Create transaction audit log system
- [ ] Add structured logging with context (user ID, transaction ID, etc.)
- [ ] Implement error boundaries in frontend components
- [ ] Add client-side error reporting
- [ ] Create admin dashboard to monitor failed payments
- [ ] Set up error alerting (email/Slack notifications for critical errors)

**Files to Create**:
- `lib/logger.ts` - Centralized logging utility
- `lib/error-tracking.ts` - Error reporting service wrapper
- `app/components/ErrorBoundary.tsx` - React error boundary

**Files to Modify**:
- All API routes (add try-catch with proper logging)
- `app/layout.tsx` (wrap with error boundary)

---

## 4. Testing Infrastructure

**Current State**: No automated tests

**Required Actions**:
- [ ] Set up testing framework (Jest + React Testing Library)
- [ ] Write integration tests for purchase flow:
  - Successful purchase
  - Failed payment handling
  - Concurrent purchases (race conditions)
  - Rank recalculation accuracy
  - Notification sending
- [ ] Write unit tests for:
  - `lib/rankings.ts` - Edge cases (ties, new users, top position)
  - `lib/password-validation.ts`
  - `lib/rate-limit.ts`
  - `lib/auth.ts` - Token generation/verification
- [ ] Add E2E tests for critical flows (Playwright or Cypress):
  - Registration → Purchase → Rank update
  - Password reset flow
  - Concurrent user purchases
- [ ] Test database transaction rollbacks on payment failure
- [ ] Load testing for concurrent purchases

**Files to Create**:
- `__tests__/api/purchase.test.ts`
- `__tests__/lib/rankings.test.ts`
- `__tests__/integration/purchase-flow.test.ts`
- `jest.config.js`
- `playwright.config.ts` (if using Playwright)

**Dependencies to Add**:
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @types/jest ts-jest
npm install -D playwright @playwright/test  # For E2E
```

---

## 5. Legal & Compliance Pages

**Current State**: Basic terms, privacy, disclaimer pages exist

**Required Actions**:
- [ ] Add detailed refund policy section to terms page
- [ ] Add payment processing disclosures:
  - "Payments processed by Stripe"
  - Data sharing with payment processor
  - PCI compliance statement
- [ ] Add tax information handling notice
- [ ] Document geographic restrictions (if any)
- [ ] Add dispute resolution process
- [ ] Create dedicated refund policy page (`app/refund-policy/page.tsx`)
- [ ] Add cookie consent banner (if tracking payment analytics)
- [ ] Review with legal counsel before accepting real payments

**Files to Modify**:
- `app/terms/page.tsx`
- `app/privacy/page.tsx`

**Files to Create**:
- `app/refund-policy/page.tsx`
- Update `app/sitemap.ts` to include refund policy

---

## 6. Rate Limiting Enhancement

**Current State**: In-memory rate limiting (resets on deploy) in `lib/rate-limit.ts`

**Required Actions**:
- [ ] Implement persistent rate limiting using:
  - **Option A**: Redis (Upstash for serverless)
  - **Option B**: Database-backed rate limiting
  - **Option C**: Vercel KV (if on Vercel)
- [ ] Add specific rate limits for purchase endpoint:
  - Max 5 purchases per hour per user
  - Max 10 purchases per day per IP
- [ ] Add fraud detection patterns:
  - Multiple failed payment attempts
  - Rapid succession purchases
  - Unusual payment amounts
- [ ] Implement exponential backoff for failed payments
- [ ] Add rate limit headers to responses
- [ ] Create rate limit bypass for admins/testing

**Files to Create**:
- `lib/rate-limit-redis.ts` (if using Redis)
- `lib/fraud-detection.ts`

**Files to Modify**:
- `app/api/purchase/route.ts` (add stricter rate limiting)
- `.env.example` (add Redis/KV connection string)

**Environment Variables**:
```env
# If using Upstash Redis
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Or Vercel KV
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="..."
```

---

## 7. User Experience Improvements

**Current State**: Basic purchase modal without payment confirmation

**Required Actions**:
- [ ] Add purchase confirmation dialog showing:
  - Amount breakdown
  - Positions to be gained
  - Expected new rank
  - "Are you sure?" confirmation
- [ ] Enhance transaction history on profile page:
  - Add filters (date range, status)
  - Add pagination
  - Add export to CSV option
- [ ] Add comprehensive loading states:
  - Payment processing spinner
  - Disable purchase button during processing
  - Show progress steps (Processing → Updating Ranks → Complete)
- [ ] Improve toast notifications:
  - Payment success with confetti animation
  - Payment failure with retry button
  - Clear error messages (declined card, insufficient funds, etc.)
- [ ] Add purchase history graph/chart on profile
- [ ] Show estimated time to reach #1
- [ ] Add "Quick Purchase" preset buttons ($5, $10, $25, $50)

**Files to Modify**:
- `app/leaderboard/page.tsx` (enhance purchase modal around line 125-150)
- `app/profile/page.tsx` (add filters and pagination to transaction history)

**Files to Create**:
- `app/components/PurchaseConfirmation.tsx`
- `app/components/PaymentLoadingState.tsx`

**Dependencies to Add**:
```bash
npm install canvas-confetti  # For success animations
npm install recharts         # For transaction history charts
```

---

## 8. Database Migration Preparation

**Current State**: Two migrations (init + password reset tokens)

**Required Actions**:
- [ ] Create comprehensive migration for payment fields:
  ```bash
  npx prisma migrate dev --name add_payment_gateway_fields
  ```
- [ ] Add webhook event log table:
  ```prisma
  model WebhookEvent {
    id              String   @id @default(cuid())
    eventType       String
    payload         Json
    processed       Boolean  @default(false)
    processedAt     DateTime?
    stripeEventId   String   @unique
    createdAt       DateTime @default(now())

    @@index([eventType, processed])
    @@index([stripeEventId])
  }
  ```
- [ ] Add payment method table for saved cards (future):
  ```prisma
  model PaymentMethod {
    id                String   @id @default(cuid())
    userId            String
    stripePaymentMethodId String @unique
    cardBrand         String?
    cardLast4         String?
    isDefault         Boolean  @default(false)
    createdAt         DateTime @default(now())
    user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@index([userId])
  }
  ```
- [ ] Add indexes for payment-related queries
- [ ] Test migration on staging database first
- [ ] Create rollback plan

**Files to Modify**:
- `prisma/schema.prisma`

---

## 9. Environment Configuration

**Current State**: Basic env vars in `.env.example`

**Required Actions**:
- [ ] Add all Stripe environment variables to `.env.example`:
  ```env
  # Stripe Configuration
  STRIPE_SECRET_KEY="sk_test_xxxxx"              # Test key for development
  STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"          # Test public key
  STRIPE_WEBHOOK_SECRET="whsec_xxxxx"             # Webhook signing secret

  # Production keys (set in Vercel/hosting)
  # STRIPE_SECRET_KEY="sk_live_xxxxx"
  # STRIPE_PUBLISHABLE_KEY="pk_live_xxxxx"
  # STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"  # Exposed to frontend
  ```
- [ ] Document Stripe dashboard setup steps in README
- [ ] Set up separate Stripe accounts for test/production
- [ ] Configure webhook endpoints in Stripe dashboard:
  - Development: Use Stripe CLI or ngrok
  - Production: `https://worldleader.io/api/webhooks/stripe`
- [ ] Add environment validation on startup
- [ ] Create `.env.development` and `.env.production` templates

**Files to Modify**:
- `.env.example`
- `README.md` (add Stripe setup section)

**Files to Create**:
- `lib/env.ts` (environment variable validation)

---

## 10. Security Enhancements

**Current State**: Basic security (JWT auth, password hashing, rate limiting)

**Required Actions**:
- [ ] Add CSRF protection for payment endpoints:
  - Generate CSRF tokens
  - Validate tokens on payment requests
- [ ] Implement idempotency keys for purchases:
  - Prevent duplicate charges if user clicks twice
  - Store idempotency key in Transaction model
- [ ] Add webhook signature verification:
  - Verify Stripe webhook signatures
  - Reject unsigned/invalid webhooks
- [ ] Sanitize all payment-related inputs (Zod validation already in place)
- [ ] Add IP logging for payment attempts:
  - Store IP address with transactions
  - Flag suspicious patterns
- [ ] Implement Content Security Policy (CSP) headers
- [ ] Add request origin validation
- [ ] Encrypt sensitive transaction metadata
- [ ] Add two-factor authentication for high-value purchases (optional)
- [ ] Implement spending limits per day/week

**Files to Create**:
- `lib/csrf.ts` - CSRF token generation/validation
- `lib/idempotency.ts` - Idempotency key handling
- `app/api/webhooks/stripe/route.ts` - Stripe webhook handler

**Files to Modify**:
- `prisma/schema.prisma` (add ipAddress and idempotencyKey to Transaction)
- `app/api/purchase/route.ts` (add security checks)
- `next.config.ts` (add security headers)

**Security Headers to Add**:
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'payment=(self)' },
        ],
      },
    ]
  },
}
```

---

## Implementation Priority

### Phase 1: Critical (Must Complete Before Payment Integration)
1. ✅ Database schema updates (Transaction model enhancements)
2. ✅ Webhook event logging table
3. ✅ Environment configuration for Stripe
4. ✅ Security enhancements (CSRF, idempotency, webhook verification)
5. ✅ Error logging infrastructure
6. ✅ Rate limiting with persistence

### Phase 2: High Priority (Complete Before Launch)
7. ✅ Email notification system
8. ✅ Enhanced error handling and monitoring
9. ✅ Payment confirmation UX
10. ✅ Integration tests for purchase flow
11. ✅ Legal compliance (refund policy, payment disclosures)

### Phase 3: Important (Complete Within First Week)
12. ✅ Admin monitoring dashboard
13. ✅ Transaction history enhancements
14. ✅ Fraud detection patterns
15. ✅ Load testing

### Phase 4: Nice to Have (Post-Launch)
16. Real-time WebSocket updates
17. Achievement system
18. Referral program
19. Two-factor authentication
20. Saved payment methods

---

## Testing Checklist Before Going Live

- [ ] Test successful payment with test card
- [ ] Test declined payment (use Stripe test cards)
- [ ] Test webhook delivery and processing
- [ ] Test concurrent purchases (race conditions)
- [ ] Test rank recalculation accuracy
- [ ] Test notification emails are sent
- [ ] Test refund processing
- [ ] Test rate limiting kicks in
- [ ] Test fraud detection triggers
- [ ] Test on mobile devices
- [ ] Test with slow network connection
- [ ] Load test with 100+ concurrent users
- [ ] Verify all error scenarios show user-friendly messages
- [ ] Verify all transactions are logged
- [ ] Verify no sensitive data in logs
- [ ] Test backup/restore procedures

---

## Useful Resources

### Stripe Documentation
- [Stripe Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)

### Security Best Practices
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Stripe Security Best Practices](https://stripe.com/docs/security/guide)
- [PCI Compliance](https://www.pcisecuritystandards.org/)

### Testing Resources
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)

---

## Notes

- All payment processing should happen server-side only
- Never expose `STRIPE_SECRET_KEY` to the frontend
- Always verify webhook signatures to prevent spoofing
- Log all payment attempts for audit trail
- Implement graceful degradation if payment gateway is down
- Have a rollback plan for failed deployments
- Monitor payment success rates and alert on anomalies

---

**Last Updated**: 2025-10-28

**Status**: Pre-payment integration phase - Real payments NOT yet enabled
