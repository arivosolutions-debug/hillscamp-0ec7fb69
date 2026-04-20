import React, { useState, useEffect, useCallback } from 'react';
import { LayoutGrid, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import type { PropertyImage } from '@/lib/types';

interface MobileGalleryButtonProps {
  coverImage: string | null;
  images: PropertyImage[];
  propertyName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Tile size pattern that repeats for varied mosaic look
const TILE_PATTERNS = [
  'col-span-2 row-span-2', // large
  'col-span-1 row-span-1', // small
  'col-span-1 row-span-1', // small
  'col-span-1 row-span-2', // tall
  'col-span-1 row-span-1', // small
  'col-span-2 row-span-1', // wide
  'col-span-1 row-span-1', // small
  'col-span-1 row-span-1', // small
  'col-span-1 row-span-2', // tall
];

export const MobileGalleryButton: React.FC<MobileGalleryButtonProps> = ({
  coverImage, images, propertyName, open: openProp, onOpenChange,
}) => {
  const allImages: string[] = [
    coverImage ?? '/placeholder.svg',
    ...images.map(i => i.image_url),
  ].filter(Boolean);

  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = (v: boolean) => {
    if (openProp === undefined) setOpenState(v);
    onOpenChange?.(v);
  };
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);

  const prev = useCallback(() =>
    setFullscreenIndex(i => (i === null ? 0 : (i - 1 + allImages.length) % allImages.length)),
    [allImages.length]
  );
  const next = useCallback(() =>
    setFullscreenIndex(i => (i === null ? 0 : (i + 1) % allImages.length)),
    [allImages.length]
  );

  useEffect(() => {
    if (fullscreenIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setFullscreenIndex(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fullscreenIndex, prev, next]);

  // Lock body scroll when gallery is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Gallery icon button */}
      <div className="md:hidden flex justify-end px-5 relative z-10 -mt-5">
        <button
          onClick={() => { setOpen(true); setFullscreenIndex(null); }}
          className="w-10 h-10 rounded-full bg-hc-primary flex items-center justify-center shadow-lg"
          aria-label="View all photos"
        >
          <LayoutGrid size={18} className="text-white" />
        </button>
      </div>

      {/* ── Grid Gallery View ───────────────────────────────── */}
      {open && fullscreenIndex === null && (
        <div className="fixed inset-0 z-[200] bg-hc-bg flex flex-col" style={{ height: '100dvh' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3 bg-hc-bg/90 backdrop-blur-md sticky top-0 z-10" style={{ paddingTop: 'max(calc(3.5rem + env(safe-area-inset-top, 16px)), 72px)' }}>
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-hc-primary font-body text-sm"
              aria-label="Close gallery"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-hc-text-light font-body text-sm">
                {allImages.length} photos
              </span>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-hc-primary/10 flex items-center justify-center"
                aria-label="Close gallery"
              >
                <X size={16} className="text-hc-primary" />
              </button>
            </div>
          </div>

          {/* Mosaic Grid */}
          <div className="flex-1 overflow-y-auto px-2 pb-8">
            <div className="grid grid-cols-3 gap-1.5 auto-rows-[120px]">
              {allImages.map((src, i) => {
                const pattern = TILE_PATTERNS[i % TILE_PATTERNS.length];
                return (
                  <div
                    key={i}
                    className={`${pattern} relative overflow-hidden rounded-lg cursor-pointer group`}
                    onClick={() => setFullscreenIndex(i)}
                  >
                    <img
                      src={src}
                      alt={`${propertyName} — ${i + 1}`}
                      className="w-full h-full object-cover group-active:scale-95 transition-transform duration-200"
                      draggable={false}
                      loading="lazy"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Fullscreen Single Photo View ────────────────────── */}
      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 z-[210] bg-black/20 backdrop-blur-md flex flex-col"
          style={{ height: '100dvh' }}
          onClick={() => setFullscreenIndex(null)}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null || touchStartY.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            const dy = e.changedTouches[0].clientY - touchStartY.current;
            touchStartX.current = null;
            touchStartY.current = null;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
              if (dx < 0) next(); else prev();
            }
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 pb-3" style={{ paddingTop: 'max(calc(1.25rem + env(safe-area-inset-top, 20px)), 56px)' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setFullscreenIndex(null); }}
              className="flex items-center gap-2 text-white/80 font-body text-sm"
              aria-label="Back to grid"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
              <span>All photos</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setFullscreenIndex(null); setOpen(false); }}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
              aria-label="Close gallery"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center px-4" style={{ flex: 1, minHeight: 0 }}>
            <img
              src={allImages[fullscreenIndex]}
              alt={`${propertyName} — ${fullscreenIndex + 1}`}
              className="max-w-full object-contain rounded-xl"
              style={{ maxHeight: 'calc(100dvh - 180px)', width: '100%', objectFit: 'contain' }}
              draggable={false}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Nav arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
                aria-label="Previous photo"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
                aria-label="Next photo"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="py-4 text-center">
            <span className="text-white/60 font-body text-sm tabular-nums">
              {fullscreenIndex + 1} / {allImages.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
};
