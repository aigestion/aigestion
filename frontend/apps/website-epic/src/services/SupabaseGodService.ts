import { supabase } from './supabase';

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
  created_at: string;
  updated_at: string;
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
  static async getCachedImage(prompt: string, model: string = 'flux-schnell'): Promise<AIImageCache | null> {
    const hash = this.generatePromptHash(prompt, model);

    const { data, error } = await supabase
      .from('ai_image_cache')
      .select('*')
      .eq('hash', hash)
      .eq('model', model)
      .single();

    if (data && !error) {
      // Update access count
      await supabase.rpc('update_ai_image_cache_access', { image_id: data.id });
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

    const { data, error } = await supabase
      .from('ai_image_cache')
      .upsert({
        prompt,
        model,
        image_url: imageUrl,
        settings,
        hash
      }, {
        onConflict: 'hash,model'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getPopularImages(limit: number = 10): Promise<AIImageCache[]> {
    const { data, error } = await supabase
      .from('ai_image_cache')
      .select('*')
      .order('access_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // PROJECT OPERATIONS
  static async createProject(project: Partial<AIProject>): Promise<AIProject> {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getProjects(userId: string): Promise<AIProject[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateProject(id: string, updates: Partial<AIProject>): Promise<AIProject> {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // DOCUMENT OPERATIONS
  static async createDocument(document: Partial<AIDocument>): Promise<AIDocument> {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        ...document,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getProjectDocuments(projectId: string): Promise<AIDocument[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // AI SESSION OPERATIONS
  static async createSession(session: Partial<AISession>): Promise<AISession> {
    const { data, error } = await supabase
      .from('ai_sessions')
      .insert({
        ...session,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserSessions(userId: string, limit: number = 20): Promise<AISession[]> {
    const { data, error } = await supabase
      .from('ai_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // MESSAGE OPERATIONS
  static async addMessage(message: Partial<AIMessage>): Promise<AIMessage> {
    const { data, error } = await supabase
      .from('ai_messages')
      .insert({
        ...message,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getSessionMessages(sessionId: string): Promise<AIMessage[]> {
    const { data, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // USAGE TRACKING
  static async trackUsage(
    userId: string,
    feature: 'image_generation' | 'text_generation' | 'embedding' | 'vector_search',
    amount: number,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const { error } = await supabase
      .from('usage_records')
      .insert({
        user_id: userId,
        feature,
        amount,
        metadata,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  static async getUserUsage(userId: string, days: number = 30): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('usage_records')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // REAL-TIME SUBSCRIPTIONS
  static subscribeToSessions(
    userId: string,
    callback: (payload: any) => void
  ): () => void {
    const subscription = supabase
      .channel('ai_sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_sessions',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }

  static subscribeToMessages(
    sessionId: string,
    callback: (payload: any) => void
  ): () => void {
    const subscription = supabase
      .channel('ai_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_messages',
          filter: `session_id=eq.${sessionId}`
        },
        callback
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }

  // UTILITY FUNCTIONS
  private static generatePromptHash(prompt: string, model: string): string {
    // Simple hash generation - in production use crypto
    return btoa(prompt + model).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  // VECTOR SEARCH (when embeddings are available)
  static async searchSimilarDocuments(
    queryEmbedding: number[],
    limit: number = 5
  ): Promise<any[]> {
    const { data, error } = await supabase
      .rpc('get_similar_documents', {
        query_embedding: queryEmbedding,
        limit_count: limit
      });

    if (error) throw error;
    return data || [];
  }

  // STORAGE OPERATIONS
  static async uploadAIImage(
    file: File,
    path: string
  ): Promise<{ data: any; error: any }> {
    return await supabase.storage
      .from('ai-images')
      .upload(path, file, {
        contentType: file.type,
        upsert: true
      });
  }

  static async getPublicImageUrl(path: string): Promise<string> {
    const { data } = supabase.storage
      .from('ai-images')
      .getPublicUrl(path);

    return data.publicUrl;
  }

  // USER OPERATIONS
  static async getUserProfile(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUserProfile(
    userId: string,
    updates: Record<string, any>
  ): Promise<any> {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export default SupabaseGodService;
