-- Enable pgvector (Must be run by Superuser)
CREATE EXTENSION IF NOT EXISTS vector;

-- The Knowledge Store
CREATE TABLE IF NOT EXISTS knowledge_vectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL,         -- Source file (e.g., content/java/arrays.md)
  chunk_index INT NOT NULL,        -- Order of chunk in file
  raw_content TEXT NOT NULL,       -- Actual text used for RAG context
  heading TEXT,                    -- Nearest H1/H2 (Context metadata)
  embedding VECTOR(768),            -- 768 dim for Vertex AI gecko-003 or similar
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Composite Unique Constraint for Idempotency
  CONSTRAINT unique_chunk UNIQUE (file_path, chunk_index)
);

-- HNSW Index for Fast Ann Similarity Search
-- (Using vector_cosine_ops for Cosine Similarity)
CREATE INDEX IF NOT EXISTS knowledge_hnsw_idx 
ON knowledge_vectors USING hnsw (embedding vector_cosine_ops);
