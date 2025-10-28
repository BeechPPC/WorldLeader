# Email Notification System Setup Guide

WorldLeader.io now has a complete email notification system powered by **Resend**. This guide will help you configure it for production use.

---

## Overview

The email system sends professional, branded emails for:
- **Welcome Emails** - When users register
- **Password Reset** - When users request password resets
- **Overtaken Notifications** - When someone climbs past a user on the leaderboard
- **Milestone Achievements** - When users reach Top 10, Top 5, Top 3, or #1 (ready for future use)

---

## Setup Steps

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up for a free account
2. You get **3,000 emails per month free** - perfect for getting started
3. Verify your email address

### 2. Get Your API Key

1. Log into your Resend dashboard
2. Navigate to **API Keys** section
3. Click **Create API Key**
4. Give it a name like "WorldLeader Production"
5. Copy the API key (starts with `re_...`)

### 3. Configure Environment Variables

Add the following to your `.env` file:

```env
# Email Configuration
RESEND_API_KEY="re_your_actual_key_here"
EMAIL_FROM="WorldLeader.io <onboarding@resend.dev>"
NEXT_PUBLIC_APP_URL="https://world-leader.vercel.app"
```

**For Vercel:**
1. Go to your project settings in Vercel
2. Navigate to **Environment Variables**
3. Add:
   - `RESEND_API_KEY` with your Resend API key
   - `EMAIL_FROM` with `WorldLeader.io <onboarding@resend.dev>`
   - Ensure `NEXT_PUBLIC_APP_URL` is set to your production URL

### 4. Using Resend's Default Domain (Quick Start)

For testing and initial launch, you can use Resend's default sending domain:
- **From address**: `onboarding@resend.dev`
- No DNS configuration needed
- Emails work immediately
- Perfect for development and MVP launch

**Note**: Emails sent from `resend.dev` may have slightly lower deliverability than a custom domain, but it's excellent for getting started quickly.

### 5. Setting Up a Custom Domain (Recommended for Production)

For better branding and deliverability, set up your own domain:

#### Step 1: Add Domain to Resend
1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `worldleader.io`)

#### Step 2: Configure DNS Records
Resend will provide DNS records to add to your domain. You need to add:
- **SPF Record** (TXT)
- **DKIM Record** (TXT)
- **DMARC Record** (TXT)
- **MX Record** (optional, for tracking bounces)

Example DNS records (yours will be different):
```
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all

Type: TXT
Name: resend._domainkey
Value: [Resend will provide this]

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@worldleader.io
```

#### Step 3: Verify Domain
1. Wait 24-48 hours for DNS propagation
2. In Resend dashboard, click **Verify Domain**
3. Once verified, update your environment variable:

```env
EMAIL_FROM="WorldLeader.io <noreply@worldleader.io>"
```

---

## Email Templates Included

### 1. Welcome Email
**Sent when**: User registers
**Features**:
- Personalized greeting
- Continental assignment info
- Starting rank display
- "How It Works" section
- Call-to-action button

### 2. Password Reset Email
**Sent when**: User requests password reset
**Features**:
- Secure reset link (expires in 1 hour)
- Clear instructions
- Security tips
- One-time use token

### 3. Overtaken Notification
**Sent when**: Another user climbs past them on the leaderboard
**Features**:
- Shows who overtook them
- Displays new rank
- Shows positions lost
- Competitive call-to-action
- Creates urgency to fight back

### 4. Milestone Achievement (Future Use)
**Sent when**: User reaches Top 10, Top 5, Top 3, or #1
**Features**:
- Celebratory design
- Rank badge display
- Personalized message
- Social sharing potential

---

## Email Design Features

All emails include:
- **Consistent branding** - WorldLeader.io colors and styling
- **Mobile-responsive** - Looks great on all devices
- **Dark theme** - Matches the app's aesthetic
- **Gradient backgrounds** - Beautiful blue-to-purple gradients
- **Emoji icons** - Adds visual interest and personality
- **Clear CTAs** - Prominent buttons for key actions
- **Footer links** - Quick access to Profile, Leaderboard, Terms

---

## Testing Emails

### Local Development Testing

1. Set up your `.env` file with Resend API key
2. Start the development server: `npm run dev`
3. Test registration: Go to `/register` and create an account
   - Check your email inbox for welcome email
4. Test password reset: Go to `/forgot-password`
   - Check your email inbox for reset link
5. Test overtaken notification: Have two users, one purchases positions
   - Check email of the user who was overtaken

### Using Resend's Email Logs

1. Log into Resend dashboard
2. Go to **Emails** section
3. See all sent emails with:
   - Delivery status
   - Open rates (if enabled)
   - Click rates
   - Bounce information

---

## Email Deliverability Best Practices

### 1. Warm Up Your Domain
If using a custom domain:
- Start with low volume (10-20 emails/day)
- Gradually increase over 2-3 weeks
- This builds sender reputation

### 2. Monitor Bounce Rates
- Keep bounce rate under 5%
- Remove invalid email addresses
- Use double opt-in for signups (optional)

### 3. Engagement
- High open rates improve deliverability
- Compelling subject lines
- Personalized content

### 4. Avoid Spam Triggers
- Don't use ALL CAPS in subject lines
- Avoid excessive exclamation marks!!!!
- Include unsubscribe link (for marketing emails)
- Our transactional emails are exempt from CAN-SPAM

---

## Troubleshooting

### Emails Not Sending

**Check 1: API Key**
```bash
# Verify environment variable is set
echo $RESEND_API_KEY
```

**Check 2: Resend Dashboard**
- Check "Emails" tab for error messages
- Look for "Failed" status

**Check 3: Server Logs**
- Development: Check terminal for email logs
- Production: Check Vercel logs for errors

**Common Errors:**
- `401 Unauthorized` - Invalid API key
- `403 Forbidden` - Domain not verified (if using custom domain)
- `422 Validation Error` - Invalid email address format

### Emails Going to Spam

**Solutions:**
1. Set up custom domain with proper DNS records
2. Enable DMARC reporting
3. Avoid spam trigger words
4. Include physical address in footer (for marketing emails)
5. Authenticate your domain (SPF, DKIM, DMARC)

### Rate Limiting

Resend free tier limits:
- **3,000 emails/month**
- **100 emails/day** per sending domain

If you exceed limits:
- Upgrade to paid plan ($20/month for 50,000 emails)
- Or implement email queuing to spread sends over time

---

## Code Structure

### Main Email Service
**File**: `lib/email.ts`
- All email templates
- Resend integration
- Shared email wrapper with branding

### Email Functions:
- `sendWelcomeEmail(email, username, continent, rank)`
- `sendPasswordResetEmail(email, username, token)`
- `sendOvertakenEmail(email, username, overtakenBy, continent, newRank, positionsLost)`
- `sendMilestoneEmail(email, username, milestone, rank, continent)`

### Integration Points:
- **Registration**: `app/api/auth/register/route.ts` (line 113)
- **Password Reset**: `lib/password-reset.ts` (line 38)
- **Purchase/Overtaken**: `app/api/purchase/route.ts` (line 112)

---

## Monitoring & Analytics

### Track Email Performance

Resend provides built-in analytics:
- **Delivery Rate** - % of emails that were delivered
- **Open Rate** - % of emails opened (requires tracking pixel)
- **Click Rate** - % of links clicked
- **Bounce Rate** - % of emails that bounced

### Add Custom Tracking (Optional)

You can add UTM parameters to links:
```typescript
const url = `${APP_URL}/leaderboard?utm_source=email&utm_medium=overtaken&utm_campaign=engagement`
```

Track in Google Analytics or your preferred tool.

---

## Upgrade Path

### Current Setup (MVP)
- ✅ Resend free tier (3,000 emails/month)
- ✅ Default sending domain (`resend.dev`)
- ✅ All transactional emails enabled
- ✅ Beautiful branded templates

### Growth Stage (1,000+ users)
- 🔄 Custom domain setup
- 🔄 Paid Resend plan ($20/month)
- 🔄 Email analytics tracking
- 🔄 A/B test subject lines

### Scale Stage (10,000+ users)
- 🔄 Dedicated IP address
- 🔄 Advanced segmentation
- 🔄 Email preference center
- 🔄 Automated milestone emails

---

## Cost Breakdown

### Resend Pricing
- **Free**: 3,000 emails/month, 100/day
- **Pro**: $20/month for 50,000 emails, 1,000/day
- **Business**: $100/month for 500,000 emails, 10,000/day

### Estimated Usage
Based on 1,000 active users:
- Welcome emails: ~100/month (new signups)
- Password resets: ~50/month
- Overtaken notifications: ~300/month (highly competitive users)
- **Total**: ~450 emails/month = **FREE TIER** ✅

At 10,000 users:
- Estimated: ~4,500 emails/month
- **Pro Plan needed** ($20/month)

---

## Security Considerations

### Email Security Features ✅

1. **Token-based password resets**
   - Secure random tokens (32 bytes)
   - 1-hour expiration
   - One-time use only

2. **Rate limiting**
   - Password reset: 3 requests/hour
   - Registration: 3 attempts/15 minutes
   - Prevents abuse

3. **User enumeration protection**
   - Always returns success message
   - Doesn't reveal if email exists

4. **No sensitive data in emails**
   - Never include passwords
   - Only include public profile info
   - Reset links expire quickly

---

## Support & Resources

### Resend Resources
- [Documentation](https://resend.com/docs)
- [API Reference](https://resend.com/docs/api-reference)
- [Status Page](https://status.resend.com)
- [Support](https://resend.com/support)

### WorldLeader.io Email Support
- Check `EMAIL_SETUP_GUIDE.md` (this file)
- Review `PRE_PAYMENT_CHECKLIST.md` for email-related tasks
- See `lib/email.ts` for template customization

---

## Next Steps

1. **Immediate**: Set up Resend account and add API key to Vercel
2. **This Week**: Test all email flows in production
3. **This Month**: Monitor delivery rates and user engagement
4. **Next Quarter**: Set up custom domain for better branding

---

**Last Updated**: 2025-10-28

**Status**: ✅ Email system fully implemented and ready for production
