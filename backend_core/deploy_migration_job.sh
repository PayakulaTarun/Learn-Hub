#!/bin/bash

# --- CONFIGURATION (UPDATE THESE!) ---
PROJECT_ID="student-resource-hub-a758a"
REGION="us-central1"
REPO_NAME="ai-backend-repo"
IMAGE_NAME="backend-core"
JOB_NAME="vector-migration-job"

# ⚠️ REPLACE THIS with your actual connection name from: gcloud sql instances describe <OUTPUT_NAME>
# It usually looks like: project-id:region:instance-name
CLOUD_SQL_CONNECTION_NAME="student-resource-hub-a758a:us-central1:cognitive-db-primary" 

# ⚠️ REPLACE THIS with your real DB user/pass
DB_PASSWORD="mypassword"
DATABASE_URL="postgres://postgres:$DB_PASSWORD@localhost:5432/cognitive_db"

echo "🚀 PREPARING MIGRATION JOB..."

# 1. Build the image (re-using the main backend image since it has the code)
echo "--- Ensuring Image is Fresh ---"
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:latest .

# 2. Deploy Cloud Run Job
echo "--- ☁️ Deploying Migration Job ---"
gcloud run jobs deploy $JOB_NAME \
    --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:latest \
    --region $REGION \
    --command "python" \
    --args "migrate_vectors.py" \
    --set-env-vars="DATABASE_URL=$DATABASE_URL" \
    --set-env-vars="DJANGO_SECRET_KEY=migration_mode" \
    --add-cloudsql-instances $CLOUD_SQL_CONNECTION_NAME \
    --memory 2Gi \
    --cpu 2 \
    --task-timeout 30m

echo "✅ JOB DEPLOYED (BUT NOT RUN YET)"
echo "To execute the migration, run:"
echo "gcloud run jobs execute $JOB_NAME --region $REGION"
