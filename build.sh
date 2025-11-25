#!/bin/bash
set -e

echo "🔨 Building Disha Traders Catalog (Frontend Only)..."
npm install
npx vite build

echo "✅ Build complete!"
echo "Output: dist/public"
