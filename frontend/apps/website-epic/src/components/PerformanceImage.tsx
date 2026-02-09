import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  placeholder?: string;
}

export const PerformanceImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  priority = false,
  placeholder
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder || '');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start loading the actual image
            const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            
            // Try WebP first, fallback to original
            const webpImg = new Image();
            webpImg.onload = () => {
              setCurrentSrc(webpSrc);
              setIsLoaded(true);
            };
            webpImg.onerror = () => {
              // Fallback to original format
              const originalImg = new Image();
              originalImg.onload = () => {
                setCurrentSrc(src);
                setIsLoaded(true);
              };
              originalImg.onerror = () => {
                setIsError(true);
              };
              originalImg.src = src;
            };
            webpImg.src = webpSrc;
            
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    if (loading === 'eager' || priority) {
      observer.observe(img);
    } else {
      observer.observe(img);
    }

    return () => observer.disconnect();
  }, [src, loading, priority]);

  const handleError = () => {
    setIsError(true);
  };

  if (isError) {
    return (
      <div 
        className={clsx(
          'bg-gray-200 dark:bg-gray-800 flex items-center justify-center',
          className
        )}
        style={{ width, height }}
      >
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          Image not available
        </span>
      </div>
    );
  }

  return (
    <div className={clsx('relative overflow-hidden', className)}>
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={clsx(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onError={handleError}
        decoding="async"
        fetchpriority={priority ? 'high' : 'auto'}
      />
    </div>
  );
};

export default PerformanceImage;
