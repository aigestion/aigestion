-- 🌌 AIGestion: Sovereign AI Advanced Operations (God Mode Addon)
-- Description: Advanced features for RAG, Hybrid Search and AI Management.
-- Version: 1.1.0

-- 1. FULL TEXT SEARCH INFRASTRUCTURE
-- Add GIN index for text search on documents
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS fts_content tsvector
GENERATED ALWAYS AS (to_tsvector('spanish', coalesce(title, '') || ' ' || content)) STORED;

CREATE INDEX IF NOT EXISTS idx_documents_fts ON public.documents USING GIN (fts_content);

-- 2. HYBRID SEARCH RPC
CREATE OR REPLACE FUNCTION public.hybrid_search(
  query_text TEXT,
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  p_project_id UUID,
  full_text_weight FLOAT DEFAULT 0.5,
  vector_weight FLOAT DEFAULT 0.5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH vector_search AS (
    SELECT
      d.id,
      1 - (d.embedding <=> query_embedding) AS rank
    FROM public.documents d
    WHERE d.project_id = p_project_id
  ),
  fts_search AS (
    SELECT
      d.id,
      ts_rank_cd(d.fts_content, plainto_tsquery('spanish', query_text)) AS rank
    FROM public.documents d
    WHERE d.project_id = p_project_id
  )
  SELECT
    d.id,
    d.title,
    d.content,
    d.metadata,
    (coalesce(v.rank, 0) * vector_weight + coalesce(f.rank, 0) * full_text_weight) AS similarity
  FROM public.documents d
  LEFT JOIN vector_search v ON d.id = v.id
  LEFT JOIN fts_search f ON d.id = f.id
  WHERE d.project_id = p_project_id
    AND (coalesce(v.rank, 0) * vector_weight + coalesce(f.rank, 0) * full_text_weight) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- 3. PROMPT TEMPLATES MANAGEMENT
CREATE TABLE IF NOT EXISTS public.prompt_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    system_prompt TEXT NOT NULL,
    user_prompt_template TEXT,
    parameters JSONB DEFAULT '[]'::jsonb,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Active Templates" ON public.prompt_templates FOR SELECT USING (is_active = true);

-- 4. KNOWLEDGE BASE FOLDERS
CREATE TABLE IF NOT EXISTS public.kb_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    parent_id UUID REFERENCES public.kb_folders(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES public.kb_folders(id) ON DELETE SET NULL;

-- 5. AUDIT LOGS (GOD MODE TRACING)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);

-- 6. ANALYTICS VIEWS
CREATE OR REPLACE VIEW public.usage_summary AS
SELECT
    user_id,
    feature,
    sum(amount) as total_amount,
    sum(cost) as total_cost,
    max(created_at) as last_use
FROM public.usage_metrics
GROUP BY user_id, feature;

COMMENT ON FUNCTION public.hybrid_search IS 'Combina búsqueda semántica (vectores) y búsquedas por palabras clave (FTS) para precisión máxima.';
