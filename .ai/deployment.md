# Deployment Guide

## Current Production

- **URL:** https://team-inventory-603316736725.us-central1.run.app
- **Platform:** Google Cloud Run
- **Project:** mad-hack
- **Region:** us-central1
- **Image:** gcr.io/mad-hack/team-inventory:latest
- **Port:** 8080 (nginx)

## Prerequisites

- Docker Desktop installed
- gcloud CLI installed and authenticated
- GitHub CLI (gh) installed and authenticated
- Access to mad-hack GCP project
- Cloud Run Admin role

## Deployment Methods

### Method 1: Manual Docker Deploy (Current)

This is the current approach since we don't have Cloud Build permissions in mad-hack.

```bash
# 1. Ensure you're in the project directory
cd /Users/kevinknight/TeamInventory/team-inventory

# 2. Build Docker image with OAuth credentials
docker build --platform linux/amd64 \
  --build-arg VITE_GOOGLE_CLIENT_ID=629681983625-p6kqfjve8bfagkkardouvifgno7gc416.apps.googleusercontent.com \
  -t gcr.io/mad-hack/team-inventory:latest .

# 3. Authenticate Docker with GCR (if not done)
gcloud auth configure-docker gcr.io --quiet

# 4. Push image to Google Container Registry
docker push gcr.io/mad-hack/team-inventory:latest

# 5. Deploy to Cloud Run
gcloud run deploy team-inventory \
  --image gcr.io/mad-hack/team-inventory:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --project mad-hack

# 6. Deployment complete! URL will be shown
```

**Build time:** ~30 seconds
**Push time:** ~20 seconds
**Deploy time:** ~30 seconds
**Total:** ~1-2 minutes

### Method 2: Cloud Build (Future - Requires Permissions)

If Cloud Build Editor role is granted:

```bash
gcloud builds submit --config cloudbuild.yaml --project mad-hack
```

This will:
1. Build Docker image in cloud
2. Push to GCR
3. Deploy to Cloud Run
4. All in one command

### Method 3: Automated CI/CD (Future)

Set up Cloud Build trigger:
1. Trigger on push to `main` branch
2. Runs `cloudbuild.yaml`
3. Automatic deployment

## Docker Build Details

### Multi-Stage Build

**Stage 1: Builder (Node)**
- Base: `node:20-alpine`
- Install dependencies
- Build React app with Vite
- Output: `dist/` folder

**Stage 2: Production (Nginx)**
- Base: `nginx:alpine`
- Copy built assets from Stage 1
- Copy nginx config
- Expose port 8080
- Lightweight (~50MB final image)

### Build Arguments

```dockerfile
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
```

Environment variables must be set at build time for Vite to include them in the bundle.

### Nginx Configuration

Located at `nginx.conf`:
- Serves static files from `/usr/share/nginx/html`
- SPA routing support (all routes → index.html)
- Gzip compression enabled
- Security headers added
- Health check endpoint: `/health`
- Port 8080 (Cloud Run default)

## Cloud Run Configuration

### Current Settings

```yaml
Service: team-inventory
Platform: managed
Region: us-central1
Port: 8080
Auth: allow-unauthenticated
Min instances: 0
Max instances: 100 (default)
Memory: 512Mi (default)
CPU: 1 (default)
Timeout: 300s (default)
Concurrency: 80 (default)
```

### Updating Configuration

```bash
# Update memory
gcloud run services update team-inventory \
  --memory 1Gi \
  --project mad-hack \
  --region us-central1

# Update min instances (prevent cold starts)
gcloud run services update team-inventory \
  --min-instances 1 \
  --project mad-hack \
  --region us-central1

# Update environment variable (Note: Vite vars must be in build)
gcloud run services update team-inventory \
  --set-env-vars KEY=value \
  --project mad-hack \
  --region us-central1
```

## Environment Variables

### Build-Time (Required)

These must be passed during `docker build`:

```bash
VITE_GOOGLE_CLIENT_ID=629681983625-p6kqfjve8bfagkkardouvifgno7gc416.apps.googleusercontent.com
```

Vite bundles these at build time, so they cannot be changed at runtime.

### Runtime (Optional)

Cloud Run supports runtime env vars, but Vite apps need build-time variables. For true runtime config, you'd need to:
1. Fetch config from API on app load
2. Use server-side rendering (SSR)
3. Use environment-agnostic builds

## OAuth Configuration

### Google Cloud Console Setup

**Project:** madhive-testing
**Client ID:** 629681983625-p6kqfjve8bfagkkardouvifgno7gc416.apps.googleusercontent.com

**Authorized JavaScript Origins:**
- http://localhost:5173 (development)
- https://team-inventory-603316736725.us-central1.run.app (production)

**Authorized Redirect URIs:**
- Same as origins

### After Deploying New URL

If Cloud Run URL changes:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials?project=madhive-testing)
2. Edit OAuth Client ID
3. Add new URL to Authorized JavaScript Origins
4. Add new URL to Authorized Redirect URIs
5. Save

## GitHub Integration

### Repository

- **URL:** https://github.com/KevinKnightMH/team-inventory
- **Branch:** main
- **Owner:** KevinKnightMH

### Pushing Changes

```bash
# Stage changes
git add .

# Commit
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Then manually deploy (until CI/CD is set up)
```

## Rollback Procedure

### View Previous Revisions

```bash
gcloud run revisions list \
  --service team-inventory \
  --project mad-hack \
  --region us-central1
```

### Rollback to Previous Revision

```bash
gcloud run services update-traffic team-inventory \
  --to-revisions REVISION_NAME=100 \
  --project mad-hack \
  --region us-central1
```

### Rollback via Docker Image Tag

```bash
# Deploy specific image
gcloud run deploy team-inventory \
  --image gcr.io/mad-hack/team-inventory:COMMIT_SHA \
  --project mad-hack \
  --region us-central1
```

## Monitoring & Logs

### View Logs

```bash
# Stream logs
gcloud run logs read team-inventory \
  --project mad-hack \
  --region us-central1 \
  --follow

# Last 100 lines
gcloud run logs read team-inventory \
  --project mad-hack \
  --region us-central1 \
  --limit 100
```

### Service Status

```bash
# Describe service
gcloud run services describe team-inventory \
  --project mad-hack \
  --region us-central1

# List revisions
gcloud run revisions list \
  --service team-inventory \
  --project mad-hack \
  --region us-central1
```

### Metrics (Cloud Console)

Visit: https://console.cloud.google.com/run/detail/us-central1/team-inventory/metrics?project=mad-hack

- Request count
- Request latency
- Container CPU utilization
- Container memory utilization
- Container instance count

## Cost Optimization

### Current Costs

Cloud Run free tier:
- 2 million requests/month
- 360,000 GB-seconds memory
- 180,000 vCPU-seconds

**Estimated cost for this app:** $0-5/month (likely free tier)

### Cost Reduction Tips

1. **Set min instances to 0** (current) - prevents idle costs
2. **Use smaller memory** - 512Mi is sufficient
3. **Enable compression** (already done in nginx)
4. **Optimize bundle size** - lazy load routes if needed
5. **Use caching headers** (already done in nginx)

## Disaster Recovery

### Backup Strategy

Since data is in localStorage (client-side):
- No server-side data to backup
- Users can export their data via Reports → Export CSV/JSON

Future with backend:
- Database backups
- Point-in-time recovery
- Multi-region deployment

### Recovery Steps

1. **Service Down**
   - Check Cloud Run status
   - Check logs for errors
   - Rollback to previous revision

2. **Bad Deployment**
   - Rollback to previous revision
   - Fix code
   - Redeploy

3. **OAuth Broken**
   - Verify authorized origins in Google Console
   - Check environment variable
   - Rebuild with correct Client ID

## Troubleshooting

### Build Fails

```bash
# Check Docker is running
docker ps

# Check for syntax errors
npm run build

# Check Node version
node --version  # Should be 20+
```

### Push Fails

```bash
# Reauthenticate Docker
gcloud auth configure-docker gcr.io

# Check network connection
ping gcr.io
```

### Deploy Fails

```bash
# Check permissions
gcloud projects get-iam-policy mad-hack \
  --flatten="bindings[].members" \
  --filter="bindings.members:$(gcloud config get-value account)"

# Check quota
gcloud compute project-info describe --project mad-hack
```

### App Not Loading

1. Check Cloud Run URL
2. Check browser console for errors
3. Check network tab for failed requests
4. Verify OAuth authorized origins
5. Check Cloud Run logs

### OAuth Not Working

1. Verify Client ID in build
2. Check authorized origins include Cloud Run URL
3. Clear browser cache
4. Try incognito mode
5. Check Google Cloud Console for OAuth client status

## Quick Deploy Script

Save as `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "Building Docker image..."
docker build --platform linux/amd64 \
  --build-arg VITE_GOOGLE_CLIENT_ID=629681983625-p6kqfjve8bfagkkardouvifgno7gc416.apps.googleusercontent.com \
  -t gcr.io/mad-hack/team-inventory:latest .

echo "Pushing to GCR..."
docker push gcr.io/mad-hack/team-inventory:latest

echo "Deploying to Cloud Run..."
gcloud run deploy team-inventory \
  --image gcr.io/mad-hack/team-inventory:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --project mad-hack

echo "Deployment complete!"
```

Make executable: `chmod +x deploy.sh`
Run: `./deploy.sh`

## Security Checklist

- [x] HTTPS enforced (Cloud Run default)
- [x] OAuth credentials not in git
- [x] .env in .gitignore
- [x] Security headers in nginx
- [x] Unauthenticated access allowed (intended)
- [ ] Rate limiting (not implemented)
- [ ] Input validation (minimal)
- [ ] CSRF protection (not needed for localStorage app)
- [ ] XSS protection (React's built-in escaping)

## Post-Deployment Tasks

1. ✅ Verify app loads
2. ✅ Test Google OAuth login
3. ✅ Test demo account login
4. ✅ Check all routes work
5. ✅ Test CRUD operations
6. ✅ Test export functionality
7. ✅ Check mobile responsiveness
8. ✅ Update OAuth authorized origins if URL changed
9. ✅ Monitor logs for errors
10. ✅ Share URL with stakeholders
