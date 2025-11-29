# 🚀 Vercel Deployment Setup Guide

## Issue: Project Works Locally but Not on Vercel

If your project works at `http://192.168.1.14:3000` but not at `https://job-ezzy-ik6p.vercel.app`, follow these steps:

---

## ✅ Step 1: Update Environment Variables in Vercel

### Go to Vercel Dashboard:
1. Visit https://vercel.com/dashboard
2. Select your project: **job-ezzy-ik6p**
3. Go to **Settings** → **Environment Variables**

### Add These Variables:

```
NEXT_PUBLIC_TON_CONNECT_MANIFEST
Value: https://job-ezzy-ik6p.vercel.app/tonconnect-manifest.json

NEXT_PUBLIC_API_URL
Value: https://job-ezzy-ik6p.vercel.app/api

NEXT_PUBLIC_TON_ENDPOINT
Value: https://mainnet.toncenter.com/api/v2/jsonRPC

NEXT_PUBLIC_TON_NETWORK
Value: mainnet

NEXT_PUBLIC_ENABLE_ESCROW
Value: true

NEXT_PUBLIC_ENABLE_SBT_MINTING
Value: true
```

### Important Notes:
- ⚠️ Replace `job-ezzy-ik6p` with your actual Vercel subdomain
- ⚠️ Make sure to use `https://` (not `http://`)
- ⚠️ All `NEXT_PUBLIC_*` variables are exposed to the browser

---

## ✅ Step 2: Redeploy After Adding Variables

After adding environment variables:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy**
4. Wait for build to complete

---

## ✅ Step 3: Verify Deployment

### Check if it's working:
1. Visit https://job-ezzy-ik6p.vercel.app
2. Open DevTools (F12)
3. Go to **Console** tab
4. Check for any errors
5. Go to **Network** tab
6. Try logging in
7. Check API calls are going to correct URL

### Expected API Calls:
```
https://job-ezzy-ik6p.vercel.app/api/auth/login
https://job-ezzy-ik6p.vercel.app/api/jobs
https://job-ezzy-ik6p.vercel.app/api/applications
```

---

## 🔧 Common Issues & Fixes

### Issue 1: "Failed to fetch" errors
**Cause:** API URL is wrong or not set
**Fix:** 
1. Check environment variables in Vercel
2. Verify `NEXT_PUBLIC_API_URL` is set correctly
3. Redeploy

### Issue 2: Wallet connection fails
**Cause:** Manifest URL is wrong
**Fix:**
1. Check `NEXT_PUBLIC_TON_CONNECT_MANIFEST` is set
2. Verify it matches your Vercel URL
3. Redeploy

### Issue 3: Database not persisting
**Cause:** SQLite database is in `/tmp` which is ephemeral
**Fix:**
1. This is expected behavior on Vercel
2. Use a persistent database service (MongoDB, PostgreSQL)
3. Or use Vercel KV for caching

### Issue 4: Jobs/Data not showing
**Cause:** Database not initialized or API not working
**Fix:**
1. Check browser console for errors
2. Check Vercel logs
3. Verify API URLs in environment variables
4. Redeploy

---

## 📊 Your Vercel Project Info

**Project Name:** job-ezzy-ik6p  
**Production URL:** https://job-ezzy-ik6p.vercel.app  
**Git Repository:** https://github.com/Rajatgupta94114/JOB_EZZY  

---

## 🔍 Debugging Steps

### 1. Check Vercel Logs:
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Deployments**
4. Click on latest deployment
5. Click **View Logs**
6. Look for any errors

### 2. Check Browser Console:
1. Visit https://job-ezzy-ik6p.vercel.app
2. Press F12 to open DevTools
3. Go to **Console** tab
4. Look for red error messages
5. Check **Network** tab for failed requests

### 3. Test API Directly:
```bash
curl https://job-ezzy-ik6p.vercel.app/api/jobs
```

Should return a JSON array of jobs.

---

## ✨ What Should Work After Setup

✅ User registration and login  
✅ Job creation and browsing  
✅ Job applications  
✅ Escrow contracts  
✅ TON payments  
✅ Coin animations  
✅ Rating system  
✅ Messaging  
✅ Notifications  
✅ All other features  

---

## 📝 Environment Variables Reference

| Variable | Local | Production |
|----------|-------|------------|
| `NEXT_PUBLIC_TON_CONNECT_MANIFEST` | `http://localhost:3000/tonconnect-manifest.json` | `https://job-ezzy-ik6p.vercel.app/tonconnect-manifest.json` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api` | `https://job-ezzy-ik6p.vercel.app/api` |
| `NEXT_PUBLIC_TON_ENDPOINT` | `https://mainnet.toncenter.com/api/v2/jsonRPC` | `https://mainnet.toncenter.com/api/v2/jsonRPC` |
| `NEXT_PUBLIC_TON_NETWORK` | `mainnet` | `mainnet` |

---

## 🚀 Quick Checklist

- [ ] Updated `.env.production` with correct URLs
- [ ] Added environment variables in Vercel dashboard
- [ ] Redeployed the project
- [ ] Checked browser console for errors
- [ ] Tested login functionality
- [ ] Tested job creation
- [ ] Tested API calls in Network tab
- [ ] Verified all features are working

---

## 📞 If Still Not Working

1. **Check Vercel logs** for build or runtime errors
2. **Check browser console** for JavaScript errors
3. **Check Network tab** to see which API calls are failing
4. **Verify environment variables** are set correctly
5. **Redeploy** after making changes
6. **Clear browser cache** (Ctrl+Shift+Delete)
7. **Try incognito mode** to rule out cache issues

---

**Last Updated:** November 29, 2025
**Status:** ✅ Ready to Deploy
