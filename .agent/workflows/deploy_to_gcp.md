---
description: Deploy Student Resource Hub to Google Cloud Run
---

# Deploy using Google Cloud Shell

Follow these steps exactly in the **Google Cloud Shell** terminal (top right icon in `console.cloud.google.com`).

## 1. Setup Environment
Set your Project ID and Region variables for easier commands.

```bash
export PROJECT_ID="student-resource-hub-481812"
export REGION="us-central1"

gcloud config set project $PROJECT_ID
```

## 2. Enable Required APIs
Enable the services needed for Hosting (Cloud Run) and AI features.

```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  aiplatform.googleapis.com \
  generativelanguage.googleapis.com \
  speech.googleapis.com \
  texttospeech.googleapis.com
```

## 3. Clone Repository
Get the latest code. (If you haven't pushed your latest changes, push them to GitHub first!)

```bash
# If you are already in the repo dir, skip this.
# Otherwise:
git clone https://github.com/PayakulaTarun/Learn-Hub.git
cd Learn-Hub
```

## 4. Deploy to Cloud Run
This single command handles building the Docker container and deploying it.
**IMPORTANT**: Replace the `SUPABASE_...` values with your actual keys from your `.env` file!

```bash
gcloud run deploy student-resource-hub \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL_HERE" \
  --set-env-vars NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_KEY_HERE" \
  --set-env-vars OPENAI_API_KEY="optional_if_you_have_one"
```

## 5. Verify Deployment
Once the command finishes, it will print a **Service URL** (e.g., `https://student-resource-hub-xyz.a.run.app`).
Click that link to see your live website!
