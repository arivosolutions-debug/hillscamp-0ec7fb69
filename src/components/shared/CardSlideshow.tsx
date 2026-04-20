import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardSlideshowProps {
  images: string[];
  alt: string;
  className?: string;
  imgClassName?: string;
  intervalMs?: number;
  showDots?: boolean;
  rounded?: string;
}

/**
 * Reusable image slideshow for cards.
 * - Crossfade transitions
 * - Autoplay every 3s, pauses on user interaction (arrow click / dot click / hover)
 * - Subtle glass arrow buttons on the sides
 * - Optional Instagram-style dot indicators
 */
export const CardSlideshow: React.FC<CardSlideshowProps> = ({
  images,
  alt,
  className = '',
  imgClassName = '',
  intervalMs = 3000,
  showDots = true,
}) => {
  const slides = images.filter(Boolean);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const t = window.setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(t);
  }, [slides.length, paused, intervalMs]);

  const pauseTemporarily = () => {
    setPaused(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), 6000);
  };

  useEffect(() => () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
  }, []);

  const go = (e: React.MouseEvent, dir: 1 | -1) => {
    e.preventDefault();
    e.stopPropagation();
    pauseTemporarily();
    setCurrent((p) => (p + dir + slides.length) % slides.length);
  };

  const goTo = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    pauseTemporarily();
    setCurrent(i);
  };

  if (slides.length === 0) return null;

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={`${alt} — ${i + 1}`}
          loading={i === 0 ? 'eager' : 'lazy'}
          draggable={false}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms] ease-in-out ${imgClassName}`}
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => go(e, -1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors"
          >
            <ChevronLeft size={16} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => go(e, 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors"
          >
            <ChevronRight size={16} strokeWidth={2.25} />
          </button>

          {showDots && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-[6px]">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => goTo(e, i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? 'w-[7px] h-[7px] bg-white' : 'w-[6px] h-[6px] bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};