import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  priority?: boolean;
  lazy?: boolean;
  webpSrc?: string;
  avifSrc?: string;
  fallbackSrc?: string;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty' | 'color';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

/**
 * Componente de imagen optimizada con WebP/AVIF support
 * Implementa lazy loading, placeholders y fallbacks automáticos
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  lazy = true,
  webpSrc,
  avifSrc,
  fallbackSrc,
  sizes,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  style,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
  });

  // Combine refs for intersection observer and image element
  const setRefs = (element: HTMLImageElement | null) => {
    imgRef.current = element;
    (intersectionRef as React.RefObject<HTMLImageElement>).current = element;
  };

  // Determine which format to use
  const getOptimalFormat = () => {
    // Check browser support for modern formats
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx && avifSrc) {
      // Test AVIF support
      canvas.width = 1;
      canvas.height = 1;
      const avifData = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      
      try {
        const img = new Image();
        img.src = avifData;
        return img.decode ? 'avif' : 'webp';
      } catch {
        return 'webp';
      }
    }
    
    return webpSrc ? 'webp' : 'fallback';
  };

  const optimalFormat = getOptimalFormat();

  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc.includes('?')) {
      return `${baseSrc}?w=320 320w, ${baseSrc}?w=640 640w, ${baseSrc}?w=768 768w, ${baseSrc}?w=1024 1024w, ${baseSrc}?w=1280 1280w, ${baseSrc}?w=1536 1536w`;
    }
    return baseSrc;
  };

  // Get the appropriate source based on format support
  const getImageSource = () => {
    if (optimalFormat === 'avif' && avifSrc) return avifSrc;
    if (optimalFormat === 'webp' && webpSrc) return webpSrc;
    if (fallbackSrc) return fallbackSrc;
    return src;
  };

  const imageSource = getImageSource();

  // Load image when it should be visible
  useEffect(() => {
    if (!lazy || priority || isIntersecting) {
      setCurrentSrc(imageSource);
    }
  }, [lazy, priority, isIntersecting, imageSource]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
    
    // Try fallback if available
    if (currentSrc !== src && currentSrc !== fallbackSrc) {
      setCurrentSrc(src);
    }
  };

  // Generate placeholder style
  const getPlaceholderStyle = (): React.CSSProperties => {
    if (placeholder === 'blur' && blurDataURL) {
      return {
        backgroundImage: `url(${blurDataURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(20px)',
        transform: 'scale(1.1)',
      };
    }
    
    if (placeholder === 'color') {
      return {
        backgroundColor: '#f3f4f6',
      };
    }
    
    return {};
  };

  // Render placeholder
  const renderPlaceholder = () => {
    if (isLoaded) return null;
    
    if (placeholder === 'blur' || placeholder === 'color') {
      return (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            ...getPlaceholderStyle(),
            opacity: isLoaded ? 0 : 1,
          }}
        />
      );
    }
    
    return (
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  };

  // Render error state
  if (isError && !fallbackSrc) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        style={{ width, height, ...style }}
      >
        <div className="text-center p-4">
          <svg
            className="w-8 h-8 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height, ...style }}>
      {/* Placeholder */}
      {renderPlaceholder()}
      
      {/* Main image */}
      <motion.img
        ref={setRefs}
        src={currentSrc}
        alt={alt}
        srcSet={sizes ? generateSrcSet(currentSrc) : undefined}
        sizes={sizes}
        loading={lazy && !priority ? 'lazy' : 'eager'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          filter: isLoaded ? 'none' : 'blur(5px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Loading indicator */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-nexus-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

/**
 * Componente para Picture element con múltiples formatos
 */
export const PictureImage: React.FC<OptimizedImageProps> = (props) => {
  const { src, webpSrc, avifSrc, fallbackSrc, alt, className, width, height, style } = props;
  
  return (
    <picture className={className} style={{ width, height, ...style }}>
      {avifSrc && (
        <source
          srcSet={avifSrc}
          type="image/avif"
        />
      )}
      {webpSrc && (
        <source
          srcSet={webpSrc}
          type="image/webp"
        />
      )}
      <OptimizedImage
        {...props}
        src={fallbackSrc || src}
        webpSrc={undefined}
        avifSrc={undefined}
        fallbackSrc={undefined}
      />
    </picture>
  );
};

/**
 * Hook para generar URLs optimizadas de imágenes
 */
export function useOptimizedImage() {
  const generateWebPUrl = (originalUrl: string, quality: number = 75) => {
    if (originalUrl.includes('?')) {
      return `${originalUrl}&format=webp&quality=${quality}`;
    }
    return `${originalUrl}?format=webp&quality=${quality}`;
  };

  const generateAVIFUrl = (originalUrl: string, quality: number = 75) => {
    if (originalUrl.includes('?')) {
      return `${originalUrl}&format=avif&quality=${quality}`;
    }
    return `${originalUrl}?format=avif&quality=${quality}`;
  };

  const generateBlurDataURL = (originalUrl: string, width: number = 40, height: number = 40) => {
    if (originalUrl.includes('?')) {
      return `${originalUrl}&w=${width}&h=${height}&blur=20&quality=10`;
    }
    return `${originalUrl}?w=${width}&h=${height}&blur=20&quality=10`;
  };

  const generateResponsiveSrcSet = (originalUrl: string, breakpoints: number[] = [320, 640, 768, 1024, 1280, 1536]) => {
    return breakpoints
      .map(bp => `${originalUrl}?w=${bp} ${bp}w`)
      .join(', ');
  };

  return {
    generateWebPUrl,
    generateAVIFUrl,
    generateBlurDataURL,
    generateResponsiveSrcSet,
  };
}
