import { supabase } from './supabase';

const getSupabase = () => {
  if (!supabase) {
    throw new Error(
      '[SupabaseGodService] Client not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }
  return supabase;
};

// ═══════════════════════════════════════════════════════════════════
// Retry Wrapper — Exponential backoff for resilient DB operations
// ═══════════════════════════════════════════════════════════════════
async function withRetry<T>(
  operation: () => Promise<T>,
  label: string,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      // Don't retry auth errors or validation errors
      const code = error?.code || '';
      if (code.startsWith('PGRST') || code === '42501' || code === '23505') {
        throw error;
      }
      if (attempt === maxRetries) {
        console.error(`[SupabaseGod] ${label} failed after ${maxRetries + 1} attempts:`, error);
        throw error;
      }
      const delay = 200 * Math.pow(2, attempt); // 200ms, 400ms, 800ms
      console.warn(`[SupabaseGod] ${label} attempt ${attempt + 1} failed, retrying in ${delay}ms`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error(`[SupabaseGod] ${label} unreachable`);
}

export interface AIImageCache {
  id: string;
  prompt: string;
  model: string;
  image_url: string;
  settings: Record<string, any>;
  hash: string;
  created_at: string;
  updated_at: string;
  access_count: number;
  last_accessed: string;
}

export interface AIProject {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'deleted';
  ai_generated_summary?: string;
  ai_tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface AIDocument {
  id: string;
  project_id: string;
  title?: string;
  content: string;
  metadata: Record<string, any>;
  token_count?: number;
  folder_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AIPromptTemplate {
  id: string;
  name: string;
  description?: string;
  system_prompt: string;
  user_prompt_template?: string;
  parameters: any[];
  version: number;
}

export interface AISession {
  id: string;
  user_id: string;
  session_type: 'chat' | 'image_generation' | 'analysis';
  title?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, any>;
  created_at: string;
}

/**
 * 🌌 Supabase God Service - Maximum Performance AI Operations
 */
export class SupabaseGodService {
  // AI IMAGE CACHE OPERATIONS
  static async getCachedImage(
    prompt: string,
    model: string = 'flux-schnell'
  ): Promise<AIImageCache | null> {
    const hash = await this.generatePromptHash(prompt, model);

    return withRetry(async () => {
      const { data, error } = await getSupabase()
        .from('ai_image_cache')
        .select('*')
        .eq('hash', hash)
        .eq('model', model)
        .maybeSingle();

      if (data && !error) {
        // Update access count in background (fire & forget)
        getSupabase()
          .from('ai_image_cache')
          .update({
            access_count: (data.access_count || 0) + 1,
            last_accessed: new Date().toISOString(),
          })
          .eq('id', data.id)
          .then();
        return data;
      }
      return null;
    }, 'getCachedImage');
  }

  static async cacheImage(
    prompt: string,
    model: string,
    imageUrl: string,
    settings: Record<string, any> = {}
  ): Promise<AIImageCache> {
    const hash = await this.generatePromptHash(prompt, model);

    return withRetry(async () => {
      const { data, error } = await getSupabase()
        .from('ai_image_cache')
        .upsert(
          {
            prompt,
            model,
            image_url: imageUrl,
            settings,
            hash,
          },
          {
            onConflict: 'hash,model',
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    }, 'cacheImage');
  }

  // PROJECT OPERATIONS
  static async createProject(project: Partial<AIProject>): Promise<AIProject> {
    const { data, error } = await getSupabase()
      .from('projects')
      .insert({
        ...project,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getProjects(): Promise<AIProject[]> {
    const { data, error } = await getSupabase()
      .from('projects')
      .select('*')
      .eq('status', 'active')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // DOCUMENT OPERATIONS & RAG
  static async createDocument(document: Partial<AIDocument>): Promise<AIDocument> {
    const { data, error } = await getSupabase()
      .from('documents')
      .insert(document)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async searchSimilarDocuments(
    projectId: string,
    embedding: number[],
    threshold: number = 0.7,
    count: number = 5,
    metadataFilter: Record<string, any> = {}
  ): Promise<any[]> {
    return withRetry(async () => {
      const { data, error } = await getSupabase().rpc('match_documents_advanced', {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: count,
        p_project_id: projectId,
        p_metadata_filter: metadataFilter,
      });

      if (error) throw error;
      return data || [];
    }, 'searchSimilarDocuments');
  }

  static async searchHybrid(
    projectId: string,
    queryText: string,
    embedding: number[],
    threshold: number = 0.5,
    count: number = 5
  ): Promise<any[]> {
    const { data, error } = await getSupabase().rpc('hybrid_search', {
      query_text: queryText,
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: count,
      p_project_id: projectId,
    });

    if (error) throw error;
    return data || [];
  }

  // PROMPT TEMPLATES
  static async getPromptTemplate(name: string): Promise<AIPromptTemplate | null> {
    const { data, error } = await getSupabase()
      .from('prompt_templates')
      .select('*')
      .eq('name', name)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // AI SESSION OPERATIONS
  static async createSession(session: Partial<AISession>): Promise<AISession> {
    const { data, error } = await getSupabase()
      .from('ai_sessions')
      .insert(session)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserSessions(limit: number = 20): Promise<AISession[]> {
    const { data, error } = await getSupabase()
      .from('ai_sessions')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // MESSAGE OPERATIONS
  static async addMessage(message: Partial<AIMessage>): Promise<AIMessage> {
    const { data, error } = await getSupabase()
      .from('ai_messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // USAGE TRACKING
  static async trackUsage(
    feature: string,
    amount: number,
    cost: number = 0,
    details: Record<string, any> = {}
  ): Promise<void> {
    const { data: userData } = await getSupabase().auth.getUser();
    if (!userData.user) return;

    const { error } = await getSupabase().from('usage_metrics').insert({
      user_id: userData.user.id,
      feature,
      amount,
      cost,
      details,
    });

    if (error) throw error;
  }

  // REAL-TIME HELPERS
  static subscribeToMessages(sessionId: string, callback: (payload: any) => void): () => void {
    const channel = getSupabase()
      .channel(`session-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        payload => callback(payload)
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };
  }

  // PROFILE OPERATIONS
  static async getMyProfile(): Promise<any> {
    const {
      data: { user },
    } = await getSupabase().auth.getUser();
    if (!user) return null;

    const { data, error } = await getSupabase()
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  }
  // UTILITIES — SHA-256 via Web Crypto API (collision-resistant)
  private static async generatePromptHash(prompt: string, model: string): Promise<string> {
    const data = new TextEncoder().encode(`${prompt}::${model}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, 32);
  }
}

export default SupabaseGodService;
