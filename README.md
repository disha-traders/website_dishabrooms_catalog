# 🧹 Disha Traders B2B Catalog Website

**Premium Brooms & Cleaning Products | Direct from Tamil Nadu Manufacturer**

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-19.x-blue)
![Vite](https://img.shields.io/badge/Vite-7.x-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-06B6D4)

---

## 📋 Project Overview

**Disha Traders** (Alagu Mayil Brand) is a Tamil Nadu-based cleaning products manufacturer providing a modern B2B catalog platform. The website features:

- ✅ **Dynamic Product Catalog** - Browse 100+ cleaning products
- ✅ **PDF Catalog Generation** - Download professional catalogs on-the-fly
- ✅ **Admin Dashboard** - Manage products, categories, and settings with Firebase Firestore
- ✅ **Contact Management** - WhatsApp & Email integrated inquiries
- ✅ **Offline-First Architecture** - Works with/without backend
- ✅ **Mobile-Responsive Design** - Peacock-themed (#002147, #00A896, #CD7F32)
- ✅ **Firebase Integration** - Real-time data sync (Spark tier compliant)
- ✅ **SEO Optimized** - Open Graph, Twitter Cards meta tags

---

## 🚀 Live Demo

- **Website**: [https://website-dishabrooms.vercel.app](https://website-dishabrooms.vercel.app)
- **GitHub**: [https://github.com/disha-traders/website_dishabrooms.com](https://github.com/disha-traders/website_dishabrooms.com)

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite 7** - Build tool & dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Wouter** - Client-side routing
- **Lucide Icons** - Icon library
- **jsPDF** - PDF generation
- **Framer Motion** - Animations
- **Shadcn/UI** - Component library

### Backend & Database
- **Firebase Firestore** - Cloud database (Spark tier)
- **Express.js** - API server
- **Node.js** - Runtime

### DevOps & Deployment
- **Replit** - Development environment
- **GitHub** - Version control
- **Vercel** - Production deployment

---

## 📁 Project Structure

```
.
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── home.tsx           # Landing page
│   │   │   ├── products.tsx       # Product catalog
│   │   │   ├── contact.tsx        # Contact form
│   │   │   ├── about.tsx          # About company
│   │   │   └── admin.tsx          # Admin dashboard
│   │   ├── components/
│   │   │   ├── layout.tsx         # Main layout
│   │   │   ├── product-card.tsx   # Product display
│   │   │   └── admin/             # Admin components
│   │   ├── lib/
│   │   │   ├── firebase.ts        # Firebase config
│   │   │   ├── db-service.ts      # Database operations
│   │   │   ├── pdf-generator.ts   # PDF generation
│   │   │   └── products.ts        # Mock data
│   │   ├── hooks/
│   │   │   └── use-config.ts      # Configuration hook
│   │   └── App.tsx                # Main app
│   ├── index.html                 # HTML entry
│   └── vite.config.ts             # Vite config
├── server/
│   ├── app.ts                     # Express app
│   ├── routes.ts                  # API routes
│   └── index-dev.ts               # Dev server
├── shared/
│   └── schema.ts                  # Data schemas
├── package.json                   # Dependencies
├── tailwind.config.js             # Tailwind config
├── tsconfig.json                  # TypeScript config
├── vercel.json                    # Vercel config
└── README.md                      # This file
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager
- Firebase account (for Firestore)
- GitHub account (optional, for version control)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/disha-traders/website_dishabrooms.com.git
   cd website_dishabrooms.com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase** (Optional)
   - Create `.env.local` in root:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_ADMIN_PASSWORD=Usha@Ourcresta@Admin@DishaTraders@2025
   ```

4. **Start development server**
   ```bash
   npm run dev:client
   ```

5. **Visit**
   ```
   http://localhost:5000
   ```

---

## 📖 Features

### 1. **Product Catalog**
- Browse all products by category
- Search by product name or code
- Filter by category (Brooms, Mops, Brushes, etc.)
- Product details with pricing and specifications
- Add products to favorites (client-side)

### 2. **Shop Online Integration (NEW)**
- **Dual CTA System**: "Enquire Now" for bulk/B2B and "Shop Online" for retail.
- **Header Integration**: Prominent gradient button in navigation.
- **Product Cards**: Direct retail purchase link on every product.
- **Configurable**: Shop URL managed via Admin Panel.

### 3. **Blogs & Media System (NEW)**
- **Content Management**: Create rich articles with text, YouTube videos, and Drive embeds.
- **Public Blog**: Responsive grid layout for browsing latest updates.
- **Admin Controls**: Full CRUD capabilities for blog posts.

### 4. **PDF Catalog Generation**
- Download professional catalogs
- Auto-organized by category
- 6 products per page in 2x3 grid
- Professional header, hero image, and footer
- Includes company contact details

### 3. **Admin Dashboard**
- **Login**: Password-protected access
- **Products Tab**: Add, edit, delete products
- **Categories Tab**: Manage product categories
- **Settings Tab**: Configure company info, contact details, social links
- **Firebase Integration**: Real-time data sync
- **Offline Support**: Works with LocalStorage fallback

### 4. **Contact System**
- **WhatsApp Integration**: Direct WhatsApp chat button
- **Email Integration**: Opens default mail client
- **Form Validation**: Email, phone, message validation
- **Dual Submission**: Choose WhatsApp or Email
- **Success Feedback**: Confirmation message

### 5. **Design Features**
- **Peacock Theme**: Navy (#002147), Teal (#00A896), Bronze (#CD7F32)
- **Mobile Responsive**: Works on all devices
- **Smooth Animations**: Framer Motion transitions
- **Accessibility**: ARIA labels, semantic HTML, data-testid attributes
- **Modern UI**: Shadcn/UI components with custom styling

---

## 🔐 Admin Access

**URL**: `/admin`
**Password**: `Usha@Ourcresta@Admin@DishaTraders@2025`

### Admin Capabilities
1. **Manage Products**
   - Add new products with name, code, category, price, image URL
   - Edit existing products
   - Delete products
   - Toggle product visibility (active/inactive)

2. **Manage Categories**
   - Add new product categories
   - Edit category names
   - Delete categories
   - Reorder categories

3. **Settings**
   - Company name, brand name, tagline
   - Contact email and phone
   - Factory address
   - Social media links (WhatsApp, Instagram, Facebook)
   - Firebase configuration status

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import GitHub repository
   - Add environment variables:
     - `VITE_ADMIN_PASSWORD=Usha@Ourcresta@Admin@DishaTraders@2025`
   - Click "Deploy"

3. **Custom Domain** (Optional)
   - In Vercel dashboard → Settings → Domains
   - Add your domain (e.g., `dishabrooms.com`)
   - Update DNS records at domain registrar
   - Vercel auto-provisions SSL

---

## 📊 API & Database

### Firebase Collections

**products**
```
{
  id: string,
  name: string,
  code: string,
  category: string,
  price: number,
  imageUrl: string,
  description: string,
  isActive: boolean,
  sortOrder: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**categories**
```
{
  id: string,
  name: string,
  description: string,
  sortOrder: number
}
```

**settings** (optional)
```
{
  brandName: string,
  companyName: string,
  tagline: string,
  contactEmail: string,
  contactPhone: string,
  address: string,
  whatsappLink: string,
  instagramLink: string
}
```

### LocalStorage Backup
- `disha_products` - Product data backup
- `disha_categories` - Category data backup
- `admin_auth` - Admin login session

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Homepage loads with hero image
- [ ] Products page displays all products
- [ ] Category filters work correctly
- [ ] Search functionality searches by name/code
- [ ] PDF catalog downloads correctly
- [ ] Contact form validates inputs:
  - [ ] Email format validation
  - [ ] Phone number (min 10 digits)
  - [ ] Message (min 10 characters)
- [ ] WhatsApp button opens chat
- [ ] Email button opens mail client
- [ ] Admin login works
- [ ] Can add/edit/delete products
- [ ] Can manage categories
- [ ] Mobile responsive on all screens
- [ ] Animations smooth and performant

### Test IDs (for automation)
All interactive elements have `data-testid` attributes:
- `input-name`, `input-email`, `input-phone`, `input-message`
- `button-submit-whatsapp`, `button-submit-email`
- `select-subject`
- `filter-all-items`, `filter-category-*`
- `input-search-products`
- `button-download-catalog`

---

## 🎨 Design System

### Color Palette
```
Primary Dark Blue:  #002147 (Navy)
Primary Teal:       #00A896 (Teal)
Accent Bronze:      #CD7F32 (Bronze)
Light Background:   #F0F4F8
White:              #FFFFFF
```

### Typography
- **Headings**: Oswald (bold, condensed)
- **Body**: Inter (clean, readable)

### Spacing
- Base unit: 4px
- Components use 8px, 16px, 24px, 32px multiples

---

## 🚨 Known Limitations

1. **Firebase Spark Tier**: No server-side image storage (use URL strings)
2. **Offline Mode**: Limited functionality without backend
3. **Admin Password**: Stored in environment variables (not encrypted)
4. **Max Products**: No pagination limit (works fine with 100-200 products)

---

## 🛣️ Roadmap

- [ ] User authentication system
- [ ] Product reviews and ratings
- [ ] Cart and checkout system
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Order management system
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Multi-language support (English/Tamil)
- [ ] SEO blog section
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

1. Clone the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and commit: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📝 Environment Variables

### Required
```
VITE_ADMIN_PASSWORD=Usha@Ourcresta@Admin@DishaTraders@2025
```

### Optional (Firebase)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

---

## 📞 Support

- **Email**: dishabrooms@gmail.com
- **WhatsApp**: [Chat with us](https://wa.me/your_number)
- **Issues**: [GitHub Issues](https://github.com/disha-traders/website_dishabrooms.com/issues)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💼 About Disha Traders

**Disha Traders** (Alagu Mayil Brand) is a leading cleaning products manufacturer based in Tamil Nadu, India. We specialize in:

- ✅ Grass Brooms
- ✅ Coco Brooms  
- ✅ Mops & Brushes
- ✅ Professional Cleaning Equipment
- ✅ Custom Manufacturing

With over a decade of experience, we pride ourselves on quality, durability, and customer satisfaction.

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev) & [Vite](https://vitejs.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Components from [Shadcn/UI](https://ui.shadcn.com)
- Backend powered by [Firebase](https://firebase.google.com)
- Hosted on [Vercel](https://vercel.com)

---

**Last Updated**: November 25, 2025
**Maintained By**: Disha Traders Team
