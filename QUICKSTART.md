# JOBEZZY - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Install & Run
```bash
cd /Users/test/Desktop/JOBEZZY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 2: See the Flow
1. **Splash Screen** (3 seconds) - Animated intro with JOBEZZY branding
2. **Auth Modal** - Choose between:
   - **TON Wallet** - Connect with @tonconnect/ui-react
   - **Telegram** - Login with Telegram Mini-App
3. **Dashboard** - View stats, jobs, leaderboard
4. **Navigation** - Bottom nav on mobile, top nav on desktop

### Step 3: Explore Pages
- 🏠 **Home** - Dashboard with stats and featured jobs
- 💼 **Jobs** - Browse available positions
- 👥 **Candidates** - Manage submissions
- 🏆 **Leaderboard** - Top recruiters ranking
- 👤 **Profile** - User info, credentials, security

---

## 📱 UI Features

### Dark Theme (Telegram Optimized)
- **Primary Color**: Cyan (#0ea5e9)
- **Accent Color**: Pink (#ec4899)
- **Background**: Dark gradient (#030712 → #1a1f35)

### Responsive Design
- **Mobile**: Bottom navigation with hamburger menu
- **Desktop**: Horizontal top navigation bar
- **Tablet**: Adaptive layout

### Animations
- Fade-in effects on page load
- Slide-in modals
- Pulse glow on interactive elements
- Smooth transitions on hover

---

## 🔐 Authentication

### TON Wallet Login
```typescript
// User clicks "Connect TON Wallet"
// → TON Connect modal opens
// → User approves connection
// → Dashboard unlocks
```

### Telegram Login
```typescript
// User clicks "Login with Telegram"
// → Telegram Mini-App SDK integration
// → User authenticated
// → Dashboard unlocks
```

---

## 📊 Dashboard Components

### Quick Stats (4 Cards)
- Rating (⭐)
- Points Balance (⚡)
- Role (👥)
- KYC Status (📋)

### Featured Jobs (3 Cards)
- Job title & company
- Salary in TON
- Required skills
- Active status

### Top Recruiters (5 Cards)
- Rank with medal emoji
- Recruiter name
- Placements count
- Points earned

---

## 🎯 Navigation Structure

### Mobile (Bottom)
```
┌─────────────────────────┐
│                         │
│    Page Content         │
│                         │
├─────────────────────────┤
│ ☰ Menu Button (FAB)     │
│ (Opens dropdown)        │
└─────────────────────────┘
```

### Desktop (Top)
```
┌─────────────────────────────────────────────┐
│ 🐬 JOBEZZY │ Jobs │ Candidates │ Leaderboard │ Profile │ User │ Logout │
└─────────────────────────────────────────────┘
│                                             │
│         Page Content                        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS, Lucide Icons |
| **State** | Zustand |
| **Blockchain** | TON, @tonconnect/ui-react |
| **Auth** | JWT, TON SignMessage, Telegram |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
JOBEZZY/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout + TonConnect
│   ├── page.tsx                 # Dashboard
│   ├── globals.css              # Global styles
│   ├── jobs/page.tsx            # Jobs page
│   ├── candidates/page.tsx      # Candidates page
│   ├── leaderboard/page.tsx     # Leaderboard page
│   └── profile/page.tsx         # Profile page
├── components/                   # Reusable components
│   ├── SplashScreen.tsx         # 3-sec intro
│   ├── AuthModal.tsx            # Login modal
│   └── Navigation.tsx           # Nav bar
├── lib/
│   └── store.ts                 # Zustand store
├── public/
│   └── tonconnect-manifest.json # TON config
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind config
├── next.config.ts               # Next.js config
└── README.md                    # Full documentation
```

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: { 500: '#0ea5e9' },  // Cyan
  accent: { 500: '#ec4899' },   // Pink
}
```

### Change Splash Screen Duration
Edit `components/SplashScreen.tsx`:
```typescript
setTimeout(() => {
  setIsVisible(false);
  setShowAuthModal(true);
}, 3000);  // Change to desired milliseconds
```

### Add New Navigation Item
Edit `components/Navigation.tsx`:
```typescript
const navItems = [
  { icon: Briefcase, label: 'Jobs', href: '/jobs' },
  // Add new item here
];
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Deploy to Other Platforms
- **Netlify**: Connect GitHub repo
- **Railway**: Push to GitHub
- **Render**: Connect GitHub repo

---

## 🔗 Important Links

- **TON Docs**: https://ton.org/docs
- **TON Connect**: https://ton-connect.github.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Telegram Mini-App**: https://core.telegram.org/bots/webapps

---

## ✅ Checklist for Production

- [ ] Update TON Connect manifest URL
- [ ] Set up Telegram bot & Mini-App
- [ ] Configure environment variables
- [ ] Test wallet connection
- [ ] Test Telegram login
- [ ] Verify responsive design
- [ ] Set up error tracking (Sentry)
- [ ] Enable analytics
- [ ] Deploy to production
- [ ] Monitor performance

---

## 🐛 Common Issues

### "Cannot find module" errors
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### TON Connect not working
- Check manifest URL is accessible
- Verify wallet extension installed
- Clear browser cache
- Try incognito mode

---

## 📞 Support

- 📖 See `README.md` for full documentation
- 🔧 See `SETUP.md` for detailed setup
- 💬 Check GitHub issues
- 📧 Email: support@jobezzy.io

---

**Happy coding! 🚀**
