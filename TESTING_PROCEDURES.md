# 🧪 COMPREHENSIVE TESTING PROCEDURES

**Disha Traders B2B Catalog Website - Testing Manual**

---

## 📋 TABLE OF CONTENTS

1. [Test Environment Setup](#test-environment-setup)
2. [Functional Testing](#functional-testing)
3. [Performance Testing](#performance-testing)
4. [Security Testing](#security-testing)
5. [Accessibility Testing](#accessibility-testing)
6. [Cross-Browser Testing](#cross-browser-testing)
7. [Test Automation](#test-automation)
8. [Bug Reporting](#bug-reporting)

---

## 🔧 TEST ENVIRONMENT SETUP

### Local Environment

```bash
# 1. Clone repository
git clone https://github.com/disha-traders/website_dishabrooms.com.git
cd website_dishabrooms.com

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with Firebase credentials

# 4. Start dev server
npm run dev:client

# 5. Access on http://localhost:5000
```

### Test Data Setup

```bash
# 1. In browser, go to /admin
# 2. Enter password: Usha@Ourcresta@Admin@DishaTraders@2025
# 3. Add test products:
#    - Name: "Test Broom", Code: "TB-001", Category: "Grass Brooms", Price: 500
#    - Name: "Test Mop", Code: "TM-001", Category: "Yarn Mops", Price: 800
# 4. Update settings with test contact info
```

---

## ✅ FUNCTIONAL TESTING

### Test Case 1: Homepage Loading

**Objective:** Verify homepage loads correctly with all elements

**Steps:**
1. Navigate to http://localhost:5000
2. Observe page load time
3. Check hero section displays
4. Verify all navigation items visible

**Expected Results:**
- ✓ Page loads in < 2 seconds
- ✓ Hero image displays
- ✓ Navigation menu visible
- ✓ CTA buttons functional

**Test ID:** `test-homepage-load`

---

### Test Case 2: Product Catalog Navigation

**Objective:** Verify product filtering and search works

**Steps:**
1. Click "Products" in navigation
2. Verify all products display
3. Click category filter: "Grass Brooms"
4. Enter search term: "Broom"
5. Clear search

**Expected Results:**
- ✓ Products page loads
- ✓ All products initially shown
- ✓ Filter narrows results correctly
- ✓ Search finds matching products
- ✓ Results update in real-time

**Test ID:** `test-product-filtering`

---

### Test Case 3: Contact Form Submission

**Objective:** Verify contact form validation and submission

**Steps:**
1. Navigate to Contact page
2. Leave name empty, click submit
3. Enter name: "John Doe"
4. Enter invalid email: "invalid"
5. Enter valid email: "john@example.com"
6. Enter phone: "1234567" (< 10 digits)
7. Enter valid phone: "9876543210"
8. Enter message: "Hi" (< 10 chars)
9. Enter valid message: "I'm interested in your products"
10. Click "Send via WhatsApp"

**Expected Results:**
- ✓ Error on missing name
- ✓ Error on invalid email
- ✓ Error on invalid phone
- ✓ Error on short message
- ✓ No error on valid input
- ✓ WhatsApp opens with pre-filled message

**Test ID:** `test-contact-form`

---

### Test Case 4: Admin Panel Authentication

**Objective:** Verify admin login security

**Steps:**
1. Navigate to /admin
2. Enter wrong password: "wrong123"
3. Click submit
4. Enter correct password: "Usha@Ourcresta@Admin@DishaTraders@2025"
5. Click submit

**Expected Results:**
- ✓ Error message on wrong password
- ✓ Admin dashboard loads on correct password
- ✓ Three tabs visible: Products, Categories, Settings

**Test ID:** `test-admin-auth`

---

### Test Case 5: Admin Product CRUD

**Objective:** Verify product management in admin panel

**Steps:**
1. Login to admin panel
2. Click "Products" tab
3. Click "Add Product"
4. Fill: Name: "Premium Broom", Code: "PB-001", Category: "Grass Brooms", Price: 650, Image URL: "https://example.com/image.jpg"
5. Click "Add"
6. Verify product appears in list
7. Click "Edit" on new product
8. Change price to 700
9. Click "Save"
10. Verify price updated
11. Click "Delete"
12. Confirm deletion

**Expected Results:**
- ✓ Product added successfully
- ✓ Product appears in list
- ✓ Edit updates product
- ✓ Delete removes product
- ✓ Changes persist

**Test ID:** `test-admin-crud`

---

### Test Case 6: Admin Settings Update

**Objective:** Verify settings management and live preview

**Steps:**
1. Login to admin panel
2. Click "Settings" tab
3. Update mainTitle to "Test Title"
4. Observe live preview updates
5. Click "Save Settings"
6. Navigate to homepage
7. Verify title changed

**Expected Results:**
- ✓ Live preview updates in real-time
- ✓ Settings save successfully
- ✓ Changes appear on homepage
- ✓ Firebase stores changes

**Test ID:** `test-admin-settings`

---

### Test Case 7: PDF Download

**Objective:** Verify PDF catalog generation

**Steps:**
1. Go to Products page
2. Click "Download Catalog PDF"
3. Wait for PDF generation
4. Open downloaded file

**Expected Results:**
- ✓ PDF downloads successfully
- ✓ PDF contains all active products
- ✓ Products organized by category
- ✓ File name: "products-catalog.pdf"
- ✓ PDF readable and formatted correctly

**Test ID:** `test-pdf-download`

---

## ⚡ PERFORMANCE TESTING

### Test Case 8: Page Load Time

**Objective:** Measure page load performance

**Tools:**
- Chrome DevTools Lighthouse
- WebPageTest
- GTmetrix

**Steps:**
1. Open DevTools (F12)
2. Go to "Lighthouse"
3. Click "Generate report"
4. Record metrics

**Expected Results:**
- ✓ Performance score: 90+
- ✓ First Contentful Paint: < 1.5s
- ✓ Largest Contentful Paint: < 2.5s
- ✓ Cumulative Layout Shift: < 0.1

**Test ID:** `test-performance`

---

### Test Case 9: Asset Loading

**Objective:** Verify assets load efficiently

**Steps:**
1. Open DevTools → Network tab
2. Refresh page
3. Monitor network requests

**Expected Results:**
- ✓ Images compressed: < 300KB each
- ✓ CSS bundled: < 50KB gzipped
- ✓ JS bundled: < 500KB gzipped
- ✓ Total page size: < 2MB
- ✓ No 404 errors
- ✓ No slow requests (> 5s)

**Test ID:** `test-assets`

---

## 🔒 SECURITY TESTING

### Test Case 10: XSS Prevention

**Objective:** Verify XSS vulnerability protection

**Steps:**
1. Go to Contact form
2. In name field, enter: `<script>alert('XSS')</script>`
3. In message field, enter HTML: `<img src=x onerror="alert('XSS')">`
4. Submit form

**Expected Results:**
- ✓ No alert appears
- ✓ HTML treated as text
- ✓ No script execution
- ✓ Form submitted safely

**Test ID:** `test-xss-prevention`

---

### Test Case 11: Input Validation

**Objective:** Verify all inputs validated properly

**Steps:**
1. Go to Contact form
2. Test each field with invalid data:
   - Name: Numbers only
   - Email: No @ symbol
   - Phone: Letters mixed in
   - Message: Only numbers
3. Submit

**Expected Results:**
- ✓ Validation errors displayed
- ✓ Form not submitted
- ✓ User-friendly error messages
- ✓ No backend errors

**Test ID:** `test-input-validation`

---

### Test Case 12: Firebase Security

**Objective:** Verify Firebase security rules

**Steps:**
1. Open DevTools Console
2. Try direct Firestore write:
   ```javascript
   firebase.firestore().collection('products').add({name: 'Hacked'})
   ```
3. Observe response

**Expected Results:**
- ✓ Operation fails
- ✓ Permission denied error
- ✓ No unauthorized writes
- ✓ Security rules working

**Test ID:** `test-firebase-security`

---

## ♿ ACCESSIBILITY TESTING

### Test Case 13: Keyboard Navigation

**Objective:** Verify full keyboard accessibility

**Steps:**
1. Disable mouse (or just don't use it)
2. Press Tab to navigate
3. Navigate through all form fields
4. Press Enter on buttons
5. Press Escape to close dialogs

**Expected Results:**
- ✓ Tab moves between elements
- ✓ Focus indicators visible
- ✓ Enter activates buttons
- ✓ All interactive elements reachable
- ✓ No keyboard traps

**Test ID:** `test-keyboard-nav`

---

### Test Case 14: Screen Reader

**Objective:** Verify screen reader compatibility

**Tools:**
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (Mac)

**Steps:**
1. Enable screen reader
2. Navigate through page
3. Listen to descriptions

**Expected Results:**
- ✓ Screen reader announces all content
- ✓ Buttons labeled correctly
- ✓ Form inputs have labels
- ✓ Images have alt text
- ✓ Links descriptive

**Test ID:** `test-screen-reader`

---

### Test Case 15: Color Contrast

**Objective:** Verify WCAG AA compliance

**Tools:**
- WebAIM Contrast Checker
- Chrome DevTools

**Steps:**
1. Use contrast checker tool
2. Check text colors
3. Check button colors
4. Check form input colors

**Expected Results:**
- ✓ All text: 4.5:1 contrast ratio
- ✓ Large text: 3:1 contrast ratio
- ✓ WCAG AA compliant
- ✓ No color-only information

**Test ID:** `test-color-contrast`

---

## 🌍 CROSS-BROWSER TESTING

### Test Case 16: Chrome

**Versions:** Latest 2 versions

**Steps:**
1. Install Chrome
2. Run all functional tests
3. Check DevTools console for errors

**Expected Results:**
- ✓ All features working
- ✓ No console errors
- ✓ Responsive design correct
- ✓ Performance good

**Test ID:** `test-chrome`

---

### Test Case 17: Firefox

**Versions:** Latest 2 versions

**Steps:**
1. Install Firefox
2. Run all functional tests
3. Check Console for errors

**Expected Results:**
- ✓ All features working
- ✓ No console errors
- ✓ Responsive design correct

**Test ID:** `test-firefox`

---

### Test Case 18: Safari

**Versions:** Latest 2 versions

**Steps:**
1. Install Safari
2. Run all functional tests
3. Check Console for errors

**Expected Results:**
- ✓ All features working
- ✓ No console errors
- ✓ CSS animations smooth

**Test ID:** `test-safari`

---

### Test Case 19: Mobile Browsers

**Devices:**
- iPhone (Safari)
- Android (Chrome)
- iPad (Safari)

**Steps:**
1. Test on device
2. Verify touch responsive
3. Test forms on mobile
4. Test landscape and portrait

**Expected Results:**
- ✓ Responsive layout
- ✓ Touch targets adequate size
- ✓ Forms work on mobile
- ✓ No horizontal scroll

**Test ID:** `test-mobile-browsers`

---

## 🤖 TEST AUTOMATION

### Automated Test Suite

```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Sample Test Cases

```typescript
// Homepage test
describe('Homepage', () => {
  it('should load correctly', () => {
    cy.visit('/')
    cy.get('[data-testid="badge-since-1996"]').should('exist')
    cy.get('[data-testid="button-view-catalog"]').should('be.visible')
  })
})

// Contact form test
describe('Contact Form', () => {
  it('should validate email', () => {
    cy.visit('/contact')
    cy.get('[data-testid="input-email"]').type('invalid')
    cy.get('[data-testid="button-submit-email"]').click()
    cy.contains('Please enter a valid email').should('be.visible')
  })
})

// Admin test
describe('Admin Panel', () => {
  it('should authenticate', () => {
    cy.visit('/admin')
    cy.get('[data-testid="input-password"]').type('Usha@Ourcresta@Admin@DishaTraders@2025')
    cy.get('[data-testid="button-login"]').click()
    cy.get('[data-testid="tab-products"]').should('be.visible')
  })
})
```

---

## 🐛 BUG REPORTING

### Bug Report Template

```markdown
**Title:** [Brief description of issue]

**Severity:** Critical / Major / Minor

**Environment:**
- Browser: Chrome 120
- OS: Windows 10
- Device: Desktop/Mobile
- URL: [Specific page]

**Steps to Reproduce:**
1. Go to [page]
2. Click on [element]
3. Observe [unexpected behavior]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Screenshots:**
[Include screenshots]

**Console Errors:**
[Paste any console errors]

**Additional Context:**
[Any other relevant info]
```

### Example Bug Report

```markdown
**Title:** Contact form doesn't show phone validation error

**Severity:** Major

**Environment:**
- Browser: Firefox 121
- OS: macOS
- Device: Desktop
- URL: https://localhost:5000/contact

**Steps to Reproduce:**
1. Go to Contact page
2. Enter name: "John"
3. Enter email: "john@example.com"
4. Enter phone: "123" (only 3 digits)
5. Enter message: "Hello world"
6. Click submit

**Expected Behavior:**
Error message: "Phone must be at least 10 digits"

**Actual Behavior:**
No error message, form attempted to submit

**Console Errors:**
No errors in console

**Additional Context:**
Works correctly on Chrome
```

---

## 📊 TEST EXECUTION LOG

### Daily Testing Checklist

- [ ] Homepage loads correctly
- [ ] Products filter works
- [ ] Contact form validates
- [ ] Admin authentication works
- [ ] Product CRUD functional
- [ ] Settings save correctly
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] PDF downloads work
- [ ] Links functional

### Weekly Full Test Run

- [ ] All functional tests
- [ ] Performance baseline
- [ ] Security scan
- [ ] Accessibility audit
- [ ] Cross-browser test
- [ ] Mobile device test
- [ ] Load testing
- [ ] Backup verification

### Monthly Comprehensive Audit

- [ ] Full regression test
- [ ] Load testing (1000+ concurrent users)
- [ ] Penetration testing
- [ ] SEO audit
- [ ] Analytics review
- [ ] User feedback review
- [ ] Performance optimization
- [ ] Database cleanup

---

**Testing Procedures Complete**
