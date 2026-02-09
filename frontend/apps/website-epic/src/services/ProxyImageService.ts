/**
 * Backend Proxy Service for Pollinations.ai
 * Uses our own proxy endpoint to bypass CORS restrictions
 */

export type FluxModel = 'flux-schnell' | 'flux-pro';

interface GenerationOptions {
    model?: FluxModel;
    width?: number;
    height?: number;
    seed?: number;
}

export class ProxyImageService {
    private static PROXY_ENDPOINT = '/api/proxy/image';

    /**
     * Generate image using our own proxy endpoint
     */
    static async generateImage(prompt: string, options: GenerationOptions = {}): Promise<string> {
        const model = options.model || 'flux-schnell';
        const settings = {
            width: options.width || 1024,
            height: options.height || 1024,
            seed: options.seed || Math.floor(Math.random() * 1000000)
        };

        try {
            console.log(`[ProxyImageService] 🚀 Generating via proxy (${model}):`, prompt);
            
            // Use our proxy endpoint
            const proxyUrl = `${this.PROXY_ENDPOINT}?${new URLSearchParams({
                prompt,
                model: model === 'flux-pro' ? 'flux-realism' : 'flux',
                width: settings.width.toString(),
                height: settings.height.toString(),
                seed: settings.seed.toString(),
                nologo: 'true'
            })}`;

            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`Proxy Error: ${response.statusText}`);
            }

            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('[ProxyImageService] ❌ Error:', error);
            return this.getPlaceholderImage(prompt, model);
        }
    }

    private static getPlaceholderImage(prompt: string, model: string): string {
        const hash = btoa(prompt + model).substring(0, 8);
        const seed = hash.charCodeAt(0) % 1000;
        return `https://picsum.photos/seed/${seed}/1024/1024.jpg`;
    }
}
