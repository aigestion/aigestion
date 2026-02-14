-- 🌌 AIGestion: Sovereign DB Optimization (God Level Layer)
-- Description: Maximum performance, security hardening, and RAG intelligence.
-- Version: 3.0.0 (Feb 2026)

-- 1. VECTOR PERFORMANCE UPGRADE (HNSW)
-- Industry standard for fast semantic search compared to ivfflat.
DROP INDEX IF EXISTS public.idx_documents_embedding;
CREATE INDEX IF NOT EXISTS idx_documents_embedding_hnsw 
ON public.documents 
USING hnsw (embedding vector_cosine_ops);

-- 2. IMAGE CACHE OPTIMIZATION
CREATE INDEX IF NOT EXISTS idx_ai_image_cache_hash_model 
ON public.ai_image_cache (hash, model);

-- Add access tracking if missing
ALTER TABLE public.ai_image_cache ADD COLUMN IF NOT EXISTS access_count INTEGER DEFAULT 0;
ALTER TABLE public.ai_image_cache ADD COLUMN IF NOT EXISTS last_accessed TIMESTAMPTZ DEFAULT now();

-- 3. UNIFIED METADATA FILTERING RPC (God Mode RAG)
-- Supports arbitrary JSONB filters for precise retrieval.
CREATE OR REPLACE FUNCTION public.match_documents_advanced (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  p_project_id UUID,
  p_metadata_filter JSONB DEFAULT '{}'::jsonb
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
  SELECT
    d.id,
    d.title,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM public.documents d
  WHERE d.project_id = p_project_id
    AND (p_metadata_filter = '{}'::jsonb OR d.metadata @> p_metadata_filter)
    AND 1 - (d.embedding <=> query_embedding) > match_threshold
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 4. LOGGING & AUDIT AUTOMATION
CREATE OR REPLACE FUNCTION public.process_audit_log() 
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, old_data)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, row_to_json(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, old_data, new_data)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, new_data)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit to core entities
DROP TRIGGER IF EXISTS tr_audit_projects ON public.projects;
CREATE TRIGGER tr_audit_projects AFTER INSERT OR UPDATE OR DELETE ON public.projects FOR EACH ROW EXECUTE PROCEDURE public.process_audit_log();

DROP TRIGGER IF EXISTS tr_audit_documents ON public.documents;
CREATE TRIGGER tr_audit_documents AFTER INSERT OR UPDATE OR DELETE ON public.documents FOR EACH ROW EXECUTE PROCEDURE public.process_audit_log();

-- 5. RELIABLE SESSION CLEANUP
-- Function to prune old sessions (Optional management helper)
CREATE OR REPLACE FUNCTION public.prune_old_sessions(days_old INT DEFAULT 30)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.ai_sessions
  WHERE updated_at < now() - (days_old || ' days')::interval
    AND status = 'archived';
END;
$$ LANGUAGE plpgsql;

-- 6. RLS REINFORCEMENT
-- Tighten prompt templates: only authenticated users can see active ones.
DROP POLICY IF EXISTS "Public Read Active Templates" ON public.prompt_templates;
CREATE POLICY "Auth Read Active Templates" 
ON public.prompt_templates 
FOR SELECT 
TO authenticated 
USING (is_active = true);

-- Add missing index for session cleanup performance
CREATE INDEX IF NOT EXISTS idx_ai_sessions_updated_at ON public.ai_sessions (updated_at);

-- 7. NOTIFICATIONS (Sovereign Alert System)
-- Helper to insert into audit_logs for system events without auth context
CREATE OR REPLACE FUNCTION public.log_system_event(p_action TEXT, p_details JSONB)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_logs (action, entity_type, new_data)
  VALUES (p_action, 'system', p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.match_documents_advanced IS 'Búsqueda vectorial avanzada con filtrado de metadatos JSONB.';
