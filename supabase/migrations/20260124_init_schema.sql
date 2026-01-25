-- Enable pgvector Extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge Base Table
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL, -- OpenAI text-embedding-3-small dimensions
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Index for Cosine Similarity (HNSW)
CREATE INDEX idx_knowledge_embedding ON knowledge_base 
USING hnsw (embedding vector_cosine_ops);

-- Optional: Chat History Table
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  sources JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_session ON chat_history(session_id, created_at DESC);

-- RPC Function: Semantic Search via Cosine Similarity
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_base.id,
    knowledge_base.title,
    knowledge_base.content,
    1 - (knowledge_base.embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_base.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- RPC Function: Insert document with proper vector type
CREATE OR REPLACE FUNCTION insert_knowledge(
  p_title TEXT,
  p_content TEXT,
  p_embedding vector(1536),
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO knowledge_base (title, content, embedding, metadata)
  VALUES (p_title, p_content, p_embedding, p_metadata)
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;
