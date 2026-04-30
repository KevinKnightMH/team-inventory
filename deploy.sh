#!/bin/bash
set -e

# Team Inventory - Deploy to Cloud Run (mad-hack)
# This script deploys the app to mad-hack GCP project

PROJECT="mad-hack"
SERVICE="team-inventory"
REGION="us-central1"

echo "🚀 Deploying Team Inventory to Cloud Run..."
echo "   Project: $PROJECT"
echo "   Service: $SERVICE"
echo "   Region: $REGION"
echo ""

# Confirm project
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ "$CURRENT_PROJECT" != "$PROJECT" ]; then
    echo "⚠️  Switching to project: $PROJECT"
    gcloud config set project $PROJECT
fi

# Deploy from source (gcloud builds container in cloud)
echo "📦 Building and deploying..."
gcloud run deploy $SERVICE \
    --source . \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --project $PROJECT

echo ""
echo "✅ Deployment complete!"
echo "🌐 URL: https://team-inventory-hl2sj7izaa-uc.a.run.app"
echo ""
echo "📊 View logs:"
echo "   gcloud run logs read $SERVICE --project $PROJECT --region $REGION"
