-- 🌌 AIGestion: Master Sovereign Schema (God Mode)
-- Description: Full database architecture for AI-powered sovereign management.
-- Version: 2.0.0

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SCHEMAS & UTILITIES
-- (Using public schema for core features to maintain compatibility with Supabase client)

-- Function to handle updated_at automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. CORE TABLES

-- 3.1 Profiles (Extended User Data)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'god')),
    credits INTEGER DEFAULT 100,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3.2 Projects (Logical grouping of AI entities)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    settings JSONB DEFAULT '{}'::jsonb,
    ai_tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3.3 Documents (Sovereign Knowledge Base for RAG)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding VECTOR(1536), -- Optimized for OpenAI/Gemini embeddings
    token_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3.4 AI Sessions (Conversations and generation threads)
CREATE TABLE IF NOT EXISTS public.ai_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    session_type TEXT DEFAULT 'chat' CHECK (session_type IN ('chat', 'image_generation', 'analysis', 'voice')),
    title TEXT,
    status TEXT DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3.5 AI Messages (Individual interaction records)
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.ai_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tokens_used INTEGER,
    latency_ms INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3.6 Usage Metrics (Audit trail and billing)
CREATE TABLE IF NOT EXISTS public.usage_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,
    amount INTEGER DEFAULT 0,
    cost NUMERIC(10, 6) DEFAULT 0,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. REAL-TIME CONFIGURATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.usage_metrics;

-- 5. ROW LEVEL SECURITY (GOD MODE STRATEGY)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_metrics ENABLE ROW LEVEL SECURITY;

-- 5.1 Policies: Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 5.2 Policies: Projects
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- 5.3 Policies: Documents
CREATE POLICY "Users can view documents of own projects"
ON public.documents FOR SELECT
USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

CREATE POLICY "Users can insert documents into own projects"
ON public.documents FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

-- 5.4 Policies: AI Sessions & Messages
CREATE POLICY "Users managed sessions" ON public.ai_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users managed messages" ON public.ai_messages FOR ALL
USING (EXISTS (SELECT 1 FROM public.ai_sessions WHERE id = session_id AND user_id = auth.uid()));

-- 6. ADVANCED AI FUNCTIONS (RPCs)

-- 6.1 Vector Search function (Retrieval Augmented Generation)
CREATE OR REPLACE FUNCTION public.match_documents (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  p_project_id UUID
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
    AND 1 - (d.embedding <=> query_embedding) > match_threshold
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 7. PROVISIONING & TRIGGERS

-- 7.1 Auto-provision profile on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7.2 Updated At triggers
CREATE TRIGGER set_timestamp_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_timestamp_projects BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_timestamp_documents BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_timestamp_ai_sessions BEFORE UPDATE ON public.ai_sessions FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 8. STORAGE BUCKETS CONFIGURATION (SQL helper)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('ai-outputs', 'ai-outputs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Avatar Read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Avatar Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Private Project Files" ON storage.objects FOR ALL
USING (bucket_id = 'project-files' AND auth.role() = 'authenticated');

-- 9. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_documents_embedding ON public.documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_ai_messages_session ON public.ai_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_user ON public.usage_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects(user_id);

COMMENT ON TABLE public.profiles IS 'Sovereign users profiles synchronized with Auth.';
COMMENT ON TABLE public.documents IS 'Knowledge base for vector search and RAG operations.';
