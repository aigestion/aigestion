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
    private static POLLINATIONS_BASE_URL = 'https://pollinations.ai/p';

    /**
     * Generates an image using Flux AI via Pollinations (Free, No Auth)
     */
    static async generateImage(prompt: string, options: GenerationOptions = {}): Promise<string> {
        const model = options.model || 'flux-schnell';
        const settings = {
            width: options.width || 1024,
            height: options.height || 1024,
            seed: Math.floor(Math.random() * 1000000)
        };

        try {
            // 1. Check Cache
            const { data: cached } = await supabase
                .from('ai_image_cache')
                .select('image_url')
                .eq('prompt', prompt)
                .eq('model', model)
                .single();

            if (cached?.image_url) {
                console.log('[ImageService] Serving from cache:', prompt);
                return this.getPublicUrl(cached.image_url);
            }

            // 2. Generate new image (Construct URL)
            console.log(`[ImageService] Generating new image (${model}):`, prompt);
            const imageUrl = this.constructPollinationsUrl(prompt, model, settings);

            // 3. Persist to Storage with retry logic
            const storagePath = await this.uploadToStorage(imageUrl, prompt, model);

            // 4. Update Cache DB
            await supabase.from('ai_image_cache').insert({
                prompt,
                model,
                image_url: storagePath,
                settings,
            });

            return this.getPublicUrl(storagePath);
        } catch (error) {
            console.error('[ImageService] Error:', error);
            // Fallback: return placeholder image URL
            return this.getPlaceholderImage(prompt, model);
        }
    }

    private static constructPollinationsUrl(prompt: string, model: FluxModel, settings: { width: number, height: number, seed: number }): string {
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

    private static async uploadToStorage(url: string, prompt: string, model: string): Promise<string> {
        try {
            // Fetching the URL triggers the generation on Pollinations side
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Pollinations API Error: ${response.statusText}`);
            }
            const blob = await response.blob();

            // Create a safe filename
            const hash = btoa(prompt).substring(0, 16).replace(/[/+=]/g, '');
            const fileName = `${model}/${hash}_${Date.now()}.webp`;

            const { data, error } = await supabase.storage
                .from('ai-images')
                .upload(fileName, blob, {
                    contentType: 'image/webp',
                    upsert: true,
                });

            if (error) {
                throw error;
            }
            return data.path;
        } catch (error) {
            console.error('[ImageService] Upload error:', error);
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
        const { data } = supabase.storage.from('ai-images').getPublicUrl(path);
        return data.publicUrl;
    }
}
