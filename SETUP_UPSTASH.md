# 🚀 Setup Upstash Redis for Vercel (Easy!)

## Step 1: Click "Upstash" in Vercel Marketplace

In the Storage tab, you saw:
```
Marketplace Database Providers
- Neon (Postgres)
- Upstash (Redis) ← CLICK THIS
- Supabase (Postgres)
- etc.
```

**Click on "Upstash"**

---

## Step 2: Create Upstash Account

1. Click **Upstash** link
2. You'll be redirected to Upstash website
3. Click **Sign Up** or **Sign in with GitHub**
4. Create account (takes 1 minute)

---

## Step 3: Create Redis Database

1. After login, go to **Console**
2. Click **Create Database**
3. Fill in:
   - **Name:** `jobezzy` or `job-ezzy`
   - **Region:** Choose closest to you (or default)
   - **Type:** Redis
4. Click **Create**

---

## Step 4: Get Connection Details

After creation, you'll see:
```
UPSTASH_REDIS_REST_URL = https://...
UPSTASH_REDIS_REST_TOKEN = ...
```

Copy these values.

---

## Step 5: Add to Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select **job-ezzy-ik6p** project
3. Go to **Settings** → **Environment Variables**
4. Add these two variables:

```
UPSTASH_REDIS_REST_URL
Value: <paste-your-url>

UPSTASH_REDIS_REST_TOKEN
Value: <paste-your-token>
```

5. Click **Save**

---

## Step 6: Tell Me When Done

Once you've:
- ✅ Created Upstash account
- ✅ Created Redis database
- ✅ Added environment variables to Vercel
- ✅ Saved them

Tell me and I'll:
1. Update the code to use Upstash Redis
2. Test it
3. Push to GitHub
4. You redeploy
5. ✅ Jobs will persist!

---

## ⏱️ Time Required: 10 minutes

1. Create Upstash account: 2 min
2. Create Redis database: 2 min
3. Copy credentials: 1 min
4. Add to Vercel: 2 min
5. Tell me: 1 min
6. I update code: 5 min
7. You redeploy: 2 min

**Total: ~15 minutes**

---

## 🎯 Alternative: Use MongoDB Atlas (Also Easy)

If you prefer MongoDB:

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **Sign Up** (free)
3. Create account
4. Create free cluster
5. Get connection string
6. Add to Vercel environment variables
7. Tell me
8. I update code

---

## ✅ Quick Summary

**What to do:**
1. In Vercel Storage tab, click **Upstash**
2. Create account
3. Create Redis database
4. Copy URL and token
5. Add to Vercel environment variables
6. Tell me when done

**I'll do:**
1. Update code to use Upstash
2. Push to GitHub
3. You redeploy
4. ✅ Data persists!

---

**Next:** Complete these steps and reply when done!
