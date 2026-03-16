'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle already-cached images that fire load before React mounts
  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <div
      className="relative overflow-hidden w-full"
      style={{ aspectRatio }}
    >
      {/* Blur placeholder — shown until main image is ready */}
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
      <motion.img
        ref={imgRef}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
      />
    </div>
  );
}
