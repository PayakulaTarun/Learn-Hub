---
description: How to synchronize the AI Brain with the latest content and QA database
---

# Sync AI Brain Workflow

This workflow ensures that the AI's vector database is up-to-date with all current tutorials and expert QA data.

### Prerequisites
- Google Cloud SDK configured
- Firebase project access
- Environment variables set (`GOOGLE_CLOUD_PROJECT`, `FIREBASE_SERVICE_ACCOUNT_KEY`)

### Steps

1. **Verify Environment**
   Ensure you have the latest content and QA database JSON files in your local/CI environment.

2. **Run Sync Command**
// turbo
```powershell
npm run sync-brain
```

### Automation Details
- The script uses **Vertex AI** for embeddings.
- It performs **Incremental Ingestion** (checks if a chunk already exists in Firestore before embedding).
- It respects Google Cloud quotas with built-in retries and throttling.

### Post-Sync Verification
1. Open the website.
2. Ask the AI bot a question related to recently added content.
3. Verify the bot cites the new source in its answer.
