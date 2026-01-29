/**
 * Local Image Service with Pre-generated Assets
 * Uses local images to avoid CORS issues completely
 */

export type FluxModel = 'flux-schnell' | 'flux-pro';

interface GenerationOptions {
    model?: FluxModel;
    width?: number;
    height?: number;
    seed?: number;
}

export class LocalImageService {
    // Pre-generated local images for common prompts
    private static readonly LOCAL_IMAGES = {
        'neural network': '/images/nexus/neural_network.jpg',
        'ai avatar': '/images/nexus/ai_avatar.jpg',
        'financial growth': '/images/nexus/financial_chart.jpg',
        'android robot': '/images/nexus/android_robot.jpg',
        'cinematic portal': '/images/nexus/cinematic_portal.jpg',
        'digital network': '/images/nexus/digital_network.jpg',
        'futuristic': '/images/nexus/futuristic_abstract.jpg',
        'default': '/images/nexus/default_ai.jpg'
    };

    /**
     * Generate image using local assets
     */
    static async generateImage(prompt: string, options: GenerationOptions = {}): Promise<string> {
        const model = options.model || 'flux-schnell';
        
        console.log(`[LocalImageService] 🚀 Using local image (${model}):`, prompt);

        // Try to match prompt with local images
        const localImage = this.findLocalImage(prompt);
        
        if (localImage) {
            console.log(`[LocalImageService] ✅ Found local image: ${localImage}`);
            return localImage;
        }

        // Fallback to placeholder
        console.log(`[LocalImageService] ⚠️ Using placeholder for: ${prompt}`);
        return this.getPlaceholderImage(prompt, model);
    }

    private static findLocalImage(prompt: string): string | null {
        const lowerPrompt = prompt.toLowerCase();
        
        // Check for exact matches first
        for (const [key, path] of Object.entries(this.LOCAL_IMAGES)) {
            if (lowerPrompt.includes(key)) {
                return path;
            }
        }

        // Check for partial matches
        if (lowerPrompt.includes('neural') || lowerPrompt.includes('network')) {
            return this.LOCAL_IMAGES['neural network'];
        }
        if (lowerPrompt.includes('avatar') || lowerPrompt.includes('assistant')) {
            return this.LOCAL_IMAGES['ai avatar'];
        }
        if (lowerPrompt.includes('financial') || lowerPrompt.includes('growth')) {
            return this.LOCAL_IMAGES['financial growth'];
        }
        if (lowerPrompt.includes('robot') || lowerPrompt.includes('android')) {
            return this.LOCAL_IMAGES['android robot'];
        }
        if (lowerPrompt.includes('portal') || lowerPrompt.includes('cinematic')) {
            return this.LOCAL_IMAGES['cinematic portal'];
        }
        if (lowerPrompt.includes('digital') || lowerPrompt.includes('data')) {
            return this.LOCAL_IMAGES['digital network'];
        }
        if (lowerPrompt.includes('futuristic') || lowerPrompt.includes('abstract')) {
            return this.LOCAL_IMAGES['futuristic'];
        }

        return null;
    }

    private static getPlaceholderImage(prompt: string, model: string): string {
        const hash = btoa(prompt + model).substring(0, 8);
        const seed = hash.charCodeAt(0) % 1000;
        return `https://picsum.photos/seed/${seed}/1024/1024.jpg`;
    }
}
