# JOBEZZY Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     JOBEZZY Platform                        │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
    ┌────────────┐      ┌────────────┐      ┌────────────┐
    │  Frontend  │      │  Backend   │      │ Blockchain │
    │ (Next.js)  │      │ (Node.js)  │      │   (TON)    │
    └────────────┘      └────────────┘      └────────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
App (layout.tsx)
├── TonConnectUIProvider
├── SplashScreen (3 sec)
├── AuthModal (TON/Telegram)
├── Navigation (Mobile/Desktop)
└── Pages
    ├── Dashboard (/)
    ├── Jobs (/jobs)
    ├── Candidates (/candidates)
    ├── Leaderboard (/leaderboard)
    └── Profile (/profile)
```

### State Management (Zustand)

```typescript
AuthStore
├── user: User | null
├── isAuthenticated: boolean
├── isLoading: boolean
├── showAuthModal: boolean
├── setUser()
├── setIsAuthenticated()
├── setIsLoading()
├── setShowAuthModal()
└── logout()
```

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Zustand Store Update
    ↓
Component Re-render
    ↓
UI Update
```

---

## Authentication Flow

### TON Wallet Login

```
┌─────────────────────────────────────────────────────────┐
│ 1. User clicks "Connect TON Wallet"                     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. TON Connect Modal Opens                              │
│    (via @tonconnect/ui-react)                           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. User Selects Wallet & Approves                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Wallet Address Retrieved                             │
│    tonConnectUI.account?.address                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Create User in Store                                 │
│    setUser(mockUser)                                    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Close Auth Modal & Show Dashboard                    │
│    setShowAuthModal(false)                              │
└─────────────────────────────────────────────────────────┘
```

### Telegram Login

```
┌─────────────────────────────────────────────────────────┐
│ 1. User clicks "Login with Telegram"                    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Telegram Mini-App SDK Integration                    │
│    (window.Telegram.WebApp)                             │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Get User Data from Telegram                          │
│    initData, user, startParam                           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Create User in Store                                 │
│    setUser(telegramUser)                                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Close Auth Modal & Show Dashboard                    │
│    setShowAuthModal(false)                              │
└─────────────────────────────────────────────────────────┘
```

---

## Page Structure

### Dashboard (/)
```
Dashboard
├── Welcome Section
│   └── User Name Greeting
├── Quick Stats (4 Cards)
│   ├── Rating
│   ├── Points Balance
│   ├── Role
│   └── KYC Status
├── Featured Jobs (3 Cards)
│   ├── Job Title & Company
│   ├── Salary
│   ├── Skills
│   └── Status
├── Top Recruiters (5 Cards)
│   ├── Rank
│   ├── Name
│   ├── Placements
│   └── Points
└── CTA Section
    └── Action Buttons
```

### Jobs (/jobs)
```
Jobs Page
├── Header
├── Search & Filter
└── Jobs Grid (6 Cards)
    ├── Job Title & Company
    ├── Description
    ├── Salary
    ├── Submissions Count
    ├── Skills Tags
    └── View Details Button
```

### Candidates (/candidates)
```
Candidates Page
├── Header
├── Search Bar
└── Candidates List
    ├── Name
    ├── Job Applied For
    ├── Skills
    ├── Match Score
    └── Status
```

### Leaderboard (/leaderboard)
```
Leaderboard Page
├── Header
└── Top 10 Recruiters
    ├── Rank (with medal emoji)
    ├── Name
    ├── Placements Count
    └── Points
```

### Profile (/profile)
```
Profile Page
├── Profile Card (Left)
│   ├── Avatar
│   ├── Name
│   ├── Role
│   ├── Rating
│   ├── Points
│   └── KYC Status
├── Wallet Info (Right)
│   ├── TON Wallet Address
│   ├── Telegram ID
│   └── TON DNS
├── Credentials
│   ├── SBT Credentials
│   └── NFT Badges
└── Security
    ├── Change Password
    ├── Enable 2FA
    └── Disconnect Wallet
```

---

## Navigation Architecture

### Mobile Navigation

```
┌─────────────────────────────────┐
│                                 │
│      Page Content               │
│                                 │
├─────────────────────────────────┤
│                          ☰       │  ← Floating Action Button
└─────────────────────────────────┘
        ↓ (Click)
┌─────────────────────────────────┐
│ 💼 Jobs                         │
│ 👥 Candidates                   │
│ 🏆 Leaderboard                  │
│ 👤 Profile                      │
│ ─────────────────────────────   │
│ User Info                       │
│ ─────────────────────────────   │
│ 🚪 Logout                       │
└─────────────────────────────────┘
```

### Desktop Navigation

```
┌────────────────────────────────────────────────────────────┐
│ 🐬 JOBEZZY │ 💼 Jobs │ 👥 Candidates │ 🏆 Leaderboard │ 👤 Profile │ User │ 🚪 │
└────────────────────────────────────────────────────────────┘
```

---

## Styling Architecture

### Color Palette

```
Dark Theme (Telegram Optimized)
├── Background
│   ├── dark-950: #030712 (Darkest)
│   ├── dark-900: #111827 (Dark)
│   └── dark-800: #1f2937 (Medium Dark)
├── Primary (Cyan)
│   ├── primary-400: #38bdf8 (Light)
│   ├── primary-500: #0ea5e9 (Main)
│   └── primary-600: #0284c7 (Dark)
├── Accent (Pink)
│   ├── accent-400: #f472b6 (Light)
│   ├── accent-500: #ec4899 (Main)
│   └── accent-600: #db2777 (Dark)
└── Text
    ├── white: #ffffff (Primary)
    ├── dark-300: #d1d5db (Secondary)
    └── dark-400: #9ca3af (Tertiary)
```

### Component Styles

```
Glass Morphism
├── Backdrop Blur: 12px
├── Background: rgba(255, 255, 255, 0.1)
├── Border: 1px solid rgba(255, 255, 255, 0.2)
└── Border Radius: 12px

Gradient Text
├── From: primary-400
├── Via: accent-400
├── To: primary-500
└── Background Clip: text

Buttons
├── Primary: gradient (primary → accent)
├── Secondary: dark with border
├── Hover: scale(1.05)
└── Active: scale(0.95)
```

### Animations

```
Fade In Up
├── Duration: 0.6s
├── Easing: ease-out
└── Transform: translateY(20px) → translateY(0)

Slide In Down
├── Duration: 0.6s
├── Easing: ease-out
└── Transform: translateY(-20px) → translateY(0)

Pulse Glow
├── Duration: 2s
├── Easing: ease-in-out
└── Box Shadow: 0 0 20px → 0 0 40px
```

---

## Backend Integration Points

### API Endpoints (To Implement)

```
Authentication
POST   /api/auth/login-wallet
POST   /api/auth/login-telegram
POST   /api/auth/logout

Jobs
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id

Candidates
GET    /api/candidates
POST   /api/candidates
PUT    /api/candidates/:id
GET    /api/candidates/:id/match-score

Leaderboard
GET    /api/leaderboard
GET    /api/leaderboard/:userId

Escrow
POST   /api/escrow/create
GET    /api/escrow/:jobId
POST   /api/escrow/:jobId/release
POST   /api/escrow/:jobId/refund
POST   /api/escrow/:jobId/dispute

Credentials
POST   /api/credentials/mint-sbt
POST   /api/credentials/mint-nft
GET    /api/credentials/:userId
```

### Data Models

```typescript
User {
  id: string
  name: string
  email?: string
  role: UserRole
  walletAddress: string
  telegramId?: string
  tonDNS?: string
  rating: number
  kycStatus: KYCStatus
  pointsBalance: number
  createdAt: string
}

Job {
  id: string
  title: string
  skills: string[]
  salary: number
  companyId: string
  escrowAddress: string
  status: JobStatus
  createdAt: string
}

Candidate {
  id: string
  name: string
  skills: string[]
  resumeIPFS: string
  submittedBy: string
  jobId: string
  matchScore: number
  status: CandidateStatus
}

Credential {
  id: string
  tokenId: string
  type: 'SBT' | 'NFT'
  recruiterId: string
  jobId: string
  txHash: string
  ipfsMetadata: string
  createdAt: string
}
```

---

## Smart Contract Integration

### Escrow Contract (Tact)

```
Functions:
├── createDeal(jobId, amountTON)
├── hireCandidate(jobId, candidateId)
├── releaseFunds(jobId)
├── refund(jobId)
├── raiseDispute(jobId)
└── resolveDispute(jobId)

States:
├── Draft
├── Funded
├── Locked
├── Hired
├── Released
├── Refunded
└── Disputed
```

### SBT Collection (Tact)

```
Functions:
├── mint(to, metadata)
├── burn(tokenId)
├── getMetadata(tokenId)
└── verify(tokenId)

Metadata:
├── recruiterWallet
├── companyName
├── jobId
├── skillsVerified
├── hireDate
├── transactionHash
└── verifierSignature
```

---

## Deployment Architecture

### Development
```
Local Machine
├── npm run dev
├── http://localhost:3000
└── Hot Reload Enabled
```

### Production
```
Vercel
├── GitHub Integration
├── Auto Deploy on Push
├── Environment Variables
├── CDN Distribution
└── HTTPS Enabled
```

### Monitoring
```
Error Tracking: Sentry
Analytics: Google Analytics
Performance: Vercel Analytics
Uptime: StatusPage
```

---

## Security Architecture

### Authentication
```
Frontend
├── TON Wallet Signature
├── Telegram Mini-App Token
└── JWT Token (from backend)

Backend
├── Verify Wallet Signature
├── Verify Telegram Token
├── Issue JWT Token
└── Refresh Token Mechanism
```

### Data Protection
```
├── HTTPS Only
├── CORS Configuration
├── Rate Limiting
├── Input Validation
├── Output Sanitization
└── SQL Injection Prevention
```

### Smart Contract Security
```
├── Audit Ready Architecture
├── Reentrancy Protection
├── Overflow/Underflow Protection
├── Access Control
└── Emergency Pause Mechanism
```

---

## Performance Optimization

### Frontend
```
├── Code Splitting (Next.js)
├── Image Optimization
├── CSS Minification
├── Tree Shaking
├── Lazy Loading
└── Caching Strategy
```

### Backend (To Implement)
```
├── Database Indexing
├── Query Optimization
├── Caching (Redis)
├── CDN for Static Assets
├── Load Balancing
└── Database Replication
```

---

## Scalability Plan

### Phase 1 (Current)
- Single frontend deployment
- Mock backend
- Local state management

### Phase 2 (Next)
- Real backend API
- PostgreSQL database
- JWT authentication

### Phase 3 (Future)
- Microservices architecture
- Message queue (RabbitMQ)
- Caching layer (Redis)
- Search engine (Elasticsearch)

### Phase 4 (Advanced)
- Kubernetes orchestration
- Multi-region deployment
- Database sharding
- GraphQL API

---

## Disaster Recovery

### Backup Strategy
```
├── Database Backups (Daily)
├── Code Repository (GitHub)
├── Smart Contract Audit (Before Deploy)
└── Configuration Backup (Encrypted)
```

### Recovery Plan
```
├── RTO: 1 hour
├── RPO: 1 day
├── Failover: Automatic
└── Testing: Monthly
```

---

This architecture is designed to be scalable, maintainable, and production-ready.
