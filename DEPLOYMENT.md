# 🚀 Deployment Guide

**Complete guide to deploying Disha Traders B2B Catalog Website**

---

## Table of Contents

1. [Deployment Options](#deployment-options)
2. [Vercel Deployment](#vercel-deployment)
3. [Environment Setup](#environment-setup)
4. [Custom Domain](#custom-domain)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)
8. [Rollback](#rollback)

---

## Deployment Options

| Platform | Cost | Setup Time | Recommended |
|----------|------|-----------|-------------|
| **Vercel** | Free tier | 5 min | ✅ Yes |
| **Netlify** | Free tier | 5 min | Good |
| **GitHub Pages** | Free | 10 min | For static only |
| **AWS** | Varies | 30 min | Enterprise |
| **Docker** | Varies | 20 min | Self-hosted |

---

## Vercel Deployment

### Prerequisites

- GitHub account with repo
- Vercel account (free)
- Environment variables ready

### Step 1: Connect GitHub

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access repos
4. Select repository: `website_dishabrooms.com`

### Step 2: Configure Project

```
Project Settings:
- Framework: Vite
- Build Command: npm run build
- Output Directory: dist
- Install Command: npm install
```

### Step 3: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```env
VITE_FIREBASE_API_KEY=AIzaSyD_XXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=disha-traders.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=disha-traders
VITE_FIREBASE_STORAGE_BUCKET=disha-traders.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

VITE_ADMIN_PASSWORD=Usha@Ourcresta@Admin@DishaTraders@2025
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 min)
3. Get deployment URL: `https://website-dishabrooms.vercel.app`

---

## Environment Setup

### Firebase Configuration

#### Get Firebase Credentials

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create new project or select existing
3. Go to Project Settings
4. Copy Web SDK config

```javascript
// Example config (yours will differ)
{
  "apiKey": "AIzaSyD_...",
  "authDomain": "disha-traders.firebaseapp.com",
  "projectId": "disha-traders",
  "storageBucket": "disha-traders.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:..."
}
```

#### Enable Firestore

1. In Firebase Console → Database
2. Create Cloud Firestore
3. Start in Production Mode
4. Set security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow reads/writes from authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // For public read (optional)
    match /products/{document=**} {
      allow read: if true;
    }
    match /categories/{document=**} {
      allow read: if true;
    }
  }
}
```

### Environment Variables

#### Local Development

Create `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_PASSWORD=Usha@Ourcresta@Admin@DishaTraders@2025
```

#### Production (Vercel)

Set in Vercel Dashboard → Settings → Environment Variables

---

## Custom Domain

### Add Custom Domain

1. In Vercel Dashboard → Settings → Domains
2. Add domain: `website.dishabrooms.com`
3. Vercel shows DNS records

### Update DNS Records

At your domain registrar (GoDaddy, Namecheap, etc.):

```
Add these records:
Type: CNAME
Name: website
Value: cname.vercel-dns.com.

Or:

Type: A
Name: website
Value: 76.76.19.89
```

### SSL Certificate

- Vercel auto-provisions SSL
- Wait 24-48 hours for activation
- Check HTTPS working

### DNS Propagation

Check status at [mxtoolbox.com](https://mxtoolbox.com):

```
1. DNS propagation takes 24-48 hours
2. Can take up to 24 hours to activate globally
3. Check from different locations
4. Email DNS lookup if needed
```

---

## CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Type check
        run: npm run check
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Manual Deployment

```bash
# 1. Push to main branch
git add .
git commit -m "feat: add new feature"
git push origin main

# 2. Vercel auto-deploys
# 3. Check deployment status in Vercel dashboard
```

---

## Monitoring

### Performance Monitoring

```
Vercel Dashboard → Analytics:
- Page views
- Response time
- Error rate
- Serverless functions
```

### Error Tracking

Monitor these:
- Browser console errors
- Firebase errors
- Network failures
- Form submission failures

### Health Checks

```bash
# Check if site is up
curl https://website-dishabrooms.vercel.app

# Check Firebase connection
Visit /admin panel and verify connection
```

### Logs

View logs in:
1. Vercel Dashboard → Deployments → Logs
2. Firebase Console → Firestore logs
3. Browser console (F12 → Console)

---

## Troubleshooting

### Build Fails

**Error: Cannot find module**

```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: TypeScript errors**

```bash
# Check types
npm run check

# Fix errors before building
```

### Deployment Fails

**Vercel deployment stuck**

```
1. Cancel current deployment
2. Clear build cache in settings
3. Re-deploy
4. Check environment variables
```

**Missing environment variables**

```
Vercel Dashboard → Settings → Environment Variables
- Verify all VITE_* variables set
- Redeploy after changes
```

### Firebase Not Loading

**Error: Firebase initialization failed**

```
1. Check API key in .env
2. Verify Firebase project is active
3. Check firestore database exists
4. Verify security rules
```

**Collections not appearing**

```
1. Go to Firebase Console → Firestore
2. Manually create collections:
   - /products
   - /categories
   - /settings
3. Add sample data
```

### WhatsApp Not Working

**WhatsApp link not opening**

```
Check in browser console:
- config.social.whatsappLink correct?
- config.contact.whatsapp set?
- WhatsApp Web available in region?
```

### Images Not Loading

**Hero image or product images blank**

```
1. Check image URLs accessible
2. Verify URLs are HTTPS
3. Check CORS headers
4. Try accessing URL directly in browser
```

---

## Rollback

### Revert to Previous Deployment

#### Via Vercel Dashboard

1. Go to Vercel Dashboard → Deployments
2. Find previous deployment
3. Click "..." → Promote to Production
4. Confirm rollback

#### Via GitHub

```bash
# Find previous commit
git log --oneline

# Revert to specific commit
git revert abc123def456

# Push revert
git push origin main

# Vercel auto-deploys
```

---

## Performance Optimization

### Build Optimization

```bash
# Check build size
npm run build
ls -lh dist/

# Optimize bundle
- Remove unused dependencies
- Enable code splitting
- Use dynamic imports
```

### Runtime Optimization

- Enable gzip compression (automatic on Vercel)
- Optimize images (use external URLs)
- Minimize CSS/JS

### Database Optimization

- Index frequently queried fields
- Cache settings in localStorage
- Use offline-first architecture

---

## Security Checklist

- [ ] Environment variables secure (not in .gitignore)
- [ ] Firebase security rules configured
- [ ] Admin password strong and unique
- [ ] HTTPS enabled
- [ ] Custom domain SSL active
- [ ] No secrets in code
- [ ] No console.log of sensitive data

---

## Post-Deployment Verification

```bash
# 1. Test public site
curl https://website.dishabrooms.com

# 2. Test admin login
Visit /admin
Enter password: Usha@Ourcresta@Admin@DishaTraders@2025

# 3. Test contact form
Fill form and submit

# 4. Test download catalog
Click "Download Catalog PDF"

# 5. Check responsive
Test on mobile/tablet/desktop

# 6. Check SEO
Verify meta tags present
```

---

## Monitoring Checklist

- [ ] Vercel dashboard shows green deployments
- [ ] No Firebase errors in console
- [ ] Products loading correctly
- [ ] Admin panel accessible
- [ ] Forms working
- [ ] PDF generation working
- [ ] WhatsApp links opening
- [ ] Performance acceptable
- [ ] No 404 errors

---

**Last Updated:** November 25, 2025
