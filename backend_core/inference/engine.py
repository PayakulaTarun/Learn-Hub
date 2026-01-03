import firebase_admin
from firebase_admin import firestore
import vertexai
from vertexai.generative_models import GenerativeModel
from google.cloud import aiplatform
import pickle
import os
import json
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import torch.nn.functional as F

class CognitiveEngine:
    """
    The main orchestrator for AI logic in the Django backend.
    PHASE 3 STATUS: DistilBERT Neural Network Active
    """
    
    PROJECT_ID = "student-resource-hub-a758a"
    LOCATION = "us-central1"
    MODEL_DIR = "inference/models/bert_intent"
    
    _model = None
    _tokenizer = None
    _label_map = None
    
    @classmethod
    def get_model(cls):
        if cls._model is None:
            try:
                if os.path.exists(cls.MODEL_DIR):
                    print("🧠 Loading Neural Network (DistilBERT)...")
                    cls._tokenizer = DistilBertTokenizer.from_pretrained(cls.MODEL_DIR)
                    cls._model = DistilBertForSequenceClassification.from_pretrained(cls.MODEL_DIR)
                    cls._model.eval() # Set to inference mode
                    
                    with open(os.path.join(cls.MODEL_DIR, "label_map.json"), "r") as f:
                        cls._label_map = {v: k for k, v in json.load(f).items()} # Invert map for lookup
                        
                    print("✅ Neural Network Loaded Successfully")
                else:
                    print(f"⚠️ Neural Network not found at {cls.MODEL_DIR}")
            except Exception as e:
                print(f"⚠️ Error loading Neural Network: {e}")
        return cls._model

    @classmethod
    def initialize(cls):
        if not firebase_admin._apps:
             # In production, use explicit credentials or rely on ADC
             firebase_admin.initialize_app()
        vertexai.init(project=cls.PROJECT_ID, location=cls.LOCATION)
        # Preload model
        cls.get_model()

    @staticmethod
    def get_embedding(text: str) -> list:
        # Using Vertex AI 'text-embedding-004'
        # Note: In real implementation, use the distinct model class
        from vertexai.language_models import TextEmbeddingModel
        model = TextEmbeddingModel.from_pretrained("text-embedding-004")
        embeddings = model.get_embeddings([text])
        return embeddings[0].values

    @staticmethod
    def retrieve_context(query_vector: list, limit=5) -> str:
        db = firestore.client()
        coll = db.collection("knowledge_vectors")
        
        # Vector Search in Python using Firestore
        # Requires 'google-cloud-firestore>=2.17.0'
        # vector_field="embedding"
        
        from google.cloud.firestore_v1.vector import Vector
        
        # find_nearest is available on the collection reference
        query = coll.find_nearest(
            vector_field="embedding",
            query_vector=Vector(query_vector),
            distance_measure="COSINE",
            limit=limit
        )
        
        docs = query.get()
        context_parts = []
        for doc in docs:
            data = doc.to_dict()
            context_parts.append(f"[Source: {data.get('filePath')}]\n{data.get('content')}")
            
        return "\n\n---\n\n".join(context_parts)

    @classmethod
    def generate_response(cls, query: str, context: str, intent: dict) -> str:
        # Load Model
        model = GenerativeModel("gemini-1.5-pro")
        
        system_instruction = f"""
You are the Student Resource Hub AI.
Intent: {intent.get('intent')}
Context:
{context}

Answer the user query based strictly on context.
"""
        response = model.generate_content(
            [system_instruction, query],
            generation_config={"temperature": 0.2}
        )
        return response.text

    @classmethod
    def run_rag_flow(cls, query: str):
        cls.initialize()
        
        # 1. Intent (Using Heuristics for now)
        intent_data = cls.analyze_intent(query)
        
        # 2. Embedding
        vector = cls.get_embedding(query)
        
        # 3. Retrieval
        context = cls.retrieve_context(vector)
        
        # 4. Generation
        response = cls.generate_response(query, context, intent_data)
        
        return {
            "response": response,
            "intent": intent_data,
            "context_used": bool(context)
        }

    @classmethod
    def analyze_intent(cls, query: str, context: dict = None):
        """
        Determines the intent of the user.
        Uses ML Model if available, else Heuristics.
        """
        query_lower = query.lower()
        
        # 1. ML Inference
        model = cls.get_model()
        if model and cls._tokenizer:
            try:
                # Tokenize
                inputs = cls._tokenizer(
                    query, 
                    return_tensors="pt", 
                    truncation=True, 
                    padding=True, 
                    max_length=64
                )
                
                # Predict
                with torch.no_grad():
                    outputs = model(**inputs)
                    
                # Calculate Probabilities
                probs = F.softmax(outputs.logits, dim=1)
                confidence, pred_id = torch.max(probs, dim=1)
                
                intent = cls._label_map.get(pred_id.item(), "exploratory_question")
                confidence = float(confidence.item())
                
            except Exception as e:
                print(f"Inference Error: {e}")
                intent = "exploratory_question"
                confidence = 0.5
        else:
            # 2. Heuristic Fallback
            intent = "exploratory_question"
            confidence = 0.85
            if any(w in query_lower for w in ["define", "what is", "explain"]):
                intent = "concept_learning"
            elif any(w in query_lower for w in ["how to", "code for", "implement", "error", "bug"]):
                intent = "problem_solving"
            elif any(w in query_lower for w in ["interview", "question", "mock"]):
                intent = "interview_preparation"
            elif any(w in query_lower for w in ["summary", "recap", "review"]):
                intent = "quick_revision"
            
        # Detect confusion (Mock LSTM - kept as rule for now)
        is_confused = False
        if any(w in query_lower for w in ["don't understand", "im lost", "confusing", "hard"]):
            is_confused = True
            
        return {
            "intent": intent,
            "confidence": confidence,
            "is_confused": is_confused,
            "model_version": "v3-distilbert" if model else "v1-heuristic-python"
        }
