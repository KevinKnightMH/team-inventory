# Deployment Guide - Team Inventory

## Quick Deploy to Vercel (Recommended)

### Method 1: Using Vercel CLI (Fastest)

1. **Login to Vercel**:
   ```bash
   vercel login
   ```
   This opens your browser to authenticate with Vercel (GitHub, GitLab, or email).

2. **Deploy**:
   ```bash
   cd team-inventory
   vercel --prod
   ```

3. **Done!** You'll get a URL like: `https://team-inventory-abc123.vercel.app`

---

### Method 2: Via GitHub + Vercel Dashboard (Most Popular)

1. **Create a GitHub repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., "team-inventory")
   - Don't initialize with README (we already have files)

2. **Push your code to GitHub**:
   ```bash
   cd team-inventory
   git add .
   git commit -m "Initial commit - Team Inventory prototype"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/team-inventory.git
   git push -u origin main
   ```

3. **Deploy on Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"

4. **Done!** You'll get a permanent URL and automatic deployments on every push.

---

## Alternative: Deploy to Netlify

### Using Netlify CLI:

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   cd team-inventory
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Using Netlify Drop (No CLI needed):

1. **Build your project**:
   ```bash
   cd team-inventory
   npm run build
   ```

2. **Deploy**:
   - Go to https://app.netlify.com/drop
   - Drag and drop your `dist` folder
   - Done! Instant URL

---

## Current Local Tunnel

Your app is currently accessible via LocalTunnel at:
**https://team-inventory-demo.loca.lt**

This is temporary and requires your local dev server to be running.

---

## Environment Variables

This prototype uses localStorage for data persistence, so no environment variables are needed.

For a production version with a real backend, you would add:
- Database connection strings
- API keys
- Authentication secrets

---

## Login Credentials for Demo

Share these credentials with testers:

- **Admin**: admin@company.com / admin123
- **Engineering Manager**: engmgr@company.com / eng123
- **Product Manager**: pm@company.com / pm123
- **Delivery Lead**: delivery@company.com / del123

---

## Build Commands Reference

- **Development**: `npm run dev`
- **Production Build**: `npm run build`
- **Preview Build**: `npm run preview`
- **Lint**: `npm run lint`
