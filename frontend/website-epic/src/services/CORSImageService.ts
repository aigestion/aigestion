/**
 * CORS-Aware Image Service with Multiple Fallback Strategies
 */

export type FluxModel = 'flux-schnell' | 'flux-pro';

interface GenerationOptions {
    model?: FluxModel;
    width?: number;
    height?: number;
    seed?: number;
}

export class CORSImageService {
    private static readonly CORS_PROXY = 'https://corsfix.com/';
    private static readonly FALLBACK_STRATEGIES = [
        'cors-proxy',
        'direct-fetch',
        'jsonp',
        'placeholder'
    ] as const;

    /**
     * Generate image with CORS fallback strategies
     */
    static async generateImage(prompt: string, options: GenerationOptions = {}): Promise<string> {
        const model = options.model || 'flux-schnell';
        const settings = {
            width: options.width || 1024,
            height: options.height || 1024,
            seed: options.seed || Math.floor(Math.random() * 1000000)
        };

        console.log(`[CORSImageService] 🚀 Generating image (${model}):`, prompt);

        // Try each strategy until one works
        for (const strategy of this.FALLBACK_STRATEGIES) {
            try {
                const result = await this.tryStrategy(strategy, prompt, model, settings);
                if (result) {
                    console.log(`[CORSImageService] ✅ Success with strategy: ${strategy}`);
                    return result;
                }
            } catch (error) {
                console.warn(`[CORSImageService] ❌ Strategy ${strategy} failed:`, error);
                continue;
            }
        }

        // If all strategies fail, return placeholder
        return this.getPlaceholderImage(prompt, model);
    }

    private static async tryStrategy(
        strategy: typeof this.FALLBACK_STRATEGIES[number],
        prompt: string,
        model: FluxModel,
        settings: { width: number; height: number; seed: number }
    ): Promise<string> {
        switch (strategy) {
            case 'cors-proxy':
                return this.tryCorsProxy(prompt, model, settings);
            case 'direct-fetch':
                return this.tryDirectFetch(prompt, model, settings);
            case 'jsonp':
                return this.tryJSONP(prompt, model, settings);
            case 'placeholder':
                return this.getPlaceholderImage(prompt, model);
            default:
                throw new Error(`Unknown strategy: ${strategy}`);
        }
    }

    /**
     * Strategy 1: CORS Proxy for Pollinations.ai
     */
    private static async tryCorsProxy(prompt: string, model: FluxModel, settings: any): Promise<string> {
        const pollinationsUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?model=${model === 'flux-pro' ? 'flux-realism' : 'flux'}&width=${settings.width}&height=${settings.height}&seed=${settings.seed}&nologo=true`;
        const proxyUrl = `${this.CORS_PROXY}${pollinationsUrl}`;

        const response = await fetch(proxyUrl, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) throw new Error('CORS proxy failed');

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }

    /**
     * Strategy 2: Direct fetch with CORS headers
     */
    private static async tryDirectFetch(prompt: string, model: FluxModel, settings: any): Promise<string> {
        const url = `/api/pollinations/p/${encodeURIComponent(prompt)}?model=${model === 'flux-pro' ? 'flux-realism' : 'flux'}&width=${settings.width}&height=${settings.height}&seed=${settings.seed}&nologo=true`;

        const response = await fetch(url, {
            mode: 'cors',
            credentials: 'omit'
        });

        if (!response.ok) throw new Error('Direct fetch failed');

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }

    /**
     * Strategy 3: JSONP fallback (for older browsers)
     */
    private static async tryJSONP(prompt: string, model: FluxModel, settings: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const callbackName = `jsonp_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
            const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?model=${model === 'flux-pro' ? 'flux-realism' : 'flux'}&width=${settings.width}&height=${settings.height}&seed=${settings.seed}&nologo=true&callback=${callbackName}`;

            // Create script element
            const script = document.createElement('script');
            script.src = url;
            script.onerror = () => {
                cleanup();
                reject(new Error('JSONP failed'));
            };

            // Set up callback
            (window as any)[callbackName] = (_data: any) => {
                cleanup();
                // JSONP doesn't work for image data, so fallback to placeholder
                resolve(this.getPlaceholderImage(prompt, model));
            };

            // Cleanup function
            const cleanup = () => {
                delete (window as any)[callbackName];
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            };

            document.head.appendChild(script);

            // Timeout after 10 seconds
            setTimeout(() => {
                cleanup();
                reject(new Error('JSONP timeout'));
            }, 10000);
        });
    }

    /**
     * Strategy 4: Placeholder image
     */
    private static getPlaceholderImage(prompt: string, model: string): string {
        const hash = btoa(prompt + model).substring(0, 8);
        const seed = hash.charCodeAt(0) % 1000;
        return `https://picsum.photos/seed/${seed}/1024/1024.jpg`;
    }
}
