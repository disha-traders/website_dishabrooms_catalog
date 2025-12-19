# Admin Dashboard Documentation

## Overview
The Admin Dashboard is a protected management interface for the Disha Traders website. It allows authorized personnel to manage products, blog posts, site settings, and categories without needing to touch the code. The dashboard is designed with a modern, professional interface using the "Peacock Feather" color palette (#002147 Deep Blue, #00A896 Teal).

## Access
- **URL**: `/admin`
- **Authentication**: Simple password-based authentication.
- **Default Password**: `Usha@Ourcresta@Admin@DishaTraders@2025` (configurable via `VITE_ADMIN_PASSWORD` environment variable).
- **Session**: Login state is persisted using `localStorage` (`admin_auth` key), so users remain logged in across page reloads.

## Features

### 1. Product Management (`ProductsTab`)
The core feature for managing the product catalog.
- **CRUD Operations**: Add, Edit, Delete products.
- **Search & Filter**: Search by name/code and filter by category.
- **Pagination**: Client-side pagination (10 items per page).
- **Bulk Operations**:
  - **CSV Export**: Download current product list or a template.
  - **CSV Import**: Bulk upload products via CSV file.
- **Fields managed**: Name, Code, Category, Size, Description, Image URL (supports Google Drive auto-conversion), Active Status, Sort Order.

### 2. Blog/Magazine Management (`BlogsTab`)
A CMS-like interface for managing the "Disha Magazine".
- **Story Editor**: Create rich blog posts.
- **Dynamic Content Builder**: Add sections of different types:
  - **Text Blocks**: Rich text content.
  - **YouTube Embeds**: Add videos by URL or ID.
  - **Google Drive**: Embed documents or images from Drive.
- **Metadata**: Title, Author, Date, Category (Manufacturing, Women Power, Sustainability, etc.), Read Time.
- **Preview**: Magazine-style card preview in the list view.

### 3. Settings Management (`SettingsTab`)
Controls global website configuration.
- **General Info**: Company Name, Brand Name, Contact Details (Phone, Email, WhatsApp, Address).
- **Branch Locations**: Add/Remove branch cities.
- **Hero Section**: Customize the homepage main banner text (Main Title, Subtitles, promotional text).
- **Social Media**: Manage links for Facebook, Instagram, WhatsApp, LinkedIn, Aratai, and Online Store.
- **Firebase Guide**: Built-in guide for connecting the application to a real Firebase database.

### 4. Category Management
- Manage product categories and their display order.

## Technical Architecture

### Tech Stack
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix Primitives)
- **Icons**: Lucide React

### Data Layer (`db-service.ts`)
The application uses a **Hybrid Data Strategy** designed for rapid prototyping and easy scalability:

1.  **Primary Source (Local Storage)**:
    - All data (Products, Blogs, Settings) is stored in the browser's `localStorage`.
    - This ensures the app works immediately "out of the box" without backend setup.
    - **Mock Data Seeding**: If no data exists, the app automatically seeds itself with high-quality mock data.

2.  **Secondary Source (Firebase)**:
    - The code includes a complete integration with Firebase Firestore.
    - **Dual-Write**: When data is saved, it updates BOTH LocalStorage and Firestore (if configured).
    - **Sync**: On load, it tries to fetch from Firebase. If successful, it updates LocalStorage. If it fails (no API key), it falls back seamlessly to LocalStorage.

### Key Files
- **Entry Point**: `client/src/pages/admin.tsx` - Handles login logic and tab rendering.
- **Layout**: `client/src/components/admin/admin-layout.tsx` - Common shell with header and logout.
- **Data Service**: `client/src/lib/db-service.ts` - Centralized data access layer.
- **Tabs**:
  - `client/src/components/admin/products-tab.tsx`
  - `client/src/components/admin/blogs-tab.tsx`
  - `client/src/components/admin/settings-tab.tsx`

## Code Snippets

### Authentication Check (admin.tsx)
```typescript
const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "DefaultPassword...";
  
  if (password === adminPassword) {
    setIsAuthenticated(true);
    localStorage.setItem("admin_auth", "true");
  } else {
    setError("Incorrect password");
  }
};
```

### Data Service Pattern (db-service.ts)
```typescript
export const dbGetProducts = async (): Promise<Product[]> => {
  // 1. Try Local Storage first for speed
  const localData = localStorage.getItem(LS_PRODUCTS);
  if (localData) return JSON.parse(localData);

  // 2. If no local data, try Firebase if available
  if (isFirebaseAvailable()) {
    try {
      // ... fetch from firestore ...
    } catch (e) { console.warn("Firebase fetch failed", e); }
  }

  // 3. Fallback to Mocks
  return mockProducts;
};
```
