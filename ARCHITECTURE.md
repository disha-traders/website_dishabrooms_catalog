# 🏗️ System Architecture

**Disha Traders B2B Catalog Website - Architecture & Design**

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [System Components](#system-components)
3. [Data Flow](#data-flow)
4. [Database Design](#database-design)
5. [Frontend Architecture](#frontend-architecture)
6. [State Management](#state-management)
7. [Authentication](#authentication)
8. [API Design](#api-design)
9. [Scalability](#scalability)
10. [Security Architecture](#security-architecture)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React/Vite)                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Pages: Home, Products, Contact, About, Admin     │ │
│  │  Components: Layout, ProductCard, Forms           │ │
│  │  Hooks: use-config, use-mobile                    │ │
│  └────────────────────────────────────────────────────┘ │
│                           ↑                             │
│                    State Management                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │  React Context + Hooks + React Query             │ │
│  │  LocalStorage (Offline-First)                    │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                           ↓
            ┌──────────────────────────────┐
            │  API Layer (db-service.ts)   │
            │  - Firebase Firestore        │
            │  - LocalStorage Fallback     │
            └──────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              FIREBASE (Backend as Service)              │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Firestore Database                              │ │
│  │  ├── /products                                   │ │
│  │  ├── /categories                                 │ │
│  │  ├── /blogs                                      │ │
│  │  └── /settings                                   │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## System Components

### Frontend Stack

```
Application Layer
  ├── Pages (Route handlers)
  │   ├── home.tsx
  │   ├── products.tsx
  │   ├── contact.tsx
  │   ├── about.tsx
  │   └── admin.tsx
  │
  ├── Components
  │   ├── Layout (Header/Footer/Nav)
  │   ├── ProductCard
  │   ├── Forms
  │   └── Admin Components
  │
  └── Hooks & Utilities
      ├── use-config (Config management)
      ├── use-mobile (Responsive)
      └── Helpers (PDF, validation)

Data Layer
  ├── Firestore (Primary)
  ├── LocalStorage (Backup)
  ├── React Query (Caching)
  └── React Context (State)

Styling Layer
  ├── Tailwind CSS v4
  ├── Custom CSS
  └── Component Library (Radix UI)
```

### Backend Stack

```
Firebase Firestore
  ├── Collections
  │   ├── /products
  │   ├── /categories
  │   ├── /blogs
  │   └── /settings
  │
  ├── Security Rules
  │   ├── Read: Public (products/categories)
  │   └── Write: Authenticated only
  │
  └── Triggers (Optional)
      ├── Auto-backup
      └── Data validation
```

---

## Data Flow

### Product Catalog Flow

```
User Visits /products
  ↓
Load Products:
  1. Try Firestore API
  2. On success → Cache in localStorage
  3. On error → Use localStorage cache
  4. On cache miss → Use mock data
  ↓
Render ProductCard × N
  ↓
Filter/Search:
  1. Client-side filtering (fast)
  2. Update UI in real-time
  ↓
Download Catalog:
  1. Fetch all active products
  2. Generate PDF (jsPDF)
  3. Download to device
```

### Admin Settings Flow

```
Admin Edits Settings
  ↓
Form Submission
  ↓
Validation (Client-side)
  ↓
setDoc to Firestore
  ↓
Success:
  - Update localStorage backup
  - Update React Context
  - Show success message
  ↓
Error:
  - Log to console
  - Keep localStorage version
  - Show error message
  ↓
use-config Hook Detects Change
  ↓
Components Re-render with New Config
```

### Contact Form Flow

```
User Fills Contact Form
  ↓
Client-side Validation
  ├── Name required
  ├── Valid email format
  ├── Phone: 10+ digits
  └── Message: 10+ chars
  ↓
Choose Submission Method:
  
  Email Path:
    1. Open mailto: link
    2. User's email client opens
    3. Pre-filled subject & body
  
  WhatsApp Path:
    1. Use config.contact.whatsapp
    2. Open wa.me link
    3. Pre-formatted message
  ↓
Show Success Message
  ↓
Reset Form
```

---

## Database Design

### Firestore Collections

#### `/products` Collection

```javascript
{
  // Auto-generated document ID
  "GrX2mK9pL1": {
    name: "Grass Broom Premium",
    code: "GB-001",
    category: "Grass Brooms",
    price: 450,
    imageUrl: "https://example.com/image.jpg",
    description: "Premium quality grass broom",
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}
```

**Indexes:**
- `category` - For filtering
- `isActive` - Show only active products
- `sortOrder` - For sorting

#### `/categories` Collection

```javascript
{
  "cat001": {
    name: "Grass Brooms",
    description: "Soft grass brooms",
    sortOrder: 1
  }
}
```

**Indexes:**
- `sortOrder` - Display order

#### `/blogs` Collection

```javascript
{
  "blog_123": {
    title: "How Village Women Power Disha...",
    date: "2025-01-20",
    author: "Priya Sharma",
    category: "Women Power",
    readTime: "6 min read",
    sections: [
      { type: "text", content: "..." },
      { type: "youtube", videoId: "..." }
    ]
  }
}
```

**Indexes:**
- `date` - For sorting by newest first

#### `/settings` Document

```javascript
{
  // Single document per setting
  "companyConfig": {
    companyName: "Disha Traders",
    brandName: "Alagu Mayil",
    tagline: "All Cleaning Products...",
    
    contact: {
      phone: "+91 98765 43210",
      whatsapp: "919876543210",
      email: "contact@dishatraders.in",
      address: "123 Industrial Estate..."
    },
    
    social: {
      whatsappLink: "https://wa.me/919876543210",
      facebookLink: "...",
      instagramLink: "...",
      linkedinLink: "...",
      arataiLink: "..."
    },
    
    hero: {
      mainTitle: "Premium Brooms...",
      title2: "All Housekeeping...",
      title3: "India's Premium ",
      title4: "Cleaning Brand",
      subtitle: "Direct from the Manufacturer"
    },
    
    branches: ["Delhi", "Mumbai", "Tiruchi", "Coimbatore", "Krishnagiri"]
  }
}
```

---

## Frontend Architecture

### Component Hierarchy

```
App
├── Router (Wouter)
│   ├── Home
│   │   ├── HeroSection
│   │   ├── CategoriesGrid
│   │   └── FeaturedProducts
│   │
│   ├── Products
│   │   ├── CategoryFilter
│   │   ├── SearchBar
│   │   └── ProductGrid
│   │       └── ProductCard × N
│   │
│   ├── Contact
│   │   ├── ContactForm
│   │   └── ContactInfo
│   │
│   ├── About
│   │   ├── HeroSection
│   │   └── CompanyInfo
│   │
│   └── Admin
│       ├── LoginForm
│       └── AdminDashboard
│           ├── ProductsTab
│           ├── CategoriesTab
│           └── SettingsTab
│
└── Layout (Wrapper)
    ├── Header (Navigation)
    └── Footer (Contact & Social)
```

### State Management Pattern

```
Global State (Context):
  - Config (Company settings)
  - Auth (Admin login status)

Component State (Hooks):
  - Form inputs
  - UI state (loading, error)
  - Pagination

Side Effects (useEffect):
  - Fetch data on mount
  - Auto-save to localStorage
  - Sync with Firestore
```

### Data Caching Strategy

```
Request for Data
  ↓
Check React Query Cache
  ├── Hit: Return cached data
  └── Miss: Continue
  ↓
Check localStorage
  ├── Hit: Return cached data
  └── Miss: Continue
  ↓
Fetch from Firestore
  ├── Success: Cache everywhere
  └── Error: Use fallback data
```

---

## State Management

### useConfig Hook Architecture

```typescript
useConfig() {
  const [config, setConfig] = useState(defaultConfig);
  
  useEffect(() => {
    // 1. Try Firebase
    const savedSettings = await dbGetSettings();
    
    if (savedSettings) {
      // 2. Merge with defaults
      const merged = { ...defaultConfig, ...savedSettings };
      
      // 3. Generate WhatsApp link
      const phone = merged.contact.whatsapp.replace(/\D/g, "");
      merged.social.whatsappLink = `https://wa.me/${phone}`;
      
      setConfig(merged);
    }
  }, []);
  
  return config;
}
```

### Local Storage Backup

```
Keys:
- disha_products: Product data backup
- disha_categories: Category backup
- disha_settings: Configuration backup
- admin_auth: Login session

Strategy:
- Write to localStorage after every change
- Read from localStorage if Firestore fails
- Clear on logout (admin_auth only)
```

---

## Authentication

### Admin Authentication Flow

```
User Opens /admin
  ↓
Check localStorage.admin_auth
  ├── "true": Show dashboard
  └── Not found: Show login form
  ↓
User Enters Password
  ↓
Validate Against VITE_ADMIN_PASSWORD
  ├── Correct: Set admin_auth = "true"
  └── Wrong: Show error
  ↓
Logout: Remove admin_auth + Clear password
```

### Security Considerations

- Password stored in environment variable (not code)
- Session in localStorage (not secure storage, but acceptable for admin)
- No persistent backend authentication
- Re-authentication on page refresh (stateless)

---

## API Design

### Database Service Interface

```typescript
// Products
dbGetProducts(): Promise<Product[]>
dbAddProduct(product): Promise<string>
dbUpdateProduct(id, data): Promise<void>
dbDeleteProduct(id): Promise<void>

// Categories
dbGetCategories(): Promise<Category[]>
dbAddCategory(name): Promise<void>
dbDeleteCategory(name): Promise<void>

// Blogs
dbGetBlogs(): Promise<Blog[]>
dbSaveBlog(blog, id?): Promise<void>
dbDeleteBlog(id): Promise<void>

// Settings
dbGetSettings(): Promise<Config>
dbSaveSettings(config): Promise<void>
```

### Error Handling Strategy

```
Try Operation
  ├── Success: Return data
  └── Error:
      1. Log error to console
      2. Fallback to localStorage
      3. Show user-friendly message
      4. No crash
```

---

## Scalability

### Current Limits

- Firestore: 10,000 reads/day (Spark tier)
- Products: 100-200 recommend max
- Categories: 20-50 max
- Users: No user management (static)

### Scaling Strategy (Future)

```
Phase 1 (Current):
- Static pages
- Mock data + Firestore
- LocalStorage backup

Phase 2:
- User authentication
- Cart system
- Order management

Phase 3:
- Multi-tenant
- Advanced analytics
- Custom reporting

Phase 4:
- Mobile app
- Multi-language
- Payment processing
```

---

## Security Architecture

### Frontend Security

```
Input Validation:
  - Email regex validation
  - Phone number format check
  - XSS prevention via React escaping
  - Message length validation

Data Protection:
  - No sensitive data in localStorage
  - No API keys in frontend
  - No secrets in code
```

### Backend Security (Firebase)

```
Firestore Rules:
  - Public read for products/categories
  - Authenticated write only
  - No Storage bucket (images via URLs)
  - Rate limiting via Firebase

Environment:
  - Secrets in .env (not committed)
  - HTTPS everywhere
  - CORS configured
```

### Communication Security

```
HTTPS:
  - All traffic encrypted
  - SSL/TLS enforced
  - Certificate auto-renewal (Vercel)

API:
  - CORS headers set
  - Request validation
  - Rate limiting
```

---

## Deployment Architecture

```
Development:
  Vite Dev Server → http://localhost:5000

Production:
  GitHub → Vercel → Edge Network
    ├── Built: npm run build
    ├── Output: /dist folder
    ├── Hosted: Vercel CDN
    └── Domain: website-dishabrooms.vercel.app

Custom Domain:
  website.dishabrooms.com → Vercel → CDN
    └── SSL: Auto-provisioned
```

---

## Performance Optimization

### Build-Time

```
- Tree-shaking: Remove unused code
- Code splitting: Lazy load components
- CSS purging: Remove unused styles
- Image optimization: Compress images
```

### Runtime

```
- Component memoization: useMemo, useCallback
- Request deduplication: React Query
- Cache strategy: LocalStorage + Firestore
- Lazy loading: Dynamic imports
```

### Metrics

```
- Page Load: < 2s
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Lighthouse Score: 95+
```

---

## Monitoring & Observability

### Monitoring Points

```
Frontend:
  - Console errors
  - Network failures
  - Form submission failures
  - Component render errors

Backend (Firebase):
  - Database errors
  - Security rule violations
  - Query performance
  - Data consistency

Infrastructure:
  - Deployment status
  - Build failures
  - Performance metrics
  - Error rates
```

---

**Last Updated:** November 25, 2025
