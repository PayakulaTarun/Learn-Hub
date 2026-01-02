# Deploy Evaluator Microservice (Cloud Run)
# Optimized for Isolated Code Execution (Sandboxed)

$PROJECT_ID = "student-resource-hub-481812"
$REGION = "us-central1"
$REPO = "srh-repo"
$IMAGE_NAME = "student-hub-frontend"
$GCLOUD = "C:\Users\payak\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"

Write-Host "🚀 Deploying Student Hub Frontend..." -ForegroundColor Cyan

# 1. Build Container (Using Cloud Build for speed)
Write-Host "Building Docker Image..."
& $GCLOUD builds submit --tag "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$IMAGE_NAME" .

# 2. Deploy to Cloud Run (Gen 2 Execution Environment for full Linux compatibility)
Write-Host "Deploying to Cloud Run..."
& $GCLOUD run deploy $IMAGE_NAME `
    --image "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$IMAGE_NAME" `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --execution-environment=gen2 `
    --memory=1Gi `
    --cpu=1 `
    --concurrency=10 `
    --timeout=10s `
    --service-account="sa-evaluator@$PROJECT_ID.iam.gserviceaccount.com"

Write-Host "✅ Evaluator Deployed Successfully!" -ForegroundColor Green
