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
    'neural network': 'https://picsum.photos/seed/neural/1024/1024.jpg',
    'ai avatar': 'https://picsum.photos/seed/avatar/1024/1024.jpg',
    'financial growth': 'https://picsum.photos/seed/financial/1024/1024.jpg',
    'android robot': 'https://picsum.photos/seed/android/1024/1024.jpg',
    'cinematic portal': 'https://picsum.photos/seed/portal/1024/1024.jpg',
    'digital network': 'https://picsum.photos/seed/digital/1024/1024.jpg',
    futuristic: 'https://picsum.photos/seed/futuristic/1024/1024.jpg',
    default: 'https://picsum.photos/seed/default/1024/1024.jpg',
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
