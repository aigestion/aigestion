import React from 'react';
import '@google/model-viewer';

interface SpatialPresentationProps {
  modelUrl: string;
  posterUrl?: string;
  title: string;
}

const SpatialPresentation: React.FC<SpatialPresentationProps> = ({ modelUrl, posterUrl, title }) => {
  return (
    <div className="spatial-container flex flex-col items-center justify-center p-4 bg-nexus-obsidian/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
      <h3 className="text-2xl font-orbitron text-glow mb-4">{title}</h3>

      <div className="model-viewer-wrapper w-full aspect-square relative rounded-2xl overflow-hidden bg-black/40">
        {/* @ts-expect-error - model-viewer is a custom element */}
        <model-viewer
          src={modelUrl}
          poster={posterUrl}
          alt={title}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          shadow-intensity="1"
          style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        >
          <button slot="ar-button" className="absolute bottom-4 right-4 bg-nexus-violet px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
            <span>🚀 VER EN AR</span>
          </button>
          {/* @ts-expect-error - model-viewer is a custom element */}
        </model-viewer>
      </div>

      <div className="viture-info mt-6 p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-nexus-silver text-center">
        <p>Optimizado para <b>Viture One XR</b></p>
        <p className="opacity-60 text-xs mt-1">HFOV 43° | Proyección Espacial Activa</p>
      </div>
    </div>
  );
};

export default SpatialPresentation;
