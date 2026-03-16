'use client';

import { useState } from 'react';
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

  return (
    <div
      className="relative overflow-hidden w-full"
      style={{ aspectRatio }}
    >
      {/* Blur placeholder */}
      {blur && (
        <img
          src={blur}
          aria-hidden="true"
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl"
          style={{ opacity: loaded ? 0 : 1, transition: 'opacity 0.4s ease' }}
        />
      )}

      {/* Main image */}
      <motion.img
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
