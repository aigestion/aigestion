import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate WebP versions and fallbacks
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const avifSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.avif');

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  if (error) {
    return (
      <div
        className={`bg-nexus-obsidian-deep border border-nexus-cyan/20 flex items-center justify-center ${className}`}
      >
        <span className="text-nexus-silver/50 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <picture>
        {/* Try AVIF first (best compression) */}
        <source srcSet={avifSrc} type="image/avif" sizes={sizes} />
        {/* Fallback to WebP */}
        <source srcSet={webpSrc} type="image/webp" sizes={sizes} />
        {/* Original format fallback */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </picture>

      {/* Loading skeleton */}
      {!isLoaded && <div className="absolute inset-0 bg-nexus-obsidian-deep animate-pulse" />}
    </div>
  );
};

// Responsive background image component
interface ResponsiveBackgroundProps {
  src: string;
  className?: string;
  children?: React.ReactNode;
  priority?: boolean;
}

export const ResponsiveBackground = ({
  src,
  className = '',
  children,
  priority = false,
}: ResponsiveBackgroundProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const avifSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.avif');

  return (
    <div className={`relative ${className}`}>
      <picture className="absolute inset-0">
        <source srcSet={avifSrc} type="image/avif" />
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={src}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </picture>

      {/* Overlay for content */}
      <div className="relative z-10">{children}</div>

      {/* Loading skeleton */}
      {!isLoaded && <div className="absolute inset-0 bg-nexus-obsidian-deep animate-pulse" />}
    </div>
  );
};
