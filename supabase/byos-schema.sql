-- ================================================================
-- BYOS — Bring Your Own Manual
-- User-isolierter RAG-Store für selbst hochgeladene Workshop-Handbücher
-- Run this in Supabase SQL Editor AFTER rescue-me-schema.sql
-- ================================================================

-- ----------------------------------------------------------------
-- Table: user_documents
-- Metadaten pro hochgeladenes PDF (1 Row = 1 Handbuch)
-- ----------------------------------------------------------------
create table if not exists user_documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  file_name   text not null,
  make        text,
  model       text,
  chunk_count int  default 0,
  status      text default 'processing',  -- 'processing' | 'ready' | 'error'
  created_at  timestamptz default now()
);

-- ----------------------------------------------------------------
-- Table: user_manual_chunks
-- Vector-Store für User-eigene Handbuch-Chunks (parallel zu rescue_me_chunks)
-- ----------------------------------------------------------------
create table if not exists user_manual_chunks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  document_id uuid not null references user_documents(id) on delete cascade,
  content     text not null,
  embedding   vector(1536),
  metadata    jsonb default '{}'::jsonb,
  created_at  timestamptz default now()
);

-- metadata shape (identisch zu rescue_me_chunks):
-- {
--   "make":         "KTM",
--   "model":        "690 Enduro R",
--   "source_file":  "ktm_690_workshop.pdf",
--   "chunk_index":  0,
--   "total_chunks": 312
-- }

-- ----------------------------------------------------------------
-- HNSW Index (gleiche Settings wie rescue_me_chunks)
-- ----------------------------------------------------------------
create index if not exists user_manual_chunks_embedding_idx
  on user_manual_chunks
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- ----------------------------------------------------------------
-- Row Level Security
-- Jeder User sieht und schreibt nur seine eigenen Daten
-- ----------------------------------------------------------------
alter table user_documents     enable row level security;
alter table user_manual_chunks enable row level security;

-- user_documents policies
create policy "user_documents_owner_select" on user_documents
  for select using (user_id = auth.uid());

create policy "user_documents_owner_insert" on user_documents
  for insert with check (user_id = auth.uid());

create policy "user_documents_owner_update" on user_documents
  for update using (user_id = auth.uid());

create policy "user_documents_owner_delete" on user_documents
  for delete using (user_id = auth.uid());

-- user_manual_chunks policies
create policy "user_chunks_owner_select" on user_manual_chunks
  for select using (user_id = auth.uid());

create policy "user_chunks_owner_insert" on user_manual_chunks
  for insert with check (user_id = auth.uid());

create policy "user_chunks_owner_delete" on user_manual_chunks
  for delete using (user_id = auth.uid());

-- ----------------------------------------------------------------
-- RPC: match_user_chunks
-- Semantic Search auf User-eigene Chunks (per user_id isoliert)
-- Aufgerufen vom rescue-me Edge Function mit service role key
-- ----------------------------------------------------------------
create or replace function match_user_chunks(
  p_user_id       uuid,
  query_embedding vector(1536),
  bike_make       text    default null,
  bike_model      text    default null,
  match_threshold float   default 0.25,
  match_count     int     default 6
)
returns table (
  id          uuid,
  content     text,
  metadata    jsonb,
  similarity  float
)
language plpgsql security definer as $$
begin
  return query
  select
    umc.id,
    umc.content,
    umc.metadata,
    1 - (umc.embedding <=> query_embedding) as similarity
  from user_manual_chunks umc
  where
    umc.user_id = p_user_id
    and 1 - (umc.embedding <=> query_embedding) > match_threshold
    and (bike_make  is null or umc.metadata->>'make'  ilike bike_make)
    and (bike_model is null or umc.metadata->>'model' ilike '%' || bike_model || '%')
  order by umc.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- ----------------------------------------------------------------
-- RPC: update_document_status
-- Wird von der ingest-user-manual Edge Function nach Verarbeitung aufgerufen
-- ----------------------------------------------------------------
create or replace function update_document_status(
  p_document_id uuid,
  p_status      text,
  p_chunk_count int default null
)
returns void
language plpgsql security definer as $$
begin
  update user_documents
  set
    status      = p_status,
    chunk_count = coalesce(p_chunk_count, chunk_count)
  where id = p_document_id;
end;
$$;

-- ----------------------------------------------------------------
-- Verify setup
-- ----------------------------------------------------------------
select 'user_documents table ready'     as status, count(*) as rows from user_documents
union all
select 'user_manual_chunks table ready' as status, count(*) as rows from user_manual_chunks;
