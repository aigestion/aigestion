import { CORSImageService } from './CORSImageService';
import { LocalImageService } from './LocalImageService';
import { supabase } from './supabase';

export type FluxModel = 'flux-schnell' | 'flux-pro';

interface GenerationOptions {
  model?: FluxModel;
  width?: number;
  height?: number;
  steps?: number;
}

export class ImageService {
  // Pollinations.ai doesn't need an API key for base usage
  private static POLLINATIONS_BASE_URL = '/api/pollinations/p'; // Use proxy for CORS fix

  /**
   * 🌌 GOD MODE: Generates an image using Flux AI with maximum optimization
   * Now with local-first strategy to avoid CORS issues completely
   */
  static async generateImage(prompt: string, options: GenerationOptions = {}): Promise<string> {
    const model = options.model || 'flux-schnell';
    const settings = {
      width: options.width || 1024,
      height: options.height || 1024,
      seed: Math.floor(Math.random() * 1000000),
    };

    try {
      // 0. Safety check for Supabase
      if (!supabase) {
        // Use local-first strategy when Supabase is not configured
        return this.useLocalFirstStrategy(prompt, options);
      }

      // 1. Try LocalImageService first (no CORS issues)
      try {
        const localImage = await LocalImageService.generateImage(prompt, options);
        console.log(`[ImageService] 🎯 Local image success: ${prompt.substring(0, 50)}...`);

        // Try to upload to storage if local image succeeded
        if (localImage && !localImage.includes('picsum.photos')) {
          const storagePath = await this.uploadToStorage(localImage, prompt, model);
          return this.getPublicUrl(storagePath);
        }
        return localImage;
      } catch (localError) {
        console.warn(`[ImageService] ⚠️ Local service failed, trying CORS service:`, localError);
      }

      // 2. Try CORS-aware service as fallback
      try {
        const corsImageUrl = await CORSImageService.generateImage(prompt, options);
        console.log(`[ImageService] 🎯 CORS Service success: ${prompt.substring(0, 50)}...`);

        // Try to upload to storage if CORS service succeeded
        if (corsImageUrl && !corsImageUrl.includes('picsum.photos')) {
          const storagePath = await this.uploadToStorage(corsImageUrl, prompt, model);
          return this.getPublicUrl(storagePath);
        }
        return corsImageUrl;
      } catch (corsError) {
        console.warn(`[ImageService] ⚠️ CORS Service failed, trying direct method:`, corsError);
      }

      // 3. Fallback to direct method (original implementation)
      console.log(`[ImageService] 🚀 Generating new image (${model}):`, prompt);
      const imageUrl = this.constructPollinationsUrl(prompt, model, settings);

      // 4. Persist to Storage with retry logic
      const storagePath = await this.uploadToStorage(imageUrl, prompt, model);

      return this.getPublicUrl(storagePath);
    } catch (error) {
      // Final fallback to local-first strategy
      console.warn(`[ImageService] 🆘 All methods failed, using local fallback:`, error);
      return this.useLocalFirstStrategy(prompt, options);
    }
  }

  private static async useLocalFirstStrategy(
    prompt: string,
    options: GenerationOptions
  ): Promise<string> {
    try {
      return await LocalImageService.generateImage(prompt, options);
    } catch (error) {
      console.warn('[ImageService] Local fallback failed, using placeholder:', error);
      return this.getPlaceholderImage(prompt, options.model || 'flux-schnell');
    }
  }

  private static constructPollinationsUrl(
    prompt: string,
    model: FluxModel,
    settings: { width: number; height: number; seed: number }
  ): string {
    // Map our internal models to Pollinations models
    // 'flux-pro' -> 'flux-realism' (often available as a variant)
    // 'flux-schnell' -> 'flux' (standard)
    const pollinationsModel = model === 'flux-pro' ? 'flux-realism' : 'flux';

    const encodedPrompt = encodeURIComponent(prompt);
    const url = new URL(`${this.POLLINATIONS_BASE_URL}/${encodedPrompt}`);
    url.searchParams.append('model', pollinationsModel);
    url.searchParams.append('width', settings.width.toString());
    url.searchParams.append('height', settings.height.toString());
    url.searchParams.append('seed', settings.seed.toString());
    url.searchParams.append('nologo', 'true'); // Try to hide logo if possible

    return url.toString();
  }

  private static async uploadToStorage(
    urlOrBlob: string,
    prompt: string,
    model: string
  ): Promise<string> {
    try {
      let blob: Blob;

      // Handle both URLs and blob URLs
      if (urlOrBlob.startsWith('blob:')) {
        // It's already a blob URL, fetch it
        const response = await fetch(urlOrBlob);
        if (!response.ok) {
          throw new Error(`Blob fetch Error: ${response.statusText}`);
        }
        blob = await response.blob();
      } else {
        // It's a regular URL, fetch it (triggers generation on Pollinations side)
        const response = await fetch(urlOrBlob);
        if (!response.ok) {
          throw new Error(`Pollinations API Error: ${response.statusText}`);
        }
        blob = await response.blob();
      }

      // Create a safe filename
      const hash = btoa(prompt).substring(0, 16).replace(/[/+=]/g, '');
      const fileName = `${model}/${hash}_${Date.now()}.webp`;

      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase.storage.from('ai-images').upload(fileName, blob, {
        contentType: 'image/webp',
        upsert: true,
      });

      if (error) {
        throw error;
      }
      return data.path;
    } catch (error) {
      // Silent error handling - don't log to console in production
      throw error;
    }
  }

  private static getPlaceholderImage(prompt: string, model: string): string {
    // Generate deterministic placeholder based on prompt and model
    const hash = btoa(prompt + model).substring(0, 8);
    const seed = hash.charCodeAt(0) % 1000;

    // Use a reliable placeholder service with seed
    return `https://picsum.photos/seed/${seed}/1024/1024.jpg`;
  }

  private static getPublicUrl(path: string): string {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    const { data } = supabase.storage.from('ai-images').getPublicUrl(path);
    return data.publicUrl;
  }
}
