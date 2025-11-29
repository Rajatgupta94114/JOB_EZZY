# JOBEZZY - TON Blockchain Recruitment Platform

## 🎯 Project Overview

JOBEZZY is a decentralized recruitment platform built on the TON blockchain. It enables companies to post jobs, candidates to apply, and facilitates secure payments using TON cryptocurrency with escrow contracts.

**Live URL:** https://jobezzy-ton-recruitment.vercel.app

---

## ✨ Key Features

### 🔐 Authentication & User Management
- User registration (Company/Candidate roles)
- Secure login system
- User profiles with ratings
- KYC verification status
- Wallet integration

### 💼 Job Management
- Post job listings (companies only)
- Browse available jobs (candidates)
- Job search and filtering
- Job details and requirements
- Applicant tracking

### 📋 Application System
- Apply for jobs (candidates)
- View applications (companies)
- Application status tracking
- Resume and details submission
- Acceptance/rejection workflow

### 💰 Payment System
- Real TON blockchain payments
- Escrow contracts for security
- Payment history tracking
- Transaction verification
- Coin animations on completion

### 🪙 TON Integration
- Tonkeeper wallet connection
- Real blockchain transactions
- Mainnet support
- Transaction hash tracking
- Payment confirmation

### ⭐ Rating & Reviews
- Rate candidates after completion
- Rate companies
- Leaderboard system
- Reputation tracking

### 💬 Communication
- In-app messaging
- Real-time notifications
- Contract notifications
- Payment alerts

### 🏆 Additional Features
- Leaderboard rankings
- User connections/network
- SBT (Soulbound Token) system
- Points balance tracking
- Notification center

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** Lucide Icons, shadcn/ui
- **State Management:** Zustand
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **API:** Next.js API Routes
- **Database:** SQLite with better-sqlite3
- **Authentication:** Custom JWT-based

### Blockchain
- **Network:** TON Mainnet
- **Wallet:** Tonkeeper
- **Integration:** TonConnect UI React
- **Libraries:** @ton/ton, @ton/crypto

---

## 📦 Database Schema

### Tables
```
users
├── id (PK)
├── name
├── username (UNIQUE)
├── role (company/candidate)
├── walletAddress
├── rating
├── pointsBalance
├── sbtBalance
├── kycStatus
└── createdAt

jobs
├── id (PK)
├── title
├── description
├── company
├── location
├── salary
├── jobType
├── skills (JSON)
├── createdBy (FK → users)
├── createdAt
└── applicants

applications
├── id (PK)
├── jobId (FK → jobs)
├── candidateId (FK → users)
├── candidateName
├── resume (JSON)
├── details (JSON)
├── status
├── createdAt
├── escrowContractId
├── contractAccepted
└── contractAcceptedAt

escrow
├── id (PK)
├── jobId
├── jobTitle
├── candidateId (FK → users)
├── companyId (FK → users)
├── amount
├── currency
├── description
├── terms
├── startDate
├── endDate
├── status
├── paymentStatus
└── createdAt

payments
├── id (PK)
├── escrowId (FK → escrow)
├── companyId (FK → users)
├── candidateId (FK → users)
├── amount
├── currency
├── candidateWalletAddress
├── transactionHash
├── status
├── createdAt
└── updatedAt

connections
├── id (PK)
├── userId (FK → users)
├── connectedUserId (FK → users)
├── status
└── createdAt

messages
├── id (PK)
├── conversationId
├── senderId (FK → users)
├── recipientId (FK → users)
├── message
└── timestamp

notifications
├── id (PK)
├── userId (FK → users)
├── type
├── title
├── message
├── read
└── createdAt

ratings
├── id (PK)
├── escrowId (FK → escrow)
├── candidateId (FK → users)
├── companyId (FK → users)
├── rating
├── comment
└── createdAt
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Tonkeeper wallet (for testing payments)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rajatgupta94114/JOB_EZZY.git
   cd JOB_EZZY
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   ```
   http://localhost:3000
   ```

---

## 📝 API Routes

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users?id=userId` - Get user by ID

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs?id=jobId` - Get job by ID

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Submit application
- `GET /api/applications?jobId=jobId` - Get job applications

### Escrow
- `GET /api/escrow` - Get all escrow contracts
- `POST /api/escrow` - Create escrow contract
- `PUT /api/escrow` - Update escrow status

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create payment record
- `PUT /api/payments` - Update payment status
- `GET /api/payments?escrowId=escrowId` - Get payment by escrow

### Ratings
- `GET /api/ratings` - Get all ratings
- `POST /api/ratings` - Submit rating

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send message

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification

### Connections
- `GET /api/connections` - Get user connections
- `POST /api/connections` - Create connection

---

## 🔄 User Workflows

### Company Workflow
1. Register as company
2. Complete KYC verification
3. Post job listings
4. Review applications
5. Create escrow contract with selected candidate
6. Connect TON wallet
7. Send payment via Tonkeeper
8. Rate candidate after completion

### Candidate Workflow
1. Register as candidate
2. Complete KYC verification
3. Browse job listings
4. Apply for jobs
5. Accept contract offers
6. Receive payment notifications
7. Rate company after completion

### Payment Workflow
1. Company initiates payment
2. Company connects TON wallet
3. System requests candidate wallet
4. Candidate provides wallet address
5. Company confirms payment amount
6. Tonkeeper modal opens
7. Company approves transaction
8. 🪙 Coin animation plays
9. Payment marked as completed
10. Both parties see transaction history

---

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

### Type Check
```bash
npm run type-check
```

### Lint Code
```bash
npm run lint
```

---

## 📊 Database Management

### Check Database Status
```bash
sqlite3 data/jobezzy.db ".tables"
```

### View Record Counts
```bash
sqlite3 data/jobezzy.db "SELECT 'users' as table_name, COUNT(*) as count FROM users UNION ALL SELECT 'jobs', COUNT(*) FROM jobs UNION ALL SELECT 'applications', COUNT(*) FROM applications UNION ALL SELECT 'escrow', COUNT(*) FROM escrow UNION ALL SELECT 'payments', COUNT(*) FROM payments UNION ALL SELECT 'connections', COUNT(*) FROM connections UNION ALL SELECT 'messages', COUNT(*) FROM messages UNION ALL SELECT 'notifications', COUNT(*) FROM notifications UNION ALL SELECT 'ratings', COUNT(*) FROM ratings;"
```

### Re-migrate Data
```bash
npm run migrate
```

### Interactive Database Shell
```bash
sqlite3 data/jobezzy.db
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git push origin master
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Update Environment Variables:**
   ```
   NEXT_PUBLIC_TON_CONNECT_MANIFEST=https://your-url.vercel.app/tonconnect-manifest.json
   NEXT_PUBLIC_API_URL=https://your-url.vercel.app/api
   NEXT_PUBLIC_TON_ENDPOINT=https://mainnet.toncenter.com/api/v2/jsonRPC
   NEXT_PUBLIC_TON_NETWORK=mainnet
   ```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 🔒 Security Features

- ✅ Secure wallet connection via Tonkeeper
- ✅ Real blockchain transaction verification
- ✅ Escrow contracts for payment security
- ✅ User authentication and authorization
- ✅ KYC verification system
- ✅ Rate limiting on API routes
- ✅ HTTPS enforced in production
- ✅ Environment variable protection
- ✅ SQL injection prevention via prepared statements
- ✅ CORS configuration

---

## 📈 Performance

- **Database:** SQLite with WAL mode for concurrent access
- **Caching:** Next.js static generation where possible
- **Images:** Unoptimized for flexibility
- **Code Splitting:** Automatic via Next.js
- **Build Size:** ~102KB shared JS

---

## 🐛 Troubleshooting

### Build Errors
```bash
npm cache clean --force
rm -rf .next
npm run build
```

### Database Issues
```bash
rm -f data/jobezzy.db data/jobezzy.db-shm data/jobezzy.db-wal
npm run migrate
```

### Port Already in Use
```bash
# Change port
PORT=3001 npm run dev
```

### Wallet Connection Issues
- Ensure Tonkeeper is installed
- Check manifest URL is accessible
- Try testnet first
- Clear browser cache

---

## 📞 Support & Resources

- **TON Documentation:** https://ton.org/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **TonConnect UI:** https://github.com/ton-connect/ton-connect-ui
- **SQLite Documentation:** https://www.sqlite.org/docs.html

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👥 Contributors

- **Rajat Gupta** - Project Lead & Developer

---

## 🎉 Status

✅ **Production Ready**
- Database: Fully migrated to SQLite
- Build: Passes all checks
- Tests: All passing
- Deployment: Ready for production

**Last Updated:** November 29, 2025
