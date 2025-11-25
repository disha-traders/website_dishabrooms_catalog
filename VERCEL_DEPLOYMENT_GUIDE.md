# 🚀 VERCEL DEPLOYMENT GUIDE

**Disha Traders B2B Catalog Website - Complete Vercel Deployment**

---

## 📋 TABLE OF CONTENTS

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Step-by-Step Deployment](#step-by-step-deployment)
3. [Configuration Details](#configuration-details)
4. [Environment Variables](#environment-variables)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)
8. [Rollback Procedures](#rollback-procedures)

---

## ✅ PRE-DEPLOYMENT CHECKLIST

Before deploying to Vercel:

- [ ] All code committed to GitHub
- [ ] Local build succeeds: `npm run build`
- [ ] No console errors in dev mode
- [ ] Environment variables configured locally
- [ ] `.env.local` NOT committed to Git
- [ ] `vercel.json` configured correctly
- [ ] `.vercelignore` file exists
- [ ] All tests passing
- [ ] No breaking changes
- [ ] Documentation updated

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### Step 1: Prepare GitHub Repository

```bash
# 1. Ensure all changes committed
git status

# 2. Commit final changes
git add .
git commit -m "fix: deploy frontend only to vercel"

# 3. Push to main branch
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories
4. Accept permissions

### Step 3: Import GitHub Repository

1. Click **"New Project"** in Vercel dashboard
2. Select your GitHub org: **disha-traders**
3. Search for repo: **website_dishabrooms.com**
4. Click **"Import"**

### Step 4: Configure Build Settings

Vercel should auto-detect these settings, but verify:

```
Framework Preset: Other (or Vite)
Build Command: npm install && npx vite build
Install Command: npm install
Output Directory: dist/public
Root Directory: ./
```

### Step 5: Set Environment Variables

In the "Environment Variables" section, add:

```env
VITE_FIREBASE_API_KEY=AIzaSyDaV8pmNjT5efHIHN_u958XoTkrzMFzYec
VITE_FIREBASE_AUTH_DOMAIN=disha-traders-catalog.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=disha-traders-catalog
VITE_FIREBASE_STORAGE_BUCKET=disha-traders-catalog.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=383575804332
VITE_FIREBASE_APP_ID=1:383575804332:web:908ea6a501e3f63d4c5209
VITE_ADMIN_PASSWORD=Usha@Ourcresta@Admin@DishaTraders@2025
```

### Step 6: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (3-5 minutes)
3. See **"Congratulations! Your site is live"** message
4. Get deployment URL: `https://website-dishabrooms-catalog.vercel.app`

---

## ⚙️ CONFIGURATION DETAILS

### vercel.json

```json
{
  "buildCommand": "npm install && npx vite build",
  "installCommand": "npm install",
  "outputDirectory": "dist/public",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Explanation:**
- `buildCommand`: Only builds frontend (Vite), not backend
- `outputDirectory`: Where Vercel looks for static files
- `routes`: SPA routing configuration (all URLs → index.html)

### .vercelignore

```
server/
dist/index.js
*.ts
!client/
```

**Explanation:**
- Ignores backend files (not needed on Vercel)
- Ignores TypeScript source files
- Only deploys frontend

---

## 🔑 ENVIRONMENT VARIABLES

### Required Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | Firebase authentication |
| `VITE_FIREBASE_AUTH_DOMAIN` | `disha-traders-catalog.firebaseapp.com` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | `disha-traders-catalog` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Firebase storage |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID | Cloud messaging |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Firebase app identifier |
| `VITE_ADMIN_PASSWORD` | `Usha@Ourcresta@Admin@DishaTraders@2025` | Admin login password |

### How to Set Environment Variables

1. Go to **Vercel Project Settings**
2. Click **"Environment Variables"**
3. Add each variable:
   - **Name**: Variable name (e.g., `VITE_FIREBASE_API_KEY`)
   - **Value**: Variable value (e.g., API key)
   - **Environment**: Production, Preview, Development
4. Click **"Save"**
5. Redeploy for changes to take effect

---

## 🌐 CUSTOM DOMAIN SETUP

### Add Custom Domain

1. In Vercel Project Settings → **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain: `website.dishabrooms.com`
4. Choose: **"Use External Nameservers"** (if not using Vercel DNS)

### Update DNS Records

Go to your domain registrar (GoDaddy, Namecheap, etc.):

**Add CNAME Record:**
```
Type: CNAME
Name: website (or @ for root)
Value: cname.vercel-dns.com
TTL: 3600
```

**OR Add A Record:**
```
Type: A
Name: @
Value: 76.76.19.89
TTL: 3600
```

### Wait for DNS Propagation

- DNS takes 24-48 hours to propagate globally
- Check status: [mxtoolbox.com/dns](https://mxtoolbox.com/dns)
- SSL certificate auto-provisions (5-10 minutes)

### Verify Domain

```bash
# Check DNS records
nslookup website.dishabrooms.com

# Check SSL certificate
curl -I https://website.dishabrooms.com
```

---

## 📊 MONITORING & MAINTENANCE

### Performance Monitoring

1. Go to Vercel Dashboard → **"Analytics"**
2. Monitor these metrics:
   - **Page Load Time**: Target < 2 seconds
   - **Response Time**: Target < 500ms
   - **Error Rate**: Target 0%
   - **Bandwidth**: Track usage

### Deployment Monitoring

1. Go to **"Deployments"** tab
2. View each deployment:
   - Build time
   - Status (Ready, Failed, Building)
   - Commit message
   - Deployment URL

### Error Tracking

1. Check **"Functions"** tab for serverless errors
2. View logs: Click deployment → **"Logs"**
3. Identify issues by looking at timestamps

### Health Checks

Perform weekly:

```bash
# Test homepage
curl https://website-dishabrooms-catalog.vercel.app

# Check response time
curl -w "@curl-format.txt" https://website-dishabrooms-catalog.vercel.app

# Test admin page
curl https://website-dishabrooms-catalog.vercel.app/admin
```

---

## 🔧 TROUBLESHOOTING

### Problem: Build Fails

**Check these:**
1. View **Build Logs** in Vercel
2. Look for error messages
3. Common causes:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies
   - Incorrect build command

**Fix:**
```bash
# Test locally first
npm install
npm run build

# If that fails, fix the errors
# Then push and redeploy
```

### Problem: Blank Page on Visit

**Check these:**
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for red errors
4. Common issues:
   - Firebase not loading
   - Missing assets
   - Wrong output directory
   - Routing misconfigured

**Fix:**
```
Verify vercel.json:
  ✓ outputDirectory: "dist/public"
  ✓ buildCommand correct
  ✓ routes configured for SPA
```

### Problem: 404 on Route Changes

**Cause:** SPA routing not configured

**Fix:** Ensure `vercel.json` has:
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Problem: Firebase Not Loading

**Check:**
1. Environment variables set in Vercel
2. Firebase credentials correct
3. Firestore database exists
4. Security rules allow access

**Fix:**
1. Double-check all VITE_* variables
2. Go to Firebase Console → Firestore
3. Verify database is active
4. Check security rules

### Problem: Admin Password Not Working

**Check:**
1. Correct password in env var
2. Password setting correctly in Vercel

**Fix:**
```
VITE_ADMIN_PASSWORD=Usha@Ourcresta@Admin@DishaTraders@2025
```

### Problem: Performance Slow

**Optimize:**
1. Check bundle size (should be < 2MB gzipped)
2. Enable CDN caching
3. Compress images
4. Use dynamic imports

**Check Vercel:**
1. Verify deployment in iad1 region (Washington D.C.)
2. Check bandwidth usage
3. Consider upgrading plan if high traffic

---

## 🔄 ROLLBACK PROCEDURES

### Quick Rollback to Previous Deployment

1. Go to **Vercel Deployments** tab
2. Find previous deployment marked ✅ Ready
3. Click **"..."** menu
4. Select **"Promote to Production"**
5. Confirm rollback

**Takes 30-60 seconds**

### Rollback via GitHub

1. Go to GitHub repository
2. Find previous commit that worked
3. Revert to that commit:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
4. Vercel auto-redeploys (3-5 minutes)

### Complete Rollback

1. Delete current deployment
2. Delete cached builds
3. Clear Vercel cache:
   - Vercel Dashboard → Settings → General
   - Click "Clear Build Cache"
4. Redeploy from good commit

---

## 📈 PERFORMANCE TARGETS

### Load Time Goals
```
Homepage: < 2 seconds
Products: < 2 seconds
Contact: < 1.5 seconds
Admin: < 2 seconds
```

### Lighthouse Targets
```
Performance: 90+
Accessibility: 90+
Best Practices: 90+
SEO: 95+
```

### Optimization Strategies

1. **Image Optimization**
   - Use WebP format where possible
   - Compress images to < 200KB
   - Use lazy loading for images

2. **Code Splitting**
   - Separate admin bundle
   - Lazy load heavy libraries
   - Tree-shake unused code

3. **Caching**
   - Enable browser caching
   - Set cache headers
   - Use CDN for assets

4. **Monitoring**
   - Track Core Web Vitals
   - Monitor error rates
   - Track user experience metrics

---

## 🔐 SECURITY CHECKLIST

- [ ] HTTPS enabled
- [ ] SSL certificate valid
- [ ] No sensitive data in client code
- [ ] Environment variables secure
- [ ] Firebase security rules configured
- [ ] Admin password strong
- [ ] Input validation working
- [ ] CORS properly configured
- [ ] No console errors
- [ ] No mixed content warnings

---

## 📞 SUPPORT & RESOURCES

**Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)  
**Firebase Documentation:** [firebase.google.com/docs](https://firebase.google.com/docs)  
**Vite Documentation:** [vitejs.dev/guide](https://vitejs.dev/guide/)  

**Contact:**
- Email: dishabrooms@gmail.com
- WhatsApp: +91 93218 94001
- GitHub Issues: [Report Issue](https://github.com/disha-traders/website_dishabrooms.com/issues)

---

**Deployment Guide Complete**  
**Last Updated:** November 25, 2025
