--
-- RAG AI: Initiales Datenbank-Schema für Wissensdatenbank & Vektorsuche
--
-- Diese Migration richtet die nötigen Tabellen, Indizes und Funktionen für ein Retrieval-Augmented-Generation (RAG) System ein.
-- Jede Sektion ist unten auf Deutsch dokumentiert.

-- Enable pgvector Extension
-- Aktiviert die pgvector-Erweiterung, damit Vektor-Operationen (z.B. Ähnlichkeitssuche) in Postgres möglich sind.
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge Base Table
-- Haupttabelle für alle Wissensdokumente. Jedes Dokument erhält ein Embedding (Vektor), das für die semantische Suche genutzt wird.
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Index for Cosine Similarity (HNSW)
-- Index für schnelle Vektor-Ähnlichkeitssuche (cosine similarity) mit HNSW-Algorithmus.
CREATE INDEX idx_knowledge_embedding ON knowledge_base 
USING hnsw (embedding vector_cosine_ops);

-- Optional: Chat History Table
-- Tabelle für Chat-Verläufe. Speichert alle Nachrichten einer Session inkl. Rolle (user/assistant) und ggf. Quellen.
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  sources JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für schnelle Abfrage aller Nachrichten einer Session (z.B. für Verlauf).
CREATE INDEX idx_chat_session ON chat_history(session_id, created_at DESC);

-- RPC Function: Semantic Search via Cosine Similarity
-- Postgres-Funktion für die semantische Suche: Findet die ähnlichsten Dokumente zur Anfrage (query_embedding) per Cosinus-Ähnlichkeit.
-- Wird von der App für die Vektorsuche genutzt (z.B. searchKnowledge()).
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
-- Postgres-Funktion zum Einfügen eines Dokuments inkl. Embedding in die knowledge_base-Tabelle.
-- Wird von seed-knowledge.ts und anderen Import-Skripten genutzt.
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
