---
description: Deploy the Python Cognitive Core to Google Cloud Run
---

# Deploy Python Backend to GCP

This workflow deploys your new `backend_core` (Django/PyTorch) to Google Cloud Run.

## Prerequisites
1. You must be authenticated with Google Cloud (`gcloud auth login`).
2. You must have selected the project (`gcloud config set project student-resource-hub-a758a`).

## Steps

1. Navigate to the backend directory:
```bash
cd backend_core
```

2. Run the deployment script:
// turbo
```bash
./deploy_gcp.sh
```

## Post-Deployment
- Copy the URL provided at the end of the script.
- Update your Frontend environment variables (`NEXT_PUBLIC_AI_API_URL`) to point to this new URL.
