# 🧪 JOBEZZY - Quick Testing Guide

## ⚡ Quick Start (5 minutes)

### Step 1: Start the App
```bash
cd /Users/test/Desktop/JOBEZZY
npm run dev
```
Open: http://localhost:3000

### Step 2: Create Company Account
1. Click "Get Started" or role selection
2. Select "Company"
3. Enter username: `company1`
4. Click "Login"
5. ✅ Verify logged in

### Step 3: Post a Job
1. Click "Post Job" or "Create Job"
2. Fill in:
   - **Title**: "Senior React Developer"
   - **Description**: "Build amazing web apps"
   - **Location**: "Remote"
   - **Salary**: "50000"
   - **Skills**: "React, TypeScript, Node.js"
3. Click "Post Job"
4. ✅ Verify job appears in list

### Step 4: Create Candidate Account
1. Logout or open new browser tab
2. Go to http://localhost:3000
3. Select "Candidate"
4. Enter username: `candidate1`
5. Click "Login"
6. ✅ Verify logged in

### Step 5: Apply for Job
1. Click "Browse Jobs" or "Jobs"
2. Find the job you posted
3. Click "Apply"
4. Fill in:
   - **Resume**: "I have 5 years of React experience"
   - **Details**: "Very interested in this role"
5. Click "Submit Application"
6. ✅ Verify success message

### Step 6: Accept Application (Company)
1. Switch back to company account
2. Click "Applications" or "My Applications"
3. Find the candidate's application
4. Click "Accept"
5. ✅ Verify status changed to "Accepted"

### Step 7: Create Contract
1. Click "Create Contract" or "Create Escrow"
2. Fill in:
   - **Amount**: "100" (TON)
   - **Start Date**: Today
   - **End Date**: 30 days from now
   - **Terms**: "Build the project"
3. Click "Create Contract"
4. ✅ Verify contract created

### Step 8: Make Payment
1. Go to "Applications" page
2. Find the hired application
3. Click "Make Payment"
4. **Step 1 - Connect Wallet**:
   - Click "Connect Wallet"
   - Tonkeeper opens
   - Select your wallet
   - ✅ Verify wallet connected

5. **Step 2 - Request Wallet**:
   - System shows "Requesting candidate wallet"
   - ✅ Verify message displays

6. **Step 3 - Send Payment**:
   - Enter candidate wallet address
   - Click "Send Payment"
   - Tonkeeper opens
   - Confirm transaction
   - ✅ Verify transaction hash shows

7. **Step 4 - Completed**:
   - ✅ Coin animation plays (20-30 coins)
   - ✅ Transaction details display
   - ✅ "Payment Completed" badge shows

### Step 9: Check Payment History
1. **Company Side**:
   - Go to "Applications"
   - Find the paid application
   - ✅ Verify "Payment Completed" badge
   - ✅ Verify transaction details visible

2. **Candidate Side**:
   - Switch to candidate account
   - Go to "My Applications"
   - Find the hired application
   - ✅ Verify payment history shows
   - ✅ Verify amount and transaction hash

### Step 10: Rate Candidate
1. Switch to company account
2. Go to "Applications"
3. Find the application
4. Click "Rate Candidate"
5. Fill in:
   - **Rating**: 5 stars
   - **Comment**: "Excellent work!"
6. Click "Submit Rating"
7. ✅ Verify success message

## 📊 Database Verification

### Check SQLite Database
```bash
# Open database
sqlite3 /Users/test/Desktop/JOBEZZY/jobezzy.db

# View tables
.tables

# Check users
SELECT COUNT(*) as user_count FROM users;

# Check jobs
SELECT COUNT(*) as job_count FROM jobs;

# Check applications
SELECT COUNT(*) as app_count FROM applications;

# Check payments
SELECT COUNT(*) as payment_count FROM payments;

# View all data
.mode column
.headers on
SELECT * FROM users;
SELECT * FROM jobs;
SELECT * FROM applications;
SELECT * FROM payments;
```

## ✅ Test Checklist

### Authentication
- [ ] Company registration works
- [ ] Candidate registration works
- [ ] Login persists across page refresh
- [ ] Logout works

### Job Management
- [ ] Company can post jobs
- [ ] Job appears in candidate list
- [ ] Job details display correctly
- [ ] Job saved to database

### Applications
- [ ] Candidate can apply for job
- [ ] Application appears in company dashboard
- [ ] Company can accept/reject
- [ ] Status updates in database

### Contracts
- [ ] Contract created after acceptance
- [ ] Contract details saved
- [ ] Contract status displays

### Payments
- [ ] Wallet connection works
- [ ] Payment can be sent
- [ ] Transaction hash displays
- [ ] Coin animation plays
- [ ] Payment saved to database

### Payment History
- [ ] Company sees "Payment Completed" badge
- [ ] Company sees transaction details
- [ ] Candidate sees received payment
- [ ] Payment persists after refresh

### Ratings
- [ ] Company can rate candidate
- [ ] Rating saved to database
- [ ] Rating displays on profile

### Database
- [ ] All 9 tables exist
- [ ] Data persists after page refresh
- [ ] Data persists after server restart
- [ ] No NULL constraint errors

## 🐛 Troubleshooting

### Issue: "NOT NULL constraint failed"
**Solution**: Make sure all required fields are filled in forms

### Issue: Wallet not connecting
**Solution**: 
1. Make sure Tonkeeper is installed
2. Try refreshing the page
3. Check browser console for errors

### Issue: Payment not showing
**Solution**:
1. Wait a few seconds for transaction confirmation
2. Check if transaction was actually sent
3. Verify wallet has sufficient TON balance

### Issue: Database errors
**Solution**:
```bash
# Reinitialize database
npm run init-db

# Check database integrity
sqlite3 jobezzy.db "PRAGMA integrity_check;"
```

## 📱 Testing on Different Devices

### Desktop
- ✅ Chrome/Edge/Firefox
- ✅ All features work
- ✅ Responsive design

### Mobile (if applicable)
- ✅ Touch interactions work
- ✅ Forms are usable
- ✅ Animations smooth

## 🎯 Success Criteria

✅ **All tests pass** if:
1. User registration works
2. Job posting works
3. Applications work
4. Payments work
5. Coin animation plays
6. Payment history shows
7. Database persists data
8. No errors in console

## 📝 Test Results

| Feature | Status | Notes |
|---------|--------|-------|
| Registration | ⬜ | |
| Job Posting | ⬜ | |
| Applications | ⬜ | |
| Contracts | ⬜ | |
| Payments | ⬜ | |
| Animations | ⬜ | |
| History | ⬜ | |
| Database | ⬜ | |

## 🚀 Next Steps

After testing:
1. ✅ Fix any issues found
2. ✅ Deploy to Vercel
3. ✅ Share with users
4. ✅ Gather feedback
5. ✅ Plan improvements

---

**Estimated Testing Time**: 15-20 minutes
**Difficulty**: Easy
**Requirements**: Tonkeeper wallet with TON balance (for real payments)
