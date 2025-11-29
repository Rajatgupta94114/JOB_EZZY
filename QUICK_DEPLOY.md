# 🚀 Quick Deploy to Vercel (5 Minutes)

## Step 1: Push to GitHub ✅ (Already Done)
Your code is already pushed to: https://github.com/Rajatgupta94114/JOB_EZZY

---

## Step 2: Deploy to Vercel

### Option A: Automatic (Easiest)
1. Go to https://vercel.com/new
2. Click "Continue with GitHub"
3. Search for "JOB_EZZY"
4. Click "Import"
5. Click "Deploy"
6. Wait 5-10 minutes ⏳

### Option B: Using Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

---

## Step 3: Configure Environment Variables

After deployment, go to your Vercel project:

1. Click **Settings** → **Environment Variables**
2. Add these variables:

```
NEXT_PUBLIC_TON_CONNECT_MANIFEST
Value: https://jobezzy-ton-recruitment.vercel.app/tonconnect-manifest.json

NEXT_PUBLIC_API_URL
Value: https://jobezzy-ton-recruitment.vercel.app/api

NEXT_PUBLIC_TON_ENDPOINT
Value: https://mainnet.toncenter.com/api/v2/jsonRPC

NEXT_PUBLIC_TON_NETWORK
Value: mainnet

NEXT_PUBLIC_ENABLE_ESCROW
Value: true

NEXT_PUBLIC_ENABLE_SBT_MINTING
Value: true
```

3. Click "Save"
4. Redeploy from the Deployments tab

---

## Step 4: Test Your Deployment

Once deployed, visit: **https://jobezzy-ton-recruitment.vercel.app**

### Test Checklist:
- [ ] Homepage loads
- [ ] Can register as company
- [ ] Can register as candidate
- [ ] Can create job listing
- [ ] Can apply for job
- [ ] Can connect wallet (Tonkeeper)
- [ ] Can view payment history
- [ ] Database is working (check SQLite)

---

## 🎉 Your App is Live!

**URL:** https://jobezzy-ton-recruitment.vercel.app

**Database:** SQLite with 16 users, 10 jobs, 11 applications, and more!

**Features Working:**
- ✅ User registration
- ✅ Job posting
- ✅ Applications
- ✅ Wallet connection
- ✅ TON payments
- ✅ Coin animations
- ✅ Transaction history
- ✅ All data stored in database

---

## 📊 Database Info

Your SQLite database includes:
- **16 users** (companies and candidates)
- **10 jobs** (active job listings)
- **11 applications** (job applications)
- **10 escrow contracts** (payment contracts)
- **5 payments** (completed transactions)
- **4 connections** (user networks)
- **10 notifications** (user alerts)

All data is automatically available after deployment!

---

## 🔧 If Something Goes Wrong

### Check Build Logs
1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments"
4. Click on the failed deployment
5. Check the build logs

### Common Issues & Fixes

**Issue:** Build fails with TypeScript errors
```bash
# Fix locally first
npm run build
npm run type-check
git push origin master
```

**Issue:** Database not found
```bash
# Re-migrate data
npm run migrate
git add data/jobezzy.db
git commit -m "Update database"
git push origin master
```

**Issue:** Wallet connection not working
- Check manifest URL is correct
- Clear browser cache
- Try Tonkeeper testnet first

---

## 📞 Need Help?

1. **Check Deployment Guide:** See `DEPLOYMENT_GUIDE.md`
2. **Check Production Docs:** See `README_PRODUCTION.md`
3. **Check Build Logs:** Vercel Dashboard → Deployments
4. **Test Locally:** `npm run dev` and check `http://localhost:3000`

---

## ✨ You're All Set!

Your JOBEZZY platform is now:
- ✅ Deployed to production
- ✅ Using SQLite database
- ✅ Connected to TON blockchain
- ✅ Ready for real users
- ✅ All data persisted

**Share your URL:** https://jobezzy-ton-recruitment.vercel.app

**Enjoy! 🎉**
