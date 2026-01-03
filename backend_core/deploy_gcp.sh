#!/bin/bash

# --- CONFIGURATION ---
PROJECT_ID="student-resource-hub-a758a"
REGION="us-central1"
SERVICE_NAME="cognitive-core"
REPO_NAME="ai-backend-repo"
IMAGE_NAME="backend-core"

echo "🚀 STAYING COOL: Deploying Cognitive Core to Google Cloud Run..."

# 1. Enable Required Services
echo "--- Enabling APIs ---"
gcloud services enable artifactregistry.googleapis.com run.googleapis.com \
    aiplatform.googleapis.com cloudbuild.googleapis.com \
    secretmanager.googleapis.com

# 2. Create Artifact Registry (if not exists)
echo "--- Checking/Creating Artifact Registry ---"
if ! gcloud artifacts repositories describe $REPO_NAME --location=$REGION > /dev/null 2>&1; then
    gcloud artifacts repositories create $REPO_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="Docker repository for AI Backend"
fi

# 3. Build & Submit Image using Cloud Build (No local Docker needed!)
echo "--- 🏗️ Building and Pushing Image (Cloud Build) ---"
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:latest .

# 4. Deploy to Cloud Run
echo "--- ☁️ Deploying Service ---"
gcloud run deploy $SERVICE_NAME \
    --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:latest \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --min-instances 0 \
    --max-instances 5 \
    --set-env-vars="DEBUG=False" \
    --set-env-vars="DJANGO_SECRET_KEY=CHANGE_ME_IN_PRODUCTION" 
    # Note: DATABASE_URL should be added once Cloud SQL is ready

echo "✅ DEPLOYMENT COMPLETE!"
echo "Your AI Backend URL is likely printed above."
