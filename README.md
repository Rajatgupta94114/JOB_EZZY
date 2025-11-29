# JOBEZZY - TON Decentralized Recruitment & Reputation Platform

A production-ready Web3 recruitment platform on TON blockchain featuring Soulbound Token credentials, escrow automation, and on-chain reputation system.

## 🚀 Features

### Core Functionality
- **TON Wallet Integration** - Connect with @tonconnect/ui-react v2
- **Telegram Mini-App Login** - Native Telegram identity integration
- **Splash Screen & Auth Modal** - Beautiful onboarding flow with dark theme
- **Responsive Navigation** - Mobile-first bottom nav, desktop horizontal nav
- **Dashboard** - Real-time stats, featured jobs, leaderboard preview

### Advanced Features
- **Escrow Smart Contracts** - TON-based escrow with dispute resolution
- **Soulbound Tokens (SBTs)** - Non-transferable credentials for successful hires
- **Optional TIP-4 NFTs** - Shareable bragging rights badges
- **Recruiter Rewards** - Points system and referral bonuses
- **On-Chain Reputation** - Verifiable rating system anchored to TON
- **AI Skill Matching** - Auto resume parsing and scoring
- **Encrypted Messaging** - Secure on-chain communication

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Zustand** - State management
- **@tonconnect/ui-react** - TON wallet integration

### Backend (Ready for Implementation)
- **Node.js + Express.js** - REST API
- **PostgreSQL + Prisma ORM** - Database
- **JWT + TON SignMessage** - Authentication
- **Socket.IO** - Real-time updates

### Blockchain
- **TON Mainnet** - Primary network (testnet CI supported)
- **Tact** - Smart contract language for escrow & SBTs
- **FunC** - Low-level contract development
- **Blueprint** - TON contract deployment framework

### Deployment
- **Frontend** - Vercel
- **Backend** - Render / Railway
- **Monitoring** - Sentry + Prometheus

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 UI/UX Design

### Splash Screen (3 seconds)
- Animated gradient background
- JOBEZZY branding with dolphin emoji
- Loading progress bar
- Auto-transitions to auth modal

### Authentication Modal
- Two tabs: TON Wallet & Telegram
- Gradient header with close button
- Feature highlights with diamond bullets
- Responsive design for mobile/desktop

### Navigation
- **Mobile**: Bottom floating menu with hamburger toggle
- **Desktop**: Top horizontal navbar with logo, nav items, user info
- Smooth animations and transitions
- Logout functionality

### Dashboard
- Welcome greeting with user name
- Quick stats cards (Rating, Points, Role, KYC Status)
- Featured jobs grid with skill tags
- Top recruiters leaderboard
- Call-to-action section

## 🔐 Authentication Flow

1. **Splash Screen** (3s) → Auto-dismiss
2. **Auth Modal** appears with two options:
   - **TON Wallet**: Click "Connect TON Wallet" → TON Connect modal
   - **Telegram**: Click "Login with Telegram" → Telegram Mini-App SDK
3. **Dashboard** unlocks after successful auth
4. **Navigation** bar becomes visible

## 📱 Responsive Design

- **Mobile** (< 768px): Bottom navigation with hamburger menu
- **Desktop** (≥ 768px): Horizontal top navigation bar
- Dark theme optimized for Telegram Mini-App
- Touch-friendly button sizes and spacing

## 🎯 User Roles

- **Company** - Post jobs, sponsor gas, dispute resolution
- **Recruiter** - Submit candidates, earn rewards, receive SBTs
- **Candidate** - Upload resume, get matched, receive credentials
- **Admin** - Platform management
- **KYC Validator** - Identity verification
- **Verifier** - Credential verification

## 📊 Database Schema

### Core Tables
- `users` - User profiles with wallet & Telegram IDs
- `jobs` - Job postings with escrow addresses
- `candidates` - Candidate submissions with match scores
- `credentials` - SBT/NFT issuance records
- `escrow` - Escrow contract state
- `points_ledger` - Reward tracking

## 🚀 Deployment

### Vercel (Frontend)
```bash
npm run build
# Push to GitHub, auto-deploy via Vercel
```

### Backend Setup
```bash
# Create .env file with:
DATABASE_URL=postgresql://...
JWT_SECRET=...
TON_ENDPOINT=https://mainnet.toncenter.com/api/v2/jsonRPC
TELEGRAM_BOT_TOKEN=...
```

## 📝 Environment Variables

```env
# TON Connect
NEXT_PUBLIC_TON_CONNECT_MANIFEST=https://jobezzy.vercel.app/tonconnect-manifest.json

# Backend (when implemented)
DATABASE_URL=postgresql://user:password@localhost:5432/jobezzy
JWT_SECRET=your-secret-key
TON_ENDPOINT=https://mainnet.toncenter.com/api/v2/jsonRPC
TELEGRAM_BOT_TOKEN=your-bot-token
```

## 🔗 Smart Contract Addresses (Testnet)

- Escrow Contract: `EQC...` (to be deployed)
- SBT Collection: `EQC...` (to be deployed)
- NFT Collection: `EQC...` (optional, to be deployed)

## 📚 API Endpoints (Backend)

```
POST   /api/auth/login-wallet      - TON wallet login
POST   /api/auth/login-telegram    - Telegram login
POST   /api/jobs                   - Create job
GET    /api/jobs                   - List jobs
POST   /api/candidates             - Submit candidate
GET    /api/leaderboard            - Get top recruiters
POST   /api/escrow/create          - Create escrow
POST   /api/escrow/release         - Release funds
POST   /api/credentials/mint       - Mint SBT
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

## 🐛 Troubleshooting

### TON Connect not working
- Verify manifest URL in `tonconnect-manifest.json`
- Check TON wallet extension is installed
- Clear browser cache and reload

### Telegram Mini-App issues
- Ensure app is running on HTTPS (required by Telegram)
- Check Telegram Bot Token in environment variables
- Verify Mini-App URL in Telegram Bot settings

### Build errors
- Delete `node_modules` and `.next` folder
- Run `npm install` again
- Check Node.js version (≥18 required)

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📞 Support

- Documentation: [docs.jobezzy.io](https://docs.jobezzy.io)
- Discord: [discord.gg/jobezzy](https://discord.gg/jobezzy)
- Email: support@jobezzy.io

---

**Built with ❤️ for the TON community**
