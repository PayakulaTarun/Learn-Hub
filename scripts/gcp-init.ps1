# Google Cloud Project Initialization Script for Student Resource Hub
# Run this ONCE to set up the foundation

$PROJECT_ID = "student-resource-hub-481812"
$REGION = "us-central1"
$GCLOUD = "C:\Users\payak\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"

Write-Host "🚀 Initializing Google Cloud Environment..." -ForegroundColor Green

# 1. Set Project
& $GCLOUD config set project $PROJECT_ID
& $GCLOUD config set run/region $REGION

# 2. Enable Required APIs (The "Enterprise" Suite)
Write-Host "Enable APIs..."
& $GCLOUD services enable run.googleapis.com `
    artifactregistry.googleapis.com `
    cloudbuild.googleapis.com `
    aiplatform.googleapis.com `
    secretmanager.googleapis.com `
    compute.googleapis.com `
    apigateway.googleapis.com `
    servicemanagement.googleapis.com `
    servicecontrol.googleapis.com

# 3. Create Artifact Registry (better than Container Registry)
Write-Host "Creating Artifact Registry..."
& $GCLOUD artifacts repositories create srh-repo `
    --repository-format=docker `
    --location=$REGION `
    --description="Student Resource Hub Containers"

# 4. Create Service Accounts (Identity Isolation)
Write-Host "Creating Service Accounts..."
# 4a. Evaluator Identity (Low Privilege)
& $GCLOUD iam service-accounts create sa-evaluator `
    --display-name="Evaluator Service Account"

# 4b. AI Brain Identity (Vertex AI Access)
& $GCLOUD iam service-accounts create sa-ai-brain `
    --display-name="AI Brain Service Account"

Write-Host "✅ Initialization Complete. You are ready to deploy." -ForegroundColor Green
