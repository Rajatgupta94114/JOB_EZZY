# JOBEZZY Deployment Guide

## 🚀 Quick Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub:**
   ```bash
   git push origin master
   ```

2. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign in with GitHub
   - Click "New Project"
   - Select your `JOB_EZZY` repository
   - Click "Import"

3. **Configure Environment Variables:**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add the following variables:
   ```
   NEXT_PUBLIC_TON_CONNECT_MANIFEST=https://your-vercel-url.vercel.app/tonconnect-manifest.json
   NEXT_PUBLIC_API_URL=https://your-vercel-url.vercel.app/api
   NEXT_PUBLIC_TON_ENDPOINT=https://mainnet.toncenter.com/api/v2/jsonRPC
   NEXT_PUBLIC_TON_NETWORK=mainnet
   NEXT_PUBLIC_ENABLE_ESCROW=true
   NEXT_PUBLIC_ENABLE_SBT_MINTING=true
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (5-10 minutes)
   - Your app will be live at `https://jobezzy-ton-recruitment.vercel.app`

---

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod --build
   ```

4. **Configure Environment Variables in Netlify:**
   - Go to Site Settings → Build & Deploy → Environment
   - Add the same environment variables as above

---

## 📦 Database Setup for Production

### SQLite Database Included
Your project includes a pre-migrated SQLite database (`data/jobezzy.db`) with all your existing data:
- 16 users
- 10 jobs
- 11 applications
- 10 escrow contracts
- 5 payments
- 4 connections
- 10 notifications

### Automatic Database Initialization
The database is automatically initialized on first deployment. No additional setup needed!

---

## ✅ What's Included in Deployment

### Features:
- ✅ Real TON wallet connection via Tonkeeper
- ✅ Real TON payments on blockchain
- ✅ Coin animations (20-30 coins rising/falling)
- ✅ Transaction history with details
- ✅ User registration and authentication
- ✅ Job posting and applications
- ✅ Escrow contracts
- ✅ Payment system with SQLite database
- ✅ Rating system
- ✅ Chat messaging
- ✅ KYC verification
- ✅ Leaderboard

### Database Tables:
- `users` - User accounts and profiles
- `jobs` - Job postings
- `applications` - Job applications
- `escrow` - Escrow contracts
- `payments` - Payment records
- `connections` - User connections
- `messages` - Chat messages
- `notifications` - User notifications
- `ratings` - User ratings

---

## 🔧 Manual Database Commands

### Check Database Status:
```bash
sqlite3 data/jobezzy.db ".tables"
```

### View Record Counts:
```bash
sqlite3 data/jobezzy.db "SELECT 'users' as table_name, COUNT(*) as count FROM users UNION ALL SELECT 'jobs', COUNT(*) FROM jobs UNION ALL SELECT 'applications', COUNT(*) FROM applications UNION ALL SELECT 'escrow', COUNT(*) FROM escrow UNION ALL SELECT 'payments', COUNT(*) FROM payments UNION ALL SELECT 'connections', COUNT(*) FROM connections UNION ALL SELECT 'messages', COUNT(*) FROM messages UNION ALL SELECT 'notifications', COUNT(*) FROM notifications UNION ALL SELECT 'ratings', COUNT(*) FROM ratings;"
```

### Re-migrate Data from JSON:
```bash
npm run migrate
```

---

## 🌐 After Deployment

### 1. Update Manifest URL
After deployment, update the TON Connect manifest URL:
```bash
# Replace with your actual Vercel URL
NEXT_PUBLIC_TON_CONNECT_MANIFEST=https://your-app.vercel.app/tonconnect-manifest.json
```

### 2. Test the Application
1. Visit your deployed URL
2. Register as a new user (company or candidate)
3. Create a job posting (if company)
4. Apply for a job (if candidate)
5. Test wallet connection
6. Test TON payment flow

### 3. Monitor Deployment
- Check Vercel/Netlify dashboard for build logs
- Monitor database performance
- Check TON blockchain transactions

---

## 🚨 Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Clear cache: `npm cache clean --force`
- Rebuild: `npm run build`

### Database Issues
- Check database file exists: `ls -la data/jobezzy.db`
- Re-migrate: `npm run migrate`
- Check permissions: `chmod 644 data/jobezzy.db`

### TON Connection Issues
- Verify manifest URL is correct
- Check TON endpoint is accessible
- Test with Tonkeeper testnet first

### Payment Issues
- Ensure wallet is connected
- Check TON balance
- Verify transaction payload
- Check blockchain explorer for transaction status

---

## 📊 Production Checklist

- [ ] Database migrated and verified
- [ ] Environment variables configured
- [ ] TON Connect manifest URL updated
- [ ] Build passes without errors
- [ ] All API routes working
- [ ] User registration tested
- [ ] Job creation tested
- [ ] Payment flow tested
- [ ] Wallet connection tested
- [ ] Database backups configured
- [ ] Error logging configured
- [ ] Analytics configured (optional)

---

## 🔐 Security Notes

- Never commit `.env` files with secrets
- Use environment variables for sensitive data
- Keep database backups
- Monitor for suspicious transactions
- Implement rate limiting on API routes
- Use HTTPS only in production
- Regularly update dependencies

---

## 📞 Support

For issues or questions:
1. Check the deployment logs
2. Verify environment variables
3. Test locally with `npm run dev`
4. Check TON documentation: https://ton.org/docs
5. Check Next.js documentation: https://nextjs.org/docs

---

**Deployment Status:** ✅ Ready for Production
**Database:** ✅ SQLite with all data migrated
**Build:** ✅ Passes all checks
**Last Updated:** November 29, 2025
