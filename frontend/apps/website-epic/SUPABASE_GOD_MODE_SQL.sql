-- =====================================================
-- 🌌 AIGESTION SUPABASE GOD MODE OPTIMIZATION 🌌
-- Maximum Performance & Enterprise Configuration
-- =====================================================

-- 1. EXTENSIONS - Enable all necessary extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS uuid-ossp;

-- 2. STORAGE BUCKETS - Create AI image storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ai-images',
  'ai-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/webp', 'image/png', 'image/jpeg']
) ON CONFLICT (id) DO NOTHING;

-- 3. AI IMAGE CACHE TABLE - Optimized for high-performance lookups
CREATE TABLE IF NOT EXISTS ai_image_cache (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  prompt text NOT NULL,
  model text NOT NULL DEFAULT 'flux-schnell',
  image_url text NOT NULL,
  settings jsonb DEFAULT '{}',
  hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  access_count int DEFAULT 0,
  last_accessed timestamptz DEFAULT now()
);

-- 4. OPTIMIZED INDEXES - Maximum performance
CREATE INDEX IF NOT EXISTS idx_ai_image_cache_prompt_gin ON ai_image_cache USING gin(prompt gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_ai_image_cache_model_btree ON ai_image_cache USING btree(model);
CREATE INDEX IF NOT EXISTS idx_ai_image_cache_hash_btree ON ai_image_cache USING btree(hash);
CREATE INDEX IF NOT EXISTS idx_ai_image_cache_created_at_btree ON ai_image_cache USING btree(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_image_cache_access_count_btree ON ai_image_cache USING btree(access_count DESC);
CREATE INDEX IF NOT EXISTS idx_ai_image_cache_composite ON ai_image_cache USING btree(model, created_at DESC);

-- 5. USERS TABLE - Enhanced with AI features
CREATE TABLE IF NOT EXISTS users (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE,
  full_name text,
  avatar_url text,
  tier text DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  credits int DEFAULT 10 CHECK (credits >= 0),
  ai_usage_count int DEFAULT 0,
  last_ai_usage timestamptz,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. PROJECTS TABLE - AI-powered project management
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  ai_generated_summary text,
  ai_tags text[],
  embedding vector(1536),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. USAGE RECORDS - Detailed AI usage tracking
CREATE TABLE IF NOT EXISTS usage_records (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  feature text NOT NULL CHECK (feature IN ('image_generation', 'text_generation', 'embedding', 'vector_search')),
  amount int NOT NULL CHECK (amount > 0),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 8. DOCUMENTS TABLE - Vector search optimized
CREATE TABLE IF NOT EXISTS documents (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text,
  content text,
  metadata jsonb DEFAULT '{}',
  embedding vector(1536),
  token_count int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 9. AI SESSIONS TABLE - Track AI conversations
CREATE TABLE IF NOT EXISTS ai_sessions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  session_type text DEFAULT 'chat' CHECK (session_type IN ('chat', 'image_generation', 'analysis')),
  title text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 10. AI MESSAGES TABLE - Conversation history
CREATE TABLE IF NOT EXISTS ai_messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id uuid REFERENCES ai_sessions(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  embedding vector(1536),
  created_at timestamptz DEFAULT now()
);

-- 11. VECTOR INDEXES - Optimized for similarity search
CREATE INDEX IF NOT EXISTS idx_documents_embedding_cosine ON documents USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_ai_messages_embedding_cosine ON ai_messages USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_projects_embedding_cosine ON projects USING hnsw (embedding vector_cosine_ops);

-- 12. COMPOSITE INDEXES - Query optimization
CREATE INDEX IF NOT EXISTS idx_usage_records_user_feature_created ON usage_records USING btree(user_id, feature, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_project_created ON documents USING btree(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_messages_session_created ON ai_messages USING btree(session_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_ai_sessions_user_updated ON ai_sessions USING btree(user_id, updated_at DESC);

-- 13. DATABASE FUNCTIONS - AI operations
CREATE OR REPLACE FUNCTION update_ai_image_cache_access()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ai_image_cache
  SET access_count = access_count + 1,
      last_accessed = now(),
      updated_at = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_prompt_hash(prompt text, model text)
RETURNS text AS $$
BEGIN
  RETURN encode(sha256(prompt || model), 'hex');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_similar_documents(query_embedding vector(1536), limit_count int DEFAULT 5)
RETURNS TABLE(
  id uuid,
  project_id uuid,
  title text,
  content text,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.project_id,
    d.title,
    d.content,
    1 - (d.embedding <=> query_embedding) as similarity
  FROM documents d
  WHERE d.embedding IS NOT NULL
  ORDER BY d.embedding <=> query_embedding
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 14. TRIGGERS - Automated optimizations
CREATE TRIGGER update_ai_image_cache_access_trigger
  AFTER INSERT ON ai_image_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_image_cache_access();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 15. ROW LEVEL SECURITY - Maximum security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_image_cache ENABLE ROW LEVEL SECURITY;

-- 16. RLS POLICIES - Users can only access their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage" ON usage_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON usage_records FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view project documents" ON documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = documents.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can insert project documents" ON documents FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = documents.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can update project documents" ON documents FOR UPDATE USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = documents.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can delete project documents" ON documents FOR DELETE USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = documents.project_id AND projects.user_id = auth.uid())
);

CREATE POLICY "Users can view own AI sessions" ON ai_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own AI sessions" ON ai_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own AI sessions" ON ai_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own AI sessions" ON ai_sessions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view session messages" ON ai_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM ai_sessions WHERE ai_sessions.id = ai_messages.session_id AND ai_sessions.user_id = auth.uid())
);
CREATE POLICY "Users can insert session messages" ON ai_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM ai_sessions WHERE ai_sessions.id = ai_messages.session_id AND ai_sessions.user_id = auth.uid())
);

-- AI Image Cache - Public read access for performance
CREATE POLICY "Anyone can view AI images" ON ai_image_cache FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert AI images" ON ai_image_cache FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 17. STORAGE POLICIES - Secure file access
CREATE POLICY "Anyone can view AI images" ON storage.objects FOR SELECT USING (bucket_id = 'ai-images');
CREATE POLICY "Authenticated users can upload AI images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'ai-images' AND auth.role() = 'authenticated'
);
CREATE POLICY "Users can update own AI images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'ai-images' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can delete own AI images" ON storage.objects FOR DELETE USING (
  bucket_id = 'ai-images' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 18. REAL-TIME SUBSCRIPTIONS - Enable real-time features
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE ai_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE ai_messages;

-- 19. PERFORMANCE OPTIMIZATION - Database settings
ALTER TABLE ai_image_cache SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE ai_messages SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE documents SET (autovacuum_vacuum_scale_factor = 0.1);

-- 20. SAMPLE DATA - Initialize with demo data (optional)
INSERT INTO users (id, email, full_name, tier, credits) VALUES
  (uuid_generate_v4(), 'demo@aigestion.net', 'Demo User', 'pro', 1000)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 🚀 GOD MODE COMPLETED - SUPABASE OPTIMIZED 🚀
-- =====================================================
