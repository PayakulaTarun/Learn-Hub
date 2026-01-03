import os
import sys
import django
import json
import glob
from pathlib import Path

# Setup Django Environment
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR
sys.path.append(str(PROJECT_ROOT))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cognitive_core.settings')
django.setup()

from storage.models import KnowledgeNode
import vertexai
from vertexai.language_models import TextEmbeddingModel
from django.db import connection, transaction

# Configuration
CONTENT_DIR = PROJECT_ROOT.parent / "content"
PROJECT_ID = "student-resource-hub-a758a"
LOCATION = "us-central1"
MODEL_ID = "text-embedding-004"

def init_vertex():
    print(f"🔌 Initializing Vertex AI ({PROJECT_ID} @ {LOCATION})...")
    vertexai.init(project=PROJECT_ID, location=LOCATION)

def get_embeddings(texts, model):
    """
    Generates embeddings for a list of texts.
    Vertex AI limit is often 5 texts per request for some models, or 250 tokens?
    Actually text-embedding-004 supports batching up to 5/request usually in code samples,
    but we can do one by one for safety or small batches.
    """
    embeddings = []
    # Simple batching can be added if needed, doing 1-by-1 for robust progress logging
    for i, text in enumerate(texts):
        try:
            # Vertex AI expects a list
            result = model.get_embeddings([text])
            embeddings.append(result[0].values)
            sys.stdout.write(".")
            sys.stdout.flush()
        except Exception as e:
            print(f"\n⚠️ Error embedding text {i}: {e}")
            embeddings.append(None)
    print("")
    return embeddings

def enable_pgvector():
    """Attempts to enable pgvector extension if on Postgres."""
    if connection.vendor == 'postgresql':
        try:
            with connection.cursor() as cursor:
                cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            print("✅ pgvector extension enabled.")
        except Exception as e:
            print(f"⚠️ Could not enable pgvector: {e}")
    else:
        print(f"ℹ️ Database is {connection.vendor}, skipping pgvector extension creation.")

def process_file(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # Construct Content Blob
    title = data.get('title', 'Untitled')
    blob = f"Title: {title}\n"
    blob += f"Subject: {data.get('subject', '')} - {data.get('category', '')}\n"
    blob += f"Summary: {data.get('summary', '')}\n\n"
    blob += f"Theory: {data.get('theory', '')}\n\n"
    blob += f"Syntax: {data.get('syntax', '')}"
    
    # Truncate if insanely huge (optional, Vertex handles large context)
    return title, blob

def run():
    print("🚀 Starting Vector Migration...")
    
    # 0. Check Content Dir
    if not os.path.exists(CONTENT_DIR):
        print(f"❌ Content directory not found at {CONTENT_DIR}")
        return

    # 1. Enable DB Extensions
    enable_pgvector()
    
    # 2. Setup AI
    try:
        init_vertex()
        embedding_model = TextEmbeddingModel.from_pretrained(MODEL_ID)
    except Exception as e:
        print(f"❌ Failed to initialize Vertex AI: {e}")
        print("💡 Ensure you are authenticated (gcloud auth login) and API is enabled.")
        return

    # 3. Find Files
    # Recursive search for .json files
    json_files = glob.glob(str(CONTENT_DIR / "**/*.json"), recursive=True)
    print(f"📂 Found {len(json_files)} Content Files.")
    
    # 4. Processing
    nodes_to_create = []
    
    print("🧠 Generating Embeddings...")
    for file_path in json_files:
        try:
            title, content_blob = process_file(file_path)
            
            # Embed
            # We do it immediately here to handle errors per file
            embeddings = get_embeddings([content_blob], embedding_model)
            
            if embeddings[0]:
                node = KnowledgeNode(
                    title=title,
                    content=content_blob,
                    embedding=embeddings[0],
                    source_path=os.path.relpath(file_path, PROJECT_ROOT.parent)
                )
                nodes_to_create.append(node)
        except Exception as e:
            print(f"Skipping {file_path}: {e}")

    # 5. Bulk Insert
    print(f"\n💾 Saving {len(nodes_to_create)} nodes to Database...")
    try:
        # We delete old embeddings to avoid duplicates for this migration script
        # In production incremental, we'd check existence.
        count_before = KnowledgeNode.objects.count()
        if count_before > 0:
            print(f"   (Cleaning up {count_before} existing nodes...)")
            KnowledgeNode.objects.all().delete()
            
        KnowledgeNode.objects.bulk_create(nodes_to_create)
        print(f"✅ SUCCESSFULLY MIGRATED {len(nodes_to_create)} VECTORS!")
    except Exception as e:
        print(f"❌ Database Save Failed: {e}")
        if connection.vendor == 'sqlite':
            print("💡 NOTE: Schema migration to Postgres is required for VectorField support.")

if __name__ == "__main__":
    run()
