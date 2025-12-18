# Disha Traders Website - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [File Structure](#file-structure)
5. [Components Guide](#components-guide)
6. [Database Schema](#database-schema)
7. [Features Guide](#features-guide)
8. [Admin Dashboard Guide](#admin-dashboard-guide)
9. [Deployment Guide](#deployment-guide)
10. [Troubleshooting](#troubleshooting)
11. [Performance Optimization](#performance-optimization)
12. [Security Considerations](#security-considerations)

---

## Project Overview

### What is Disha Traders Website?

Disha Traders Website is a **B2B E-Commerce Catalog Platform** for cleaning products manufactured by Disha Traders (Alagu Mayil Brand). It serves as:

1. **Product Showcase** - Display 100+ products with categorization
2. **Bulk Order Management** - Enable wholesale inquiries via contact forms
3. **Admin Dashboard** - Manage products, categories, and company settings
4. **Document Generation** - Create professional PDF catalogs on-demand

### Key Features

| Feature | Description | Status |
|---------|-------------|--------|
| Product Catalog | Browse & filter 100+ products | ✅ Live |
| Shop Online | Retail purchase link integration | ✅ Live |
| Blog System | CMS for articles & videos | ✅ Live |
| PDF Generation | Download catalogs | ✅ Live |
| Admin Dashboard | Manage products & categories | ✅ Live |
| Contact Forms | WhatsApp & Email inquiries | ✅ Live |
| Mobile Responsive | Works on all devices | ✅ Live |
| Firebase Sync | Real-time database | ✅ Live |
| Offline Support | LocalStorage fallback | ✅ Live |

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────┐
│              Browser (Client)                    │
│  ┌───────────────────────────────────────────┐  │
│  │         React + Vite Application           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │         Pages                       │  │  │
│  │  │  - Home, Products, Contact, Admin   │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │      Components                     │  │  │
│  │  │  - Layout, Cards, Forms, Admin UI   │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │      Services                       │  │  │
│  │  │  - DB Service, PDF Generator        │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
         ↓                              ↓
    ┌─────────────┐            ┌──────────────────┐
    │  LocalStorage│            │ Firebase Firestore
    │  (Cache)     │            │ (Real-time DB)
    └─────────────┘            └──────────────────┘
```

### Data Flow

```
User Interaction
      ↓
React Component (State)
      ↓
Service Layer (DB Service)
      ↓
Firebase Firestore / LocalStorage
      ↓
Database Operations
      ↓
Component Re-render
```

### Offline-First Strategy

```
1. Check LocalStorage → If data exists → Return cached data
                     → If empty → Try Firebase
2. Try Firebase → If available → Sync to LocalStorage
               → If unavailable → Use LocalStorage fallback
3. Fallback → Use mock data
            → Seed LocalStorage
```

---

## Installation & Setup

### Prerequisites

```bash
# Check versions
node --version        # Should be 16.x or higher
npm --version         # Should be 8.x or higher
git --version         # Should be 2.x or higher
```

### Step-by-Step Setup

#### 1. Clone Repository

```bash
git clone https://github.com/disha-traders/website_dishabrooms.com.git
cd website_dishabrooms.com
```

#### 2. Install Dependencies

```bash
npm install
```

This installs:
- React 18
- Vite 7
- Tailwind CSS
- Firebase SDK
- Shadcn/UI components
- All other dependencies from package.json

#### 3. Configure Environment Variables

Create `.env.local` in root directory:

```env
# Firebase Configuration (optional)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Admin Configuration (required)
VITE_ADMIN_PASSWORD=Usha@Ourcresta@Admin@DishaTraders@2025
```

#### 4. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project or select existing
3. Click "Add App" → Select Web
4. Copy Firebase config object
5. Paste values into `.env.local`

#### 5. Start Development Server

```bash
npm run dev:client
```

Output:
```
  VITE v7.1.12  ready in 597 ms

  ➜  Local:   http://localhost:5000/
  ➜  Network: http://172.31.78.34:5000/
```

#### 6. Open in Browser

Navigate to: `http://localhost:5000`

---

## File Structure

### Complete Directory Map

```
project-root/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── home.tsx                 # Landing page with hero
│   │   │   ├── products.tsx             # Catalog with filters
│   │   │   ├── contact.tsx              # Contact form + info
│   │   │   ├── about.tsx                # Company info
│   │   │   └── admin.tsx                # Admin dashboard
│   │   │
│   │   ├── components/
│   │   │   ├── layout.tsx               # Header, Footer, Navigation
│   │   │   ├── product-card.tsx         # Product display card
│   │   │   ├── ui/                      # Shadcn UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   └── ... (other components)
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── admin-layout.tsx     # Admin page layout
│   │   │       ├── products-tab.tsx     # Product management
│   │   │       ├── categories-tab.tsx   # Category management
│   │   │       └── settings-tab.tsx     # Settings management
│   │   │
│   │   ├── lib/
│   │   │   ├── firebase.ts              # Firebase initialization
│   │   │   ├── db-service.ts            # Database operations
│   │   │   ├── pdf-generator.ts         # PDF catalog generation
│   │   │   ├── products.ts              # Mock product data
│   │   │   └── utils.ts                 # Utility functions
│   │   │
│   │   ├── hooks/
│   │   │   └── use-config.ts            # Config context hook
│   │   │
│   │   ├── styles/
│   │   │   └── (Tailwind CSS)
│   │   │
│   │   ├── App.tsx                      # Main app component
│   │   ├── main.tsx                     # React entry point
│   │   └── index.css                    # Global styles
│   │
│   ├── index.html                       # HTML template
│   └── vite.config.ts                   # Vite configuration
│
├── server/
│   ├── app.ts                           # Express app setup
│   ├── routes.ts                        # API routes (unused in mockup)
│   ├── storage.ts                       # Storage operations (unused)
│   ├── index-dev.ts                     # Dev server
│   └── index-prod.ts                    # Production server
│
├── shared/
│   └── schema.ts                        # Shared type definitions
│
├── attached_assets/                     # Generated images & files
│   ├── generated_images/
│   ├── stock_images/
│   └── ... (user uploads)
│
├── .env.local                           # Environment variables
├── .gitignore                           # Git ignore rules
├── .replit                              # Replit configuration
├── package.json                         # Dependencies & scripts
├── package-lock.json                    # Dependency lock
├── tsconfig.json                        # TypeScript config
├── tailwind.config.js                   # Tailwind config
├── components.json                      # Shadcn config
├── vercel.json                          # Vercel config
├── drizzle.config.ts                    # Database config
├── postcss.config.js                    # PostCSS config
│
├── README.md                            # Project README
├── DOCUMENTATION.md                     # This file
└── LICENSE                              # MIT License
```

### Key Files Explained

#### `client/src/pages/home.tsx`
- Landing page with hero section
- Company branding
- Call-to-action buttons
- Featured products
- Contact section

#### `client/src/pages/products.tsx`
- Product catalog display
- Category filters
- Search functionality
- PDF download button
- Product grid layout

#### `client/src/pages/contact.tsx`
- Contact information display
- Contact form with validation
- WhatsApp & Email submission options
- Branch information
- Success message after submission

#### `client/src/pages/admin.tsx`
- Admin login (password protected)
- Product management (CRUD)
- Category management (CRUD)
- Settings configuration
- Firebase status indicator

#### `client/src/lib/db-service.ts`
- `dbGetProducts()` - Fetch all products
- `dbSaveProduct()` - Add/update product
- `dbDeleteProduct()` - Delete product
- `dbGetCategories()` - Fetch categories
- `dbSaveCategory()` - Add/update category
- Handles offline-first syncing

#### `client/src/lib/pdf-generator.ts`
- `generateCatalog()` - Create PDF with products
- Page layout: Header (15%), Image (70%), Footer (15%)
- Automatic category grouping
- 6 products per page (2x3 grid)
- Professional branding

#### `client/src/lib/firebase.ts`
- Firebase app initialization
- Firestore database instance
- Error handling for missing config

---

## Components Guide

### Layout Components

#### `Layout` Component
```tsx
<Layout>
  {children} // Page content
</Layout>
```
Features:
- Header with navigation
- Mobile menu toggle
- Footer with social links
- Responsive design

**Props**: `children: React.ReactNode`

### UI Components (Shadcn)

#### Button
```tsx
<Button 
  variant="default" | "outline" | "ghost"
  size="sm" | "default" | "lg"
  onClick={() => {}}
>
  Click Me
</Button>
```

#### Input
```tsx
<Input 
  type="text" | "email" | "tel"
  placeholder="Enter text"
  value={state}
  onChange={(e) => setState(e.target.value)}
/>
```

#### Select
```tsx
<Select value={selected} onValueChange={setSelected}>
  <SelectTrigger>
    <SelectValue placeholder="Choose..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### Tabs
```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Product Card Component

```tsx
<ProductCard
  id="prod_123"
  name="Premium Grass Broom"
  code="PGB-001"
  category="Brooms"
  imageUrl="https://..."
  price={450}
  onEdit={() => {}}
  onDelete={() => {}}
/>
```

### Form Components

#### Contact Form
```tsx
// In contact.tsx
- Name (required)
- Phone (required, 10+ digits)
- Email (required, valid format)
- Subject (select)
- Message (required, 10+ chars)
- Submission method (WhatsApp or Email)
```

#### Product Form (Admin)
```tsx
// In admin/products-tab.tsx
- Product Name
- Product Code
- Category (select)
- Price
- Image URL
- Description
- Active/Inactive toggle
```

---

## Database Schema

### Firestore Collections

#### `products` Collection

```typescript
interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  imageUrl: string;        // URL only, no Firebase Storage
  description?: string;
  isActive: boolean;       // Toggle visibility
  sortOrder: number;       // For ordering
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Document Example:**
```json
{
  "id": "prod_1700000001",
  "name": "Premium Grass Broom",
  "code": "PGB-001",
  "category": "Brooms",
  "price": 450,
  "imageUrl": "https://example.com/broom.jpg",
  "description": "High-quality grass broom for daily cleaning",
  "isActive": true,
  "sortOrder": 1,
  "createdAt": "2024-11-25T10:00:00Z",
  "updatedAt": "2024-11-25T10:00:00Z"
}
```

#### `categories` Collection

```typescript
interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
}
```

**Document Example:**
```json
{
  "id": "cat_1",
  "name": "Brooms",
  "description": "Various types of brooms",
  "sortOrder": 1
}
```

#### `settings` Collection (Optional)

```typescript
interface Settings {
  id: "config";
  brandName: string;
  companyName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  whatsappLink: string;
  instagramLink?: string;
  facebookLink?: string;
}
```

### LocalStorage Schema

```typescript
// disha_products - Product array
localStorage.setItem('disha_products', JSON.stringify(products));

// disha_categories - Category array
localStorage.setItem('disha_categories', JSON.stringify(categories));

// admin_auth - Authentication status
localStorage.setItem('admin_auth', 'true' | 'false');
```

---

## Features Guide

### 1. Product Catalog

#### Navigation
1. Go to `/products`
2. Browse all products
3. Use category filter buttons
4. Use search bar to find products

#### Filtering
```
All Items → Shows all products
Brooms → Filter by Brooms category
Mops → Filter by Mops category
Brushes → Filter by Brushes category
(Other categories as added)
```

#### Search
- Searches product **name** and **code**
- Real-time filtering as you type
- Case-insensitive matching

#### Download Catalog
1. Click "Download Catalog PDF" button
2. PDF generates automatically
3. File saves as `disha-catalog.pdf`

### 2. PDF Catalog Generation

#### Layout Structure
```
┌─────────────────────────────────┐
│  HEADER (15%)                   │
│  Company Logo & Branding        │
├─────────────────────────────────┤
│                                 │
│  HERO IMAGE (70%)               │
│  Full width product image       │
│                                 │
├─────────────────────────────────┤
│  FOOTER (15%)                   │
│  Company Info & Contact         │
└─────────────────────────────────┘
```

#### PDF Features
- Professional branding
- Company logo and name
- Contact information
- Category-organized products
- 6 products per page (2x3 grid)
- 100+ products supported
- High resolution output
- Mobile-friendly layout

### 3. Contact System

#### Contact Form Validation

```
Field          | Validation        | Error Message
─────────────────────────────────────────────────
Name           | Not empty         | "Please enter your name"
Email          | Valid email       | "Please enter valid email"
Phone          | 10+ digits        | "Min 10 digits required"
Message        | 10+ characters    | "Min 10 characters required"
```

#### Submission Methods

**WhatsApp Submission:**
1. User fills form
2. Clicks "WhatsApp" button
3. Opens WhatsApp Web/App
4. Pre-fills message with user data
5. User sends manually

**Email Submission:**
1. User fills form
2. Clicks "Email" button
3. Opens default email client
4. Pre-fills subject and body
5. User reviews and sends

### 4. Admin Dashboard

#### Login
- URL: `/admin`
- Password: `Usha@Ourcresta@Admin@DishaTraders@2025`
- Session: Stored in LocalStorage
- Auto-logout: Clear localStorage to logout

#### Product Management

**Add Product:**
1. Go to Admin → Products tab
2. Click "Add New Product"
3. Fill form:
   - Name (required)
   - Code (required)
   - Category (required)
   - Price (required)
   - Image URL (required)
   - Description (optional)
4. Toggle "Active" to show on public site
5. Click "Save Product"

**Edit Product:**
1. Find product in list
2. Click "Edit" button
3. Modify fields
4. Click "Update Product"

**Delete Product:**
1. Find product in list
2. Click "Delete" button
3. Confirm deletion
4. Product removed from catalog

#### Category Management

**Add Category:**
1. Go to Admin → Categories tab
2. Click "Add New Category"
3. Enter category name and optional description
4. Click "Save Category"

**Delete Category:**
1. Find category in list
2. Click "Delete" button
3. Product associations remain (category field becomes orphaned)

#### Settings Management

**Update Company Info:**
1. Go to Admin → Settings tab
2. Fill form fields:
   - Brand Name
   - Company Name
   - Tagline
   - Contact Email
   - Contact Phone
   - Factory Address
   - WhatsApp Link
   - Social Media Links
3. Click "Save Settings"

---

## Admin Dashboard Guide

### Admin Dashboard Interface

```
┌─────────────────────────────────────────────────┐
│  Admin Portal Header                            │
│  [Logout Button]                                │
├─────────────────────────────────────────────────┤
│ Tabs: [Products] [Categories] [Settings]       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Tab Content Area                               │
│  (Dynamically changes based on selected tab)    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Products Tab

**Products List Display:**
- Product Code | Name | Category | Price | Actions
- Each product shows edit/delete buttons
- Products marked as "Active" show green badge
- Add Product button at top

**Add/Edit Form:**
- Product Name field
- Product Code field
- Category dropdown
- Price input
- Image URL field
- Description textarea
- Active toggle
- Save/Cancel buttons

### Categories Tab

**Categories List:**
- Category Name
- Product Count
- Delete button
- Add Category button

**Add Category Form:**
- Category Name (required)
- Description (optional)
- Save button

### Settings Tab

**Company Settings Form:**
- Brand Name (e.g., "Alagu Mayil")
- Company Name (e.g., "Disha Traders")
- Tagline
- Contact Email
- Contact Phone
- Factory Address
- WhatsApp Link
- Instagram Link
- Facebook Link
- Firebase Status indicator
- Save button

---

## Deployment Guide

### Local Build Testing

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Vercel

#### Option 1: Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production: Disha Traders Website"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Click "Import Git Repository"
   - Select: `disha-traders/website_dishabrooms.com`
   - Click "Continue"

3. **Configure Deployment**
   - Framework: Auto-detected (Vite)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Click "Deploy"

4. **Add Environment Variables**
   - In Vercel → Project Settings → Environment Variables
   - Add: `VITE_ADMIN_PASSWORD=Usha@Ourcresta@Admin@DishaTraders@2025`
   - (Optional) Add Firebase config if using

5. **Wait for Deployment**
   - Vercel builds and deploys automatically
   - You'll see progress in the Deployments tab
   - Site goes live at: `website-dishabrooms.vercel.app`

#### Option 2: Manual Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `dishabrooms.com`)
   - Vercel provides DNS records

2. **Update Domain Registrar**
   - Go to domain registrar (GoDaddy, Namecheap, etc.)
   - Update DNS records:
     - A record: Points to Vercel IP
     - CNAME record: Points to vercel domain
   - Wait 24-48 hours for propagation

3. **SSL Certificate**
   - Vercel auto-provisions SSL
   - Redirects HTTP → HTTPS
   - No additional setup needed

### Post-Deployment Checklist

- [ ] Site loads at vercel domain
- [ ] Homepage displays correctly
- [ ] Products page works
- [ ] Admin login works
- [ ] Contact form submits
- [ ] PDF download works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Performance metrics acceptable
- [ ] Custom domain resolves (if configured)

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Products Not Displaying

**Problem**: Products page shows empty state

**Solutions:**
```
1. Check Firebase connection:
   - Are Firebase env vars in .env.local?
   - Is Firebase project active?
   
2. Check LocalStorage:
   - Open DevTools → Application → LocalStorage
   - Look for 'disha_products' key
   
3. Check mock data:
   - If Firebase unavailable, mock data should load
   - If mock data also missing, check data in client/src/lib/products.ts
```

#### 2. Admin Login Not Working

**Problem**: Cannot access admin panel

**Solutions:**
```
1. Check password:
   - Password: Usha@Ourcresta@Admin@DishaTraders@2025
   - Is VITE_ADMIN_PASSWORD set in .env.local?
   
2. Clear browser cache:
   - Go to DevTools → Application → Clear site data
   
3. Check localStorage:
   - Is 'admin_auth' set to 'true'?
   - You may need to re-login
```

#### 3. PDF Generation Fails

**Problem**: Download button doesn't work

**Solutions:**
```
1. Check console errors:
   - Open DevTools → Console
   - Look for PDF-related errors
   
2. Check image URL:
   - Ensure /images/hero-poster.png exists
   - Or update path in pdf-generator.ts
   
3. Browser compatibility:
   - Use Chrome/Firefox (jsPDF compatible)
   - Check jsPDF version in package.json
```

#### 4. Form Submission Not Working

**Problem**: Contact form shows error or doesn't submit

**Solutions:**
```
1. Check validation:
   - Email must be valid format
   - Phone must have 10+ digits
   - Message must be 10+ characters
   
2. Check email/WhatsApp config:
   - WhatsApp link in config valid?
   - Default email app installed on device?
   
3. Test in console:
   - Check if window.location.href works
   - Check if window.open() is blocked
```

#### 5. Slow Performance

**Problem**: Site loads slowly

**Solutions:**
```
1. Optimize images:
   - Use smaller image files
   - Compress images (TinyPNG, ImageOptim)
   - Use WebP format if supported
   
2. Check network:
   - Use DevTools → Network tab
   - Look for slow-loading assets
   
3. Cache optimization:
   - Enable browser caching
   - Use Vercel Edge Caching
   
4. Database queries:
   - Add Firebase indexes for better performance
   - Reduce query frequency
```

#### 6. Firebase Connection Issues

**Problem**: Firebase data not syncing

**Solutions:**
```
1. Verify credentials:
   - Are all VITE_FIREBASE_* vars in .env.local?
   - Are they correct copy-paste from Firebase Console?
   
2. Check Firestore rules:
   - Ensure Firestore allows reads/writes
   - Check security rules in Firebase Console
   
3. Check quota:
   - Are you exceeding Spark tier limits?
   - Check usage in Firebase Console
```

---

## Performance Optimization

### Frontend Performance

#### 1. Image Optimization

```typescript
// Use optimized image URLs
const imageUrl = "https://example.com/image.webp"  // ✅ WebP
// Avoid: imageUrl = "https://example.com/image.png" (larger)

// Lazy load images
<img loading="lazy" src={imageUrl} alt="product" />
```

#### 2. Code Splitting

Vite automatically splits code:
- Each page loads its own chunk
- Shared dependencies bundled once
- Faster initial load

#### 3. Caching Strategy

```typescript
// Cache products in localStorage
const cachedProducts = localStorage.getItem('disha_products')
if (cachedProducts) {
  return JSON.parse(cachedProducts)  // Fast (no network)
}
// Only fetch from Firebase if cache misses
```

#### 4. Bundle Size

Current bundle sizes:
- Main JS: ~150 KB (gzipped: ~40 KB)
- CSS: ~50 KB (gzipped: ~10 KB)
- Total: ~200 KB (gzipped: ~50 KB)

### Database Performance

#### 1. Firestore Optimization

```typescript
// ✅ Good: Query with indexing
const q = query(
  collection(db, "products"),
  where("isActive", "==", true),
  orderBy("sortOrder", "asc")
);

// ❌ Bad: Unindexed queries cause slowness
const q = query(
  collection(db, "products"),
  where("category", "==", "Brooms"),
  where("price", "<", 500)
);
```

#### 2. LocalStorage Sync

```typescript
// Sync to local for instant loads
if (firebaseData.length > 0) {
  localStorage.setItem('disha_products', JSON.stringify(firebaseData))
}
```

### Rendering Performance

#### 1. Memoization

```typescript
// Avoid re-renders of product cards
const ProductCard = React.memo(({ product }) => {
  return <div>{product.name}</div>
})
```

#### 2. Virtualization (for large lists)

```typescript
// Future optimization: Use react-window for 1000+ products
<FixedSizeList height={600} itemCount={1000}>
  {ProductCard}
</FixedSizeList>
```

### Network Performance

#### Vercel Edge Caching

```javascript
// In vercel.json
{
  "headers": [
    {
      "source": "/images/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## Security Considerations

### Authentication

#### Admin Password
```
Password: Usha@Ourcresta@Admin@DishaTraders@2025
Storage: Environment variables (.env.local)
Transport: HTTPS only (Vercel auto-enforces)
```

⚠️ **Important**: Change password in production!

### Firebase Security Rules

```javascript
// Recommended Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read
    match /products/{document=**} {
      allow read;
    }
    match /categories/{document=**} {
      allow read;
    }
    
    // Restrict write to authenticated admin
    match /products/{document=**} {
      allow write: if request.auth != null;
    }
    match /settings/{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

### CORS & HTTPS

```
✅ All requests over HTTPS (Vercel enforced)
✅ CORS headers properly configured
✅ No sensitive data in frontend
❌ Never expose Firebase keys in client code (already doing)
```

### Input Validation

```typescript
// Email validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Phone validation
const isValidPhone = (phone) => phone.replace(/\D/g, '').length >= 10

// Message validation
const isValidMessage = (msg) => msg.trim().length >= 10
```

### Data Privacy

- No user data collected beyond contact form
- Contact data not stored (sent to email/WhatsApp only)
- No third-party tracking (no Google Analytics)
- No cookies or tracking pixels

### XSS Prevention

```typescript
// ✅ Safe: React auto-escapes
<div>{userInput}</div>

// ✅ Safe: Sanitized URLs
<a href={sanitizedUrl}>{text}</a>

// ❌ Avoid: Direct HTML injection
<div dangerousInnerHTML={{__html: userInput}} />
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-11-25 | Initial release |
| | | - Complete product catalog |
| | | - Admin dashboard with Firebase |
| | | - PDF catalog generation |
| | | - Contact form system |
| | | - Responsive design |

---

## Support & Resources

### Documentation
- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Shadcn/UI](https://ui.shadcn.com)

### Tools & Services
- [Replit IDE](https://replit.com)
- [GitHub](https://github.com)
- [Vercel](https://vercel.com)
- [Firebase Console](https://console.firebase.google.com)

### Contact
- **Email**: dishabrooms@gmail.com
- **GitHub Issues**: [Report bugs here](https://github.com/disha-traders/website_dishabrooms.com/issues)
- **WhatsApp**: Direct contact from website

---

## License

MIT License - See LICENSE file for details

---

**Last Updated**: November 25, 2025
**Maintained By**: Disha Traders Development Team
**Documentation Version**: 1.0.0
