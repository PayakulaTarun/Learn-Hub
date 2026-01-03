import json
import os
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from torch.optim import AdamW
import random

# --- CONFIG ---
EPOCHS = 3           # Low for speed
BATCH_SIZE = 8       # Low for memory safety
LEARNING_RATE = 5e-5
MODEL_NAME = 'distilbert-base-uncased'
MAX_LEN = 64         # Short text inputs

# --- PATHS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
DATA_PATH = os.path.join(PROJECT_ROOT, "training", "synthetic_data.jsonl")
MODEL_SAVE_DIR = os.path.join(PROJECT_ROOT, "inference", "models", "bert_intent")

# Ensure synthetic data exists
if not os.path.exists(DATA_PATH):
    print("Generating data...")
    from training.generate_data import generate_data
    generate_data(100, DATA_PATH)

# --- MAP LABELS ---
LABEL_MAP = {
    "concept_learning": 0,
    "problem_solving": 1,
    "interview_preparation": 2,
    "quick_revision": 3
}

class IntentDataset(Dataset):
    def __init__(self, data, tokenizer, max_len):
        self.data = data
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.data)

    def __getitem__(self, index):
        text = self.data[index]['text']
        label = self.data[index]['label']
        label_id = LABEL_MAP.get(label, 0) # Default to 0 if unknown

        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            max_length=self.max_len,
            return_token_type_ids=False,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt',
        )

        return {
            'text': text,
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label_id, dtype=torch.long)
        }

def train():
    print("--- 🧠 INITIALIZING NEURAL TRAINING (DistilBERT) ---")
    
    # 1. Load Data
    raw_data = []
    with open(DATA_PATH, 'r') as f:
        for line in f:
            raw_data.append(json.loads(line))
    print(f"Loaded {len(raw_data)} training samples.")

    # 2. Tokenizer & Dataset
    tokenizer = DistilBertTokenizer.from_pretrained(MODEL_NAME)
    dataset = IntentDataset(raw_data, tokenizer, MAX_LEN)
    loader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

    # 3. Model
    device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
    print(f"Training on: {device}")
    
    model = DistilBertForSequenceClassification.from_pretrained(
        MODEL_NAME, 
        num_labels=len(LABEL_MAP)
    )
    model.to(device)
    model.train()

    # 4. Optimizer
    optimizer = AdamW(model.parameters(), lr=LEARNING_RATE)

    # 5. Training Loop
    for epoch in range(EPOCHS):
        total_loss = 0
        for batch in loader:
            optimizer.zero_grad()
            
            input_ids = batch['input_ids'].to(device)
            mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)
            
            outputs = model(input_ids, attention_mask=mask, labels=labels)
            loss = outputs.loss
            total_loss += loss.item()
            
            loss.backward()
            optimizer.step()
            
        avg_loss = total_loss / len(loader)
        print(f"Epoch {epoch+1}/{EPOCHS} | Loss: {avg_loss:.4f}")

    # 6. Save Artifacts
    if not os.path.exists(MODEL_SAVE_DIR):
        os.makedirs(MODEL_SAVE_DIR)
        
    print(f"Saving model to {MODEL_SAVE_DIR}...")
    model.save_pretrained(MODEL_SAVE_DIR)
    tokenizer.save_pretrained(MODEL_SAVE_DIR)
    
    # Save Label Map for Inference
    with open(os.path.join(MODEL_SAVE_DIR, "label_map.json"), "w") as f:
        json.dump(LABEL_MAP, f)
        
    print("✅ Training Complete. The Brain is Ready.")

if __name__ == "__main__":
    train()
