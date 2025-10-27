# WorldLeader.io - Quick Start Guide

## 🚀 Get Started in 5 Minutes

The development server is already running at **http://localhost:3001**

### Test the Application

1. **Visit the Landing Page**
   - Open http://localhost:3001 in your browser
   - You'll see the WorldLeader.io hero page with branding

2. **Register a New User**
   - Click "Join the Competition" button
   - Fill in the registration form:
     - Email: test@example.com
     - Username: testuser
     - Password: password123
     - Continent: Select any continent (e.g., North America)
     - Country: Select your country (e.g., United States)
   - Click "Start Your Climb"
   - You'll be automatically logged in and redirected to the leaderboard

3. **Explore the Leaderboard**
   - You should see yourself at the bottom of your continent's leaderboard
   - Click through different continent tabs to see rankings
   - Click "🌍 WORLD LEADERS" to see the global leaderboard

4. **Purchase Positions (Climb Higher)**
   - Click the "Climb Higher" button on your stats card
   - Enter an amount (e.g., 10 for $10 = 10 positions)
   - Click "Confirm Purchase"
   - Watch your rank update in real-time!

5. **Test with Multiple Users**
   - Logout (top right)
   - Register another user with a different email/username
   - Make purchases with both users
   - See how rankings update and users get overtaken

6. **Check Email Notifications**
   - Email notifications are logged to the console (terminal where dev server is running)
   - When one user overtakes another, you'll see the notification in the terminal

## 📋 What to Test

### Core Features
- ✅ User registration with continent/country selection
- ✅ User login/logout
- ✅ Landing page with live leaderboard preview
- ✅ 7 continent leaderboards + worldwide view
- ✅ Position purchasing system
- ✅ Real-time rank calculations
- ✅ Overtaken user notifications (console)
- ✅ Mobile responsive design

### User Flow
1. Land on homepage → See top 10 leaders
2. Register → Auto-assigned to bottom of continent leaderboard
3. View leaderboard → See your position
4. Purchase positions → Climb the ranks
5. View updated rankings → See changes reflected
6. Check global leaderboard → Compare across continents

## 🎮 Demo Scenario

**Scenario: Two users competing in North America**

1. **User 1: "AlphaLeader"**
   - Register with continent: North America, country: United States
   - Starting position: #1 (first user)
   - Purchase $50 → Stay at #1 (already at top)

2. **User 2: "BetaClimber"**
   - Register with continent: North America, country: Canada
   - Starting position: #2 (second user in North America)
   - Purchase $60 → Climb to #1!
   - AlphaLeader gets notification: "BetaClimber just overtook you!"

3. **User 3: "GammaRiser" (Different Continent)**
   - Register with continent: Europe, country: United Kingdom
   - Starting position: #1 in Europe (first European user)
   - Purchase $100 → Stay #1 in Europe
   - Global rank depends on total positions vs North America users

## 🔍 What to Look For

### Landing Page
- Clean, professional design with dark theme
- Gradient logo and taglines
- Live leaderboard preview (updates when users register)
- Responsive on mobile devices

### Registration
- Dynamic country dropdown based on continent selection
- Form validation (email format, password length, etc.)
- Immediate redirect to leaderboard after registration

### Leaderboard
- Tab interface for continents + world
- User stats card showing both continent and global ranks
- Highlighted row for current user
- Crown 👑 for #1, medals for #2-3
- Country flag emojis

### Purchase Modal
- Live preview of positions to climb
- Simulated payment (always successful)
- Success message
- Automatic rank update
- Modal closes after 2 seconds

### Notifications
- Check terminal/console for email notification logs
- Format: "📧 EMAIL NOTIFICATION: ..."
- Sent when a user is overtaken

## 🛠 Troubleshooting

**Server not running?**
```bash
npm run dev
```

**Database issues?**
```bash
npx prisma migrate reset
npx prisma migrate dev
```

**Clear cache?**
```bash
rm -rf .next
npm run dev
```

**Port already in use?**
- Server will automatically use next available port (3001, 3002, etc.)
- Check terminal output for actual URL

## 🎯 Next Steps

Once you've tested the MVP:

1. **Add Stripe Integration** (Phase 2)
   - Install Stripe SDK
   - Create payment intent endpoint
   - Add Stripe checkout

2. **Real Email Notifications**
   - Configure SMTP server
   - Update notification system

3. **Deploy to Production**
   - Set up PostgreSQL database
   - Deploy to Vercel/Railway/Fly.io
   - Update environment variables

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Review code comments in lib/ files
- Examine API routes in app/api/

---

**Enjoy building WorldLeader.io!** 🌍👑
