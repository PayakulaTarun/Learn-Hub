# ARCHITECTURE V2: MIGRATION TO DJANGO & DEEP LEARNING
**Target System Design Document**
**Date:** 2026-01-03
**Status:** DRAFT

This document outlines the architectural roadmap to transform the current "Student Resource Hub" from a heuristic Node.js backend to a specialized Python/Django Artificial Intelligence System.

---

## SECTION A — FINAL TARGET ARCHITECTURE

### 1. High-Level Diagram

```mermaid
graph TD
    User[Learner Next.js] -->|HTTPS/JSON| LoadBalancer
    LoadBalancer -->|Auth Check| FirebaseAuth[Firebase Auth]
    LoadBalancer -->|/api/ai/*| Django[Django API Cluster]
    LoadBalancer -->|/vectors/*| FirebaseFunc[Legacy Node Functions (Optional)]
    
    subgraph Django Core (Python)
        API[REST API Layer] --> Controller[Orchestrator]
        Controller -->|Sync| Inference[ML Inference Engine]
        Controller -->|Async| Observer[Learning Observer]
        Inference -->|Load| ModelRegistry[Model Artifacts]
        Observer -->|Log| DataStore[PostgreSQL / BigQuery]
    end
    
    subgraph AI Services
        Inference -->|Embedding| VertexAI[Google Vertex AI]
        Inference -->|Generation| Gemini[Gemini 1.5 Pro]
        Inference -->|Retrieval| VectorDB[Vector Database (Pgvector/Firestore)]
    end
    
    subgraph Offline Training Loop
        DataStore -->|Export| Pandas[Data Processing]
        Pandas -->|Train| PyTorch[Deep Learning Trainer]
        PyTorch -->|Export .pt| ModelRegistry
    end
```

### 2. Key Components
*   **Frontend (Next.js):** Remains the "dumb" client. It renders output and captures inputs.
*   **The Brain (Django):** Replaces `AIService.ts`. It runs distinct Neural Networks for understanding context before calling Gemini.
*   **The Memory (PostgreSQL + Pgvector):** Replaces Firestore for complex relational data and vector storage.
*   **The Generator (Gemini):** Remains strictly a language engine, not the decision maker.

---

## SECTION B — PHASED MIGRATION ROADMAP

We do NOT rewrite everything at once. We use a **Strangler Fig Pattern**.

### Phase 1: The "Sidecar" Brain (Weeks 1-3)
*   **Goal:** Introduce Python without breaking the app.
*   **Action:** Deploy a Django service alongside Firebase Functions.
*   **Flow:** Firebase Function receives request -> Forwards text to Django for "Intent Classification" -> Django returns JSON -> Firebase Function proceeds with existing logic.
*   **Outcome:** We validate Python infrastructure and latency.

### Phase 2: The Logic Swap (Weeks 4-6)
*   **Goal:** Move `AIService` orchestration to Django.
*   **Action:** React frontend points `/api/chat` directly to Django.
*   **Flow:** Django handles Auth verification, Retrieval, and Gemini calls. Firebase Functions strictly handle "legacy" tasks (deployment scripts).
*   **Outcome:** Node.js backend is deprecated for AI tasks.

### Phase 3: The Intelligence Layer (Weeks 7-10)
*   **Goal:** Activate Neural Networks.
*   **Action:** Replace "If/Else" intent logic with a fine-tuned `DistilBERT` model. Replace "Difficulty" guessing with a regression model.
*   **Flow:** Inference happens locally in Django (or via TorchServe).
*   **Outcome:** True specialized AI behavior.

---

## SECTION C — DJANGO BACKEND DESIGN

**Project:** `cognitive_core`

```text
cognitive_core/
├── manage.py
├── core/
│   ├── settings.py           # Vertex AI & DB Config
│   ├── urls.py
│   └── wsgi.py
├── api/                      # REST Endpoints
│   ├── views.py              # ChatView, InterviewView
│   ├── serializers.py
│   └── auth.py               # Firebase Token Verifier
├── inference/                # The AI Logic
│   ├── engine.py             # Orchestrator
│   ├── models/               # Loaded .pt / .pkl files
│   │   ├── intent_net.pt     # Deep Learning Model 1
│   │   └── mastery_regressor.pkl
│   └── rag/
│       ├── retriever.py      # Vector Search Logic
│       └── gemini_client.py  # Wrapper
├── training/                 # Offline Scripts
│   ├── export_data.py
│   └── train_intent.py
└── storage/                  # Database Models
    ├── models.py             # UserProfile, ChatLog, LearningSignal
    └── migrations/
```

---

## SECTION D — ML / DL MODEL DESIGN

We will train 3 specialized "Small Expert Models" to control the "Large General Model" (Gemini).

### Model 1: Intent Recognition Network (IRN)
*   **Architecture:** DistilBERT (Fine-tuned Transformer).
*   **Input:** User Query string.
*   **Output:** Probability vector `[Concept: 0.8, Interview: 0.1, ...]`
*   **Why:** Simple keyword matching fails on complex queries like "I don't get why my loop is broken" (Debug) vs "How do loops work?" (Concept).
*   **Influence:** Selects specific system prompts and retrieval strategies.

### Model 2: Confusion Detection Model (CDM)
*   **Architecture:** LSTM or GRU (Sequence Model).
*   **Input:** Sequence of last 3 message vectors + timing data.
*   **Output:** Binary `[Is_Confused: 0/1]`.
*   **Why:** To proactively offer "Simpler Explanation" before the user asks for it.
*   **Influence:** Triggers `BehaviorAdapter` to lower verbosity or request analogies.

### Model 3: Topic Mastery Estimator (TME)
*   **Architecture:** Bayesian Knowledge Tracing (BKT) or simple Logistic Regression.
*   **Input:** History of correct/incorrect answers + question difficulty.
*   **Output:** Scalar `[Mastery_Score: 0.0 - 1.0]`.
*   **Why:** To determine if we should suggest a "Harder Problem" or "Review".

---

## SECTION E — DATA & TRAINING PIPELINE

**Rule:** Training never happens during a chat. It happens typically continuously or nightly.

1.  **Collection:**
    *   Every chat cycle logs 50+ data points to `raw_interaction_logs` (Postgres).
    *   Metrics: Latency, User Rating, detected_intent, Gemini_confidence.

2.  **Processing (The ETL):**
    *   Script: `training/export_data.py`
    *   Action: Flattens logs into a CSV dataset: `query | user_context | intent_label | success_flag`.

3.  **Labelling:**
    *   **Auto-Labeling:** Use GPT-4o or Gemini 1.5 Pro to "Grade" historical anonymized interactions to create a "Silver Standard" dataset.
    *   **Human-Labeling:** You manually review flagged "Low Confidence" rows.

4.  **Training:**
    *   Script: `training/train_intent.py` (PyTorch).
    *   Action: Loads `DistilBERT`, feeds dataset, minimizes CrossEntropyLoss.
    *   Output: `intent_net_v2.pt`

5.  **Deployment:**
    *   The file is moved to `inference/models/`.
    *   Django server reloads (or polls) the model directory.

---

## SECTION F — HOW "LEARNING" ACTUALLY HAPPENS

Let's maintain technical honesty.

1.  **The LLM (Gemini) does NOT learn.** It is frozen. It will never "remember" a fact you told it yesterday unless that fact is saved to the Vector DB.
2.  **The Controller DOES learn.** The "Small Expert Models" (Section D) are what we update.
    *   *Example:* If users keep getting frustrated (negative feedback) when asking about "Recursion" because the system thinks they want "Code Examples" but they actually wanted "Theory", the **Intent Model** will eventually learn (via re-training on the feedback data) that "Recursion" queries usually imply "Theory" need.
    *   Next week, the system automatically routes "Recursion" questions to the "Theory" prompt. **That is the learning loop.**

---

## SECTION G — FUTURE EXTENSIONS (VOICE & VISION)

Django/Python is essential here because Node.js lacks mature scientific libraries.

1.  **Voice (Audio):**
    *   **Lib:** `torchaudio` or `Whisper` (OpenAI).
    *   **Feat:** Real-time speech-to-text + "Tone Confidence" analysis.
    *   **Hook:** `api/views.py` accepts `.wav` blobs -> Passes to `Inference/AudioEngine`.

2.  **Vision (Video):**
    *   **Lib:** `OpenCV` + `MediaPipe` (Google).
    *   **Feat:** Mock Interview "Eye Contact" tracking.
    *   **Hook:** Client streams video frames -> Django calculates "Attention Score" -> Stores in `InterviewReport`.

---

## SECTION H — LIMITATIONS & RISKS

1.  **Latency:**
    *   Running BERT inference on CPU (Cloud Run) adds ~100-300ms per request.
    *   *Fix:* Use quantized models (INT8) or ONNX Runtime.

2.  **Cold Starts:**
    *   Loading PyTorch models takes seconds. Serverless containers might time out on first hit.
    *   *Fix:* Keep at least 1 instance "warm" or use a dedicated model serving endpoint.

3.  **Cost:**
    *   Python containers require more memory (RAM) than Node.js.
    *   Storing vector data in Postgres (Pgvector) is cheaper than Firestore for large scale, but management overhead is higher.

---
*End of Design Document*
