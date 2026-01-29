/**
 * CORS Proxy Service for Pollinations.ai
 * Solves CORS issues by proxying requests through our backend
 */

export class ImageProxy {
    private static PROXY_URL = '/api/proxy/image';

    /**
     * Generate image using proxy to avoid CORS issues
     */
    static async generateImage(prompt: string, options: {
        model?: 'flux-schnell' | 'flux-pro';
        width?: number;
        height?: number;
        seed?: number;
    } = {}): Promise<string> {
        const model = options.model || 'flux-schnell';
        const settings = {
            width: options.width || 1024,
            height: options.height || 1024,
            seed: options.seed || Math.floor(Math.random() * 1000000)
        };

        try {
            console.log(`[ImageProxy] 🚀 Generating via proxy (${model}):`, prompt);
            
            // Use proxy endpoint
            const proxyUrl = `${this.PROXY_URL}?${new URLSearchParams({
                prompt,
                model: model === 'flux-pro' ? 'flux-realism' : 'flux',
                width: settings.width.toString(),
                height: settings.height.toString(),
                seed: settings.seed.toString(),
                nologo: 'true'
            })}`;

            const response = await fetch(proxyUrl);
            if (!response.ok) {
                throw new Error(`Proxy Error: ${response.statusText}`);
            }

            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('[ImageProxy] ❌ Error:', error);
            return this.getPlaceholderImage(prompt, model);
        }
    }

    private static getPlaceholderImage(prompt: string, model: string): string {
        const hash = btoa(prompt + model).substring(0, 8);
        const seed = hash.charCodeAt(0) % 1000;
        return `https://picsum.photos/seed/${seed}/1024/1024.jpg`;
    }
}
