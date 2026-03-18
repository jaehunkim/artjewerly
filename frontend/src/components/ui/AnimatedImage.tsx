'use client';

import { useState } from 'react';

interface AnimatedImageProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  blur?: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
}

export function AnimatedImage({
  src,
  srcSet,
  sizes,
  alt,
  blur,
  className = '',
  aspectRatio = '4/5',
  priority = false,
}: AnimatedImageProps) {
  const [loaded, setLoaded] = useState(false);

  // Callback ref: handle already-cached images that fire load before React mounts
  const imgRef = (node: HTMLImageElement | null) => {
    if (node?.complete) {
      setLoaded(true);
    }
  };

  return (
    <div
      className="relative overflow-hidden w-full"
      style={{ aspectRatio }}
    >
      {/* Blur placeholder -- shown until main image is ready */}
      {blur && (
        <img
          src={blur}
          aria-hidden="true"
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl transition-opacity duration-500"
          style={{ opacity: loaded ? 0 : 1 }}
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${className}`}
        style={{
          opacity: loaded ? 1 : 0,
          filter: 'saturate(0.7) brightness(1.05) contrast(0.9)',
        }}
      />
    </div>
  );
}
