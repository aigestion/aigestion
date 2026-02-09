import { Eye, Maximize2, Play, RotateCw, Star, Volume2, Zap } from 'lucide-react';
import React from 'react';

// Mock model-viewer for production build
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface SpatialPresentationProps {
  modelUrl: string;
  posterUrl?: string;
  title: string;
}

const SpatialPresentation: React.FC<SpatialPresentationProps> = ({
  modelUrl,
  posterUrl,
  title,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(0.7);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [autoRotate, setAutoRotate] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleRotate = () => {
    setAutoRotate(!autoRotate);
  };

  return (
    <div className="spatial-container flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900/80 via-blue-900/60 to-indigo-900/80 backdrop-blur-2xl rounded-3xl border border-purple-500/30 shadow-2xl relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-2 left-2 w-4 h-4 bg-purple-400 rounded-full animate-ping opacity-50" />
        <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-50 animation-delay-1000" />
        <div className="absolute bottom-6 left-8 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-50 animation-delay-2000" />
        <div className="absolute bottom-4 right-6 w-5 h-5 bg-pink-400 rounded-full animate-ping opacity-50 animation-delay-3000" />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-6 text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center border-2 border-white/20 shadow-lg shadow-purple-500/30">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white">{title}</h3>
        </div>
        <div className="text-sm text-purple-300 font-medium">
          🎮 Vista Interactiva 3D - ¡Mueve tu mouse para explorar!
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="relative z-10 w-full aspect-square max-w-2xl">
        <div className="model-viewer-wrapper w-full aspect-square relative rounded-2xl overflow-hidden bg-black/60 border-2 border-purple-500/30">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl">
              <div className="text-center">
                <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-purple-300 font-medium">🚀 Cargando mundo virtual...</p>
                <p className="text-purple-400 text-sm">Prepara tu aventura 3D</p>
              </div>
            </div>
          )}

          {/* @ts-expect-error - model-viewer is a custom element */}
          <model-viewer
            src={modelUrl}
            poster={posterUrl}
            alt={title}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate={autoRotate}
            rotation-per-second="30deg"
            shadow-intensity="1"
            environment-image="neutral"
            skybox-image="https://modelviewer.dev/shared-assets/environments/spruit_sunrise_1k.jpg"
            exposure="0.8"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.5s ease-in-out',
            }}
          >
            {/* AR Button */}
            <button
              slot="ar-button"
              className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform border border-white/20"
            >
              <Zap className="w-4 h-4" />
              <span>🥽 VER EN REALIDAD</span>
            </button>

            {/* Custom Controls */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              {/* Play/Pause Button */}
              <button
                onClick={handlePlay}
                className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors border border-white/20 hover:scale-110"
              >
                {isPlaying ? (
                  <div className="w-4 h-4 bg-white rounded-sm" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-2 border border-white/20">
                <Volume2 className="w-4 h-4 text-white" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                />
              </div>

              {/* Rotate Toggle */}
              <button
                onClick={handleRotate}
                className={`w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors border border-white/20 hover:scale-110 ${
                  autoRotate ? 'text-green-400' : 'text-gray-400'
                }`}
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={handleFullscreen}
                className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors border border-white/20 hover:scale-110"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <div className="flex items-center gap-2 text-xs text-white">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>🎮 Calidad: ULTRA HD</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white mt-1">
                <Eye className="w-3 h-3 text-blue-400" />
                <span>👥 {Math.floor(Math.random() * 50) + 100} explorando</span>
              </div>
            </div>
            {/* @ts-expect-error - model-viewer is a custom element */}
          </model-viewer>
        </div>
      </div>

      {/* Info Panel */}
      <div className="relative z-10 mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
          <div className="text-2xl mb-1">🎮</div>
          <h4 className="text-white font-bold text-sm">Controles Intuitivos</h4>
          <p className="text-gray-300 text-xs mt-1">Usa tu mouse para explorar</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
          <div className="text-2xl mb-1">🥽</div>
          <h4 className="text-white font-bold text-sm">Realidad Virtual</h4>
          <p className="text-gray-300 text-xs mt-1">Disponible en VR</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
          <div className="text-2xl mb-1">✨</div>
          <h4 className="text-white font-bold text-sm">Calidad 4K</h4>
          <p className="text-gray-300 text-xs mt-1">Gráficos ultra realistas</p>
        </div>
      </div>

      {/* Tips */}
      <div className="relative z-10 mt-4 p-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-xl border border-purple-500/30">
        <h4 className="text-white font-bold text-sm mb-2">💡 Tips para explorar:</h4>
        <ul className="text-gray-300 text-xs space-y-1">
          <li>
            🖱️ <strong>Click izquierdo y arrastra:</strong> Rota el modelo
          </li>
          <li>
            🔍 <strong>Scroll:</strong> Acerca o aleja
          </li>
          <li>
            👆 <strong>Click derecho:</strong> Menú de opciones
          </li>
          <li>
            📱 <strong>En móvil:</strong> Usa gestos táctiles
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SpatialPresentation;
