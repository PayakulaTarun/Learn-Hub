# Student Resource Hub - Production Roadmap

## PHASE 4: PRODUCTION READINESS (Current)

This document outlines the strict engineering path to move from "Neural Prototype" to "Production Platform".
It effectively serves as the engineering contract for the next development sprint.

---

### 1. Fix RAG End-to-End (The "Cloud Gaps")
**Objective**: The current system has the *logic* for RAG but not the *execution path* in the cloud.
- [ ] **Infrastructure**: Configure Google Cloud SQL (Postgres 15+) with `pgvector` extension enabled.
- [ ] **Connectivity**: Connect the Cloud Run service to the Cloud SQL instance (using VPC Connector or Public IP with Auth Proxy).
- [x] **Migration Script**: Create a rigorous python script (`migrate_vectors.py`) to:
    - Read `knowledge_nodes` from legacy Firestore or local JSON.
    - Generate Embeddings using `vertexai.language_models.TextEmbeddingModel`.
    - Bulk Insert into the new Postgres `KnowledgeNode` table.
- [ ] **Verification**: Run `python manage.py check_rag_health` to verify retrieval returns >0 results for seeded queries.

### 2. Real Data Pipeline (The "Feedback Loop")
**Objective**: Stop training on synthetic data. Start learning from reality.
- [ ] **Logging**: Ensure `InteractionLog` in Django captures *every* incoming query and the model's prediction.
- [ ] **Feedback UI**: Update Frontend to send explicit feedback (Thumbs Up/Down) which writes to `InteractionLog.feedback_score`.
- [ ] **Dataset Versioning**: Create a `datasets/` logical partition in Cloud Storage to store nightly dumps of user interactions.
- [ ] **Annotation Protocol**: Build a simple Streamlit or Django Admin view to manually review "Low Confidence" queries (<0.60) and label them.

### 3. Model Retraining Strategy (The "Brains")
**Objective**: Move from "v3-distilbert-synthetic" to "v4-distilbert-real".
- [ ] **Trigger**: Retrain only when we have >500 verified real user labels.
- [ ] **Safety Layer**: 
    - Split data 80/10/10 (Train/Val/Test).
    - **Regression Test**: If accuracy on *previous* test set drops >2%, abort deployment.
- [ ] **Artifact Management**: Save models as `gs://bucket/models/vX/` and load dynamically or at container build time.

### 4. Evaluation Harness (The "Safety Net")
**Objective**: Never deploy a dumber brain.
- [ ] **Golden Set**: Create `tests/golden_queries.json` with 50 diverse queries and their *mandatory* intents.
- [ ] **CI Integration**: Run `pytest tests/test_intelligence.py` on every PR.
- [ ] **Latency Budget**: Fail tests if inference takes >200ms (p95).

### 5. Frontend Integration Contract
**Objective**: Frontend should be "Brain Agnostic".
- [ ] **API Response**: Ensure Frontend handles the `is_confused` flag.
    - If `is_confused=true` → Show "I'm not sure, but here is what I found..."
    - If `confidence < 0.4` → Show "Could you rephrase that?"
- [ ] **Latency Masking**: Ensure the "Typing..." animation persists for at least 800ms even if the API is faster, to prevent "flicker".
- [ ] **Error Handling**: Graceful fallback to "Offline Mode" if Cloud Run cold starts timeout (>10s).

### 6. Cost & Latency
**Objective**: Sustainable scaling.
- [ ] **Cold Starts**: Set `min-instances=1` on Cloud Run during launch week.
- [ ] **VRAM**: DistilBERT is CPU-friendly. Monitor memory usage; if >1.5GB, switch to `MobileBERT`.
- [ ] **Embedding Cache**: Cache embeddings for identical queries in Redis or local memory LRU.
