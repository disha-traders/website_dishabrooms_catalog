# 🤝 Contributing to Disha Traders

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

- Be respectful and inclusive
- Support fellow contributors
- Report issues constructively
- No harassment or discrimination

---

## Getting Started

### Prerequisites
- Node.js 18+
- Git
- Firebase account (for testing)

### Setup Development Environment

```bash
# 1. Fork the repository
# Visit: github.com/disha-traders/website_dishabrooms.com

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/website_dishabrooms.com.git
cd website_dishabrooms.com

# 3. Add upstream remote
git remote add upstream https://github.com/disha-traders/website_dishabrooms.com.git

# 4. Install dependencies
npm install

# 5. Create .env.local
cp .env.example .env.local
# Edit with your Firebase credentials

# 6. Start dev server
npm run dev:client
```

---

## Development Workflow

### Creating a Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# Or: git checkout -b fix/bug-name
# Or: git checkout -b docs/update-readme
```

### Branch Naming Conventions

```
feature/    - New features (feature/add-testimonials)
fix/        - Bug fixes (fix/contact-form-validation)
docs/       - Documentation (docs/update-readme)
refactor/   - Code refactoring (refactor/extract-components)
perf/       - Performance improvements (perf/optimize-images)
test/       - Test additions (test/add-admin-tests)
```

### Committing Changes

```bash
# Stage changes
git add .

# Commit with message (see Commit Guidelines)
git commit -m "feat: add product filtering on catalog page"

# Push to your fork
git push origin feature/your-feature-name
```

---

## Coding Standards

### TypeScript

- Use strict mode
- Type all function parameters and returns
- Avoid `any` type
- Use interfaces over types where possible

```typescript
// ✅ Good
interface Product {
  id: string;
  name: string;
  price: number;
}

function addProduct(product: Product): Promise<void> {
  // implementation
}

// ❌ Avoid
function addProduct(product: any) {
  // implementation
}
```

### React Components

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components focused and single-purpose
- Use meaningful component names

```typescript
// ✅ Good
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      {/* component code */}
    </div>
  );
}

// ❌ Avoid
export function PC({ p }: any) {
  return <div>{/* component code */}</div>;
}
```

### Styling

- Use Tailwind CSS utilities
- Avoid inline styles
- Create custom components in `components/ui/`
- Use semantic class names

```typescript
// ✅ Good
<button className="h-12 px-6 rounded-full bg-[#00A896] hover:bg-[#008C7D] text-white font-bold">
  Click Me
</button>

// ❌ Avoid
<button style={{ background: "#00A896", padding: "20px" }}>
  Click Me
</button>
```

### File Organization

```
components/
├── feature-name/
│   ├── component-name.tsx      # Main component
│   ├── component-name.test.tsx # Tests
│   └── types.ts                # Type definitions
```

### Naming Conventions

```typescript
// Files: kebab-case
product-card.tsx
admin-layout.tsx

// Components: PascalCase
export function ProductCard() {}
export function AdminLayout() {}

// Variables/Functions: camelCase
const productName = "Grass Broom";
function handleClick() {}

// Constants: UPPER_SNAKE_CASE
const MAX_PRODUCTS = 100;
const DEFAULT_TIMEOUT = 5000;

// Private functions: prefix with underscore
function _formatPrice(price: number) {}
```

### Error Handling

- Always handle errors explicitly
- Use try-catch for async operations
- Provide user-friendly error messages
- Log errors for debugging

```typescript
// ✅ Good
try {
  const data = await fetchProducts();
  setProducts(data);
} catch (error) {
  console.error("Failed to fetch products", error);
  showErrorMessage("Unable to load products. Please try again.");
  setProducts(mockProducts); // Fallback
}

// ❌ Avoid
const data = await fetchProducts();
setProducts(data); // No error handling
```

---

## Commit Guidelines

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting, no code change
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Test additions
- `chore` - Build, dependencies, etc.

### Examples

```bash
# Feature
git commit -m "feat(products): add category filtering"

# Bug fix
git commit -m "fix(contact): correct WhatsApp number in form submission"

# Documentation
git commit -m "docs: update README with setup instructions"

# Multiple line
git commit -m "feat(admin): add product bulk import via CSV

- Parse CSV file
- Validate product data
- Save to Firestore
- Show success/error feedback"
```

---

## Pull Request Process

### Before Submitting

1. **Test locally**
   ```bash
   npm run dev:client
   # Test all affected pages
   ```

2. **Type check**
   ```bash
   npm run check
   ```

3. **Update documentation** if needed

4. **Self-review** your code:
   - No console errors
   - No `console.log` statements left
   - All data-testids present
   - Responsive design checked

### Creating Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Go to GitHub and create PR
# - Link related issues
# - Describe changes
# - Include screenshots if UI changes
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Related Issues
Closes #123

## Changes Made
- Added product filtering
- Updated contact form
- Fixed navigation bug

## Screenshots (if applicable)
[Add screenshots]

## Testing
- [ ] Tested on mobile
- [ ] Tested on tablet
- [ ] Tested on desktop
- [ ] All forms validated
- [ ] No console errors

## Checklist
- [ ] Code follows style guide
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Commits are clean
```

### Review Process

- Maintain respectful dialogue
- Respond to feedback promptly
- Request re-review after changes
- Address all comments

---

## Issue Reporting

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
[Add screenshots if applicable]

## Environment
- Browser: Chrome 120
- Device: Desktop/Mobile
- OS: Windows/Mac/Linux

## Additional Context
Any other relevant info
```

### Feature Request Template

```markdown
## Description
Clear description of the feature

## Problem It Solves
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches?

## Additional Context
Any other relevant info
```

---

## Testing

### Manual Testing Checklist

Before submitting PR, test:

- [ ] Feature works as described
- [ ] No console errors
- [ ] No console warnings
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Form validation works
- [ ] Error handling works
- [ ] Loading states show correctly
- [ ] Animations smooth
- [ ] Performance acceptable

### Test Data

Use these credentials for testing:

```
Admin Password: Usha@Ourcresta@Admin@DishaTraders@2025
WhatsApp: +91 93218 94001
Email: test@example.com
```

### Test IDs

Always add `data-testid` to interactive elements:

```typescript
// Forms
data-testid="input-name"
data-testid="button-submit"

// Lists
data-testid="card-product-${id}"

// Navigation
data-testid="link-products"
data-testid="button-menu"
```

---

## Documentation

### Updating Documentation

When adding features, update:
- README.md - High-level overview
- DOCUMENTATION.md - Technical details
- Code comments - Complex logic
- Commit messages - What and why

### Code Comments

```typescript
// Use comments for WHY, not WHAT
// ✅ Good - explains reasoning
// Products are filtered twice: once by category, then by search query
// This ensures accurate results even if user searches across categories

// ❌ Avoid - just restates code
// Filter products by category
const filtered = products.filter(p => p.category === category);
```

### JSDoc for Public APIs

```typescript
/**
 * Generates a PDF catalog from products
 * @param products - Array of products to include
 * @param config - Application configuration
 * @param heroImagePath - Path to hero image
 * @returns Promise that resolves when PDF is generated
 * @throws Error if image fails to load
 */
export async function generateCatalog(
  products: Product[],
  config: Config,
  heroImagePath: string
): Promise<void> {
  // implementation
}
```

---

## Questions?

- **GitHub Issues**: Open an issue for questions
- **Email**: dishabrooms@gmail.com
- **WhatsApp**: +91 93218 94001

---

**Thank you for contributing! 🙏**
