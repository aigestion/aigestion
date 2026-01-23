-- Create the image cache table
CREATE TABLE IF NOT EXISTS public.ai_image_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    prompt TEXT NOT NULL,
    image_url TEXT NOT NULL,
    model TEXT NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb,
    UNIQUE(prompt, model)
);

-- Enable RLS on the table
ALTER TABLE public.ai_image_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_image_cache
-- Allow public read access to the cache
CREATE POLICY "Public Read Access" ON public.ai_image_cache
    FOR SELECT USING (true);

-- Only service role or authenticated users (if needed) can insert
-- For now, allowing all for ease of setup if it's a dev environment,
-- but ideally restricted to service_role.
CREATE POLICY "Service Role Insert" ON public.ai_image_cache
    FOR INSERT WITH CHECK (true);

-- Setup Storage Bucket
-- (Note: Creating buckets via SQL requires pg_net or using the storage API,
-- but we can define the policies here and create the bucket via the dashboard or service client)

-- Define storage policies for 'ai-images' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('ai-images', 'ai-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the 'ai-images' bucket
CREATE POLICY "Public Image Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'ai-images');

CREATE POLICY "Authenticated Image Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ai-images');

CREATE POLICY "Public Image Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'ai-images');
