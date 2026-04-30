# Development Workflow

## Local Development & Deployment to mad-hack

This guide covers editing code locally and deploying to the **mad-hack** GCP project.

## Quick Start

### 1. Local Development

```bash
# Navigate to project
cd /Users/kevinknight/TeamInventory/team-inventory

# Install dependencies (if needed)
npm install

# Start dev server
npm run dev

# Open browser to http://localhost:5173
```

### 2. Make Changes

Edit files in `src/` directory:
- Components: `src/components/`
- Context/State: `src/context/`
- Services: `src/services/`
- Styles: Tailwind classes in JSX

### 3. Commit Changes

```bash
# Stage changes
git add .

# Commit
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

### 4. Deploy to Cloud Run (mad-hack)

```bash
# Simple deploy script
./deploy.sh

# Or manually:
gcloud run deploy team-inventory \
  --source . \
  --region us-central1 \
  --project mad-hack \
  --allow-unauthenticated
```

## Current Configuration

### GCP Project: mad-hack
- **Service:** team-inventory
- **Region:** us-central1
- **URL:** https://team-inventory-hl2sj7izaa-uc.a.run.app

### GitHub Repository
- **URL:** https://github.com/KevinKnightMH/team-inventory
- **Branch:** main

### OAuth (madhive-testing)
- **Client ID:** 629681983625-p6kqfjve8bfagkkardouvifgno7gc416.apps.googleusercontent.com
- **Project:** madhive-testing (OAuth client can be in different project)

## Deployment Methods

### Method 1: Simple Deploy Script (Recommended)

```bash
./deploy.sh
```

This script:
- Verifies you're using mad-hack project
- Builds container in cloud (no Docker needed)
- Deploys to Cloud Run
- Shows deployment URL

### Method 2: Manual gcloud Command

```bash
gcloud run deploy team-inventory \
  --source . \
  --region us-central1 \
  --project mad-hack \
  --allow-unauthenticated
```

**Note:** `--source .` tells gcloud to build the container in the cloud using your Dockerfile.

### Method 3: Pre-build with Docker (Optional)

If you have Docker installed:

```bash
# Build
docker build --platform linux/amd64 \
  --build-arg VITE_GOOGLE_CLIENT_ID=629681983625-p6kqfjve8bfagkkardouvifgno7gc416.apps.googleusercontent.com \
  -t gcr.io/mad-hack/team-inventory:latest .

# Push
docker push gcr.io/mad-hack/team-inventory:latest

# Deploy
gcloud run deploy team-inventory \
  --image gcr.io/mad-hack/team-inventory:latest \
  --region us-central1 \
  --project mad-hack
```

## Common Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Git
```bash
git status           # Check changes
git log --oneline    # View commit history
git pull origin main # Pull latest from GitHub
```

### Cloud Run
```bash
# View logs
gcloud run logs read team-inventory \
  --project mad-hack \
  --region us-central1 \
  --follow

# Service details
gcloud run services describe team-inventory \
  --project mad-hack \
  --region us-central1

# List all services
gcloud run services list --project mad-hack --region us-central1
```

### Switch GCP Projects (if needed)
```bash
# View current project
gcloud config get-value project

# Switch to mad-hack
gcloud config set project mad-hack

# List all projects
gcloud projects list
```

## Environment Variables

### Local Development (.env)
```bash
VITE_GOOGLE_CLIENT_ID=629681983625-p6kqfjve8bfagkkardouvifgno7gc416.apps.googleusercontent.com
VITE_APP_NAME=Team Inventory
VITE_APP_URL=http://localhost:5173
```

### Production (Cloud Run)
Environment variables are baked into the Docker image at build time via `Dockerfile`.

The `--build-arg` passes the OAuth Client ID during build.

## Typical Development Flow

```bash
# 1. Start dev server
npm run dev

# 2. Make changes in src/
# 3. Test in browser (http://localhost:5173)

# 4. Commit
git add .
git commit -m "Add new feature"

# 5. Push to GitHub
git push origin main

# 6. Deploy to Cloud Run
./deploy.sh

# 7. Verify deployment
# Open: https://team-inventory-hl2sj7izaa-uc.a.run.app
```

## Troubleshooting

### "Permission denied" on deployment
```bash
# Check current project
gcloud config get-value project

# Should be: mad-hack
# If not, switch:
gcloud config set project mad-hack
```

### "Docker not found" error
You don't need Docker! Use `--source .` flag instead:
```bash
gcloud run deploy team-inventory --source . --project mad-hack --region us-central1
```

### OAuth not working after deployment
Update authorized origins in madhive-testing OAuth client:
https://console.cloud.google.com/apis/credentials?project=madhive-testing

### Changes not showing after deploy
- Clear browser cache
- Check Cloud Run logs for errors
- Verify build completed successfully

## Project Structure

```
/Users/kevinknight/TeamInventory/team-inventory/
├── src/                    # Source code
│   ├── components/        # React components
│   ├── context/          # State management
│   ├── services/         # Data layer
│   └── utils/            # Utilities
├── public/               # Static assets
├── .env                  # Local environment (git-ignored)
├── Dockerfile            # Container config
├── deploy.sh             # Deploy script
├── package.json          # Dependencies
└── vite.config.js        # Build config
```

## Resources

- **Live App:** https://team-inventory-hl2sj7izaa-uc.a.run.app
- **GitHub:** https://github.com/KevinKnightMH/team-inventory
- **Cloud Console:** https://console.cloud.google.com/run?project=mad-hack
- **OAuth Console:** https://console.cloud.google.com/apis/credentials?project=madhive-testing

## Next Steps

1. ✅ Local development environment configured
2. ✅ Deploying to mad-hack GCP project
3. ✅ GitHub repository connected
4. ✅ OAuth configured
5. ⏳ Optional: Set up Cloud Build triggers for auto-deploy on push
