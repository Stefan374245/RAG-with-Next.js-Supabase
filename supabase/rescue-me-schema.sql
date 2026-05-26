-- ================================================================
-- Rescue Me: Workshop Manual Knowledge Base
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This adds new tables ONLY — your existing 'knowledge' table is untouched
-- ================================================================

-- pgvector is already active from your existing RAG system
-- create extension if not exists vector;

-- ----------------------------------------------------------------
-- Table: rescue_me_chunks
-- Stores workshop manual text chunks with Gemini embeddings (768-dim)
-- ----------------------------------------------------------------
create table if not exists rescue_me_chunks (
  id          uuid primary key default gen_random_uuid(),
  content     text not null,
  embedding   vector(1536),
  metadata    jsonb default '{}'::jsonb,
  created_at  timestamp with time zone default now()
);

-- metadata shape:
-- {
--   "make":         "KTM",
--   "model":        "690 Enduro R",
--   "source_file":  "ktm_690_enduro_r_service_manual.pdf",
--   "chunk_index":  0,
--   "total_chunks": 312
-- }

-- ----------------------------------------------------------------
-- HNSW Index for fast cosine similarity search
-- ----------------------------------------------------------------
create index if not exists rescue_me_chunks_embedding_idx
  on rescue_me_chunks
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- ----------------------------------------------------------------
-- RPC: match_rescue_chunks
-- Semantic search with optional bike make/model filter
-- ----------------------------------------------------------------
create or replace function match_rescue_chunks(
  query_embedding  vector(1536),
  bike_make        text    default null,
  bike_model       text    default null,
  match_threshold  float   default 0.5,
  match_count      int     default 6
)
returns table (
  id          uuid,
  content     text,
  metadata    jsonb,
  similarity  float
)
language plpgsql as $$
begin
  return query
  select
    rmc.id,
    rmc.content,
    rmc.metadata,
    1 - (rmc.embedding <=> query_embedding) as similarity
  from rescue_me_chunks rmc
  where
    1 - (rmc.embedding <=> query_embedding) > match_threshold
    and (bike_make  is null or rmc.metadata->>'make'  ilike bike_make)
    and (bike_model is null or rmc.metadata->>'model' ilike '%' || bike_model || '%')
  order by rmc.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- ----------------------------------------------------------------
-- RPC: insert_rescue_chunk
-- Used by the ingestion script to store chunks
-- ----------------------------------------------------------------
create or replace function insert_rescue_chunk(
  p_content    text,
  p_embedding  vector(1536),
  p_metadata   jsonb default '{}'::jsonb
)
returns uuid
language plpgsql as $$
declare
  new_id uuid;
begin
  insert into rescue_me_chunks (content, embedding, metadata)
  values (p_content, p_embedding, p_metadata)
  returning id into new_id;
  return new_id;
end;
$$;

-- ----------------------------------------------------------------
-- Verify setup
-- ----------------------------------------------------------------
select
  'rescue_me_chunks table ready' as status,
  count(*) as chunk_count
from rescue_me_chunks;
