import { supabase } from './supabase';

const getSupabase = () => {
  if (!supabase) {
    console.warn('Supabase not configured');
    throw new Error('Supabase not configured');
  }
  return supabase;
};

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
    const hash = this.generatePromptHash(prompt, model);

    const { data, error } = await getSupabase()
      .from('ai_image_cache')
      .select('*')
      .eq('hash', hash)
      .eq('model', model)
      .maybeSingle();

    if (data && !error) {
      return data;
    }

    return null;
  }

  static async cacheImage(
    prompt: string,
    model: string,
    imageUrl: string,
    settings: Record<string, any> = {}
  ): Promise<AIImageCache> {
    const hash = this.generatePromptHash(prompt, model);

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
    count: number = 5
  ): Promise<any[]> {
    const { data, error } = await getSupabase().rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: count,
      p_project_id: projectId,
    });

    if (error) throw error;
    return data || [];
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
  // UTILITIES
  private static generatePromptHash(prompt: string, model: string): string {
    return btoa(prompt + model)
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 32);
  }
}

export default SupabaseGodService;
