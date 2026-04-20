import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Users } from 'lucide-react';
import type { PropertyImage } from '@/lib/types';

interface MobileHeroSlideshowProps {
  coverImage: string | null;
  images: PropertyImage[];
  propertyName: string;
  location: string | null;
  maxGuests: number;
  amenityNames?: string[];
  backLink?: string;
  backLabel?: string;
  onImageClick?: () => void;
}

export const MobileHeroSlideshow: React.FC<MobileHeroSlideshowProps> = ({
  coverImage, images, propertyName, location, maxGuests, amenityNames = [], backLink = '/listings', backLabel = 'All Stays', onImageClick,
}) => {
  const allImages: string[] = [
    coverImage ?? '/placeholder.svg',
    ...images.map(i => i.image_url),
  ].filter(Boolean);

  const [current, setCurrent] = useState(0);
  const touchStart = useRef<number | null>(null);
  const touchDelta = useRef(0);

  useEffect(() => {
    if (allImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % allImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [allImages.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    touchDelta.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    touchDelta.current = e.touches[0].clientX - touchStart.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDelta.current) > 50) {
      if (touchDelta.current < 0) {
        setCurrent(i => (i + 1) % allImages.length);
      } else {
        setCurrent(i => (i - 1 + allImages.length) % allImages.length);
      }
    }
    touchStart.current = null;
    touchDelta.current = 0;
  };

  const pills = amenityNames.slice(0, 4);

  return (
    <div
      className="relative w-full h-[50vh] overflow-hidden md:hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Images with crossfade */}
      {allImages.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={`${propertyName} — ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms] ease-in-out ${onImageClick ? 'cursor-pointer' : ''}`}
          style={{ opacity: i === current ? 1 : 0 }}
          draggable={false}
          onClick={onImageClick}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

      {/* Breadcrumb */}
      <Link
        to={backLink}
        className="absolute left-5 flex items-center gap-1.5 text-white text-xs font-body z-10 bg-white/15 backdrop-blur-xl px-3 py-1.5 rounded-full"
        style={{ top: 'max(calc(3.5rem + env(safe-area-inset-top, 16px)), 72px)' }}
      >
        <ArrowLeft size={12} /> {backLabel}
      </Link>

      {/* Overlaid content */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10">
        <h1 className="font-headline text-3xl text-white font-bold leading-tight mb-2">
          {propertyName}
        </h1>
        <div className="flex items-center gap-4 text-sm text-white/80 mb-3">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin size={13} strokeWidth={1.5} /> {location}
            </span>
          )}
          {maxGuests > 0 && (
            <span className="flex items-center gap-1">
              <Users size={13} strokeWidth={1.5} /> Up to {maxGuests} Guests
            </span>
          )}
        </div>
        {pills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {pills.map(p => (
              <span
                key={p}
                className="bg-white/20 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider rounded-full px-3 py-1 font-body"
              >
                {p}
              </span>
            ))}
          </div>
        )}
        {/* Instagram-style dots */}
        {allImages.length > 1 && (
          <div className="flex items-center justify-center gap-[6px]">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-[7px] h-[7px] bg-white'
                    : 'w-[6px] h-[6px] bg-white/40'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
