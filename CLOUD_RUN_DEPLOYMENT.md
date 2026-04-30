# Deployment Guide - Google Cloud Run

This guide walks you through deploying the Team Inventory app to Google Cloud Run with Google OAuth authentication.

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed ([installation guide](https://cloud.google.com/sdk/docs/install))
3. **Docker** installed locally (for testing)
4. **Google Cloud Project** created

## Step 1: Set Up Google OAuth

### Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Click **Create Credentials** > **OAuth 2.0 Client ID**
4. Configure OAuth consent screen if prompted:
   - User Type: External (or Internal for Google Workspace)
   - App name: Team Inventory
   - Support email: your-email@example.com
   - Authorized domains: Add your domain when deployed
5. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Team Inventory Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for local development)
     - `https://your-cloud-run-url.run.app` (add after deployment)
   - Authorized redirect URIs:
     - `http://localhost:5173`
     - `https://your-cloud-run-url.run.app`
6. Copy the **Client ID** - you'll need this

### Configure Local Environment

Create a `.env` file in the project root:

```bash
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

## Step 2: Configure Google Cloud

### Initialize gcloud

```bash
# Login to Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Step 3: Build and Deploy

### Option A: Using Cloud Build (Recommended)

1. Update `cloudbuild.yaml` with your Google Client ID:
   ```yaml
   substitutions:
     _GOOGLE_CLIENT_ID: 'your-actual-client-id.apps.googleusercontent.com'
   ```

2. Deploy using Cloud Build:
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

### Option B: Manual Deployment

1. **Build the Docker image locally:**
   ```bash
   docker build -t gcr.io/YOUR_PROJECT_ID/team-inventory .
   ```

2. **Test locally (optional):**
   ```bash
   docker run -p 8080:8080 gcr.io/YOUR_PROJECT_ID/team-inventory
   # Visit http://localhost:8080
   ```

3. **Push to Google Container Registry:**
   ```bash
   docker push gcr.io/YOUR_PROJECT_ID/team-inventory
   ```

4. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy team-inventory \
     --image gcr.io/YOUR_PROJECT_ID/team-inventory \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

## Step 4: Update OAuth Authorized Origins

After deployment, Cloud Run will give you a URL like:
`https://team-inventory-xxxxx-uc.a.run.app`

1. Go back to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. Click your OAuth 2.0 Client ID
3. Add the Cloud Run URL to:
   - **Authorized JavaScript origins**
   - **Authorized redirect URIs**
4. Save changes

## Step 5: Test Your Deployment

1. Visit your Cloud Run URL
2. Click "Sign in with Google"
3. Authorize the application
4. You should be logged in!

## Environment Variables

The app uses these environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |

## Updating the Deployment

To update your deployment:

```bash
# Using Cloud Build
gcloud builds submit --config cloudbuild.yaml

# Or manually
docker build -t gcr.io/YOUR_PROJECT_ID/team-inventory .
docker push gcr.io/YOUR_PROJECT_ID/team-inventory
gcloud run deploy team-inventory \
  --image gcr.io/YOUR_PROJECT_ID/team-inventory \
  --region us-central1
```

## Monitoring and Logs

View logs:
```bash
gcloud run logs read team-inventory --region us-central1
```

View service details:
```bash
gcloud run services describe team-inventory --region us-central1
```

## Custom Domain (Optional)

To use a custom domain:

```bash
gcloud run domain-mappings create \
  --service team-inventory \
  --domain your-domain.com \
  --region us-central1
```

Then update DNS records as instructed.

## Costs

Cloud Run pricing is based on:
- CPU and memory usage (pay per use)
- Number of requests
- Free tier: 2 million requests/month

Estimated cost: $0-10/month for low traffic

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **OAuth Scopes**: Only request necessary permissions
3. **HTTPS Only**: Cloud Run provides HTTPS by default
4. **Regular Updates**: Keep dependencies updated (`npm audit`)
5. **Access Control**: Use Cloud IAM for admin access

## Troubleshooting

### OAuth not working
- Verify Client ID is correct in environment variables
- Check authorized origins include your Cloud Run URL
- Clear browser cache and cookies

### Build fails
- Check Dockerfile syntax
- Verify all dependencies in package.json
- Review Cloud Build logs: `gcloud builds list`

### App not accessible
- Verify `--allow-unauthenticated` flag
- Check Cloud Run service is deployed: `gcloud run services list`
- Review firewall/VPC settings if using private networking

## Support

For issues:
1. Check Cloud Run logs
2. Review build logs in Cloud Build
3. Verify OAuth configuration in Google Cloud Console
