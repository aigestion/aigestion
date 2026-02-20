import React, { useState } from 'react';
import { ImageService } from '../services/ImageService';
import type { FluxModel } from '../services/ImageService';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<FluxModel>('flux-schnell');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const url = await ImageService.generateImage(prompt, { model });
      setResultUrl(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
      <h2 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
        Flux AI Generation
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            placeholder="A futuristic android companion in a neon city..."
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-white/60 mb-2">Model</label>
            <select
              value={model}
              onChange={e => setModel(e.target.value as FluxModel)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="flux-schnell">Flux Schnell (Fast/Free)</option>
              <option value="flux-pro">Flux Pro (Highest Quality)</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="flex-[0.5] mt-auto h-12 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg shadow-purple-500/20 transition-all active:scale-95"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {resultUrl && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <label className="block text-sm font-medium text-white/60 mb-2">Result</label>
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10">
              <img src={resultUrl} alt="AI Generated" className="w-full h-auto" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a
                  href={resultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white font-medium hover:bg-white/20 transition-colors"
                >
                  View Full Size
                </a>
              </div>
            </div>
            <p className="mt-2 text-xs text-center text-white/30">
              Saved to Supabase Cache to save credits ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
