import React, { useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface RoomGalleryGridProps {
  images: string[];
  roomName: string;
  onClose: () => void;
  onSelect: (index: number) => void;
}

// Same mosaic pattern as MobileGalleryButton for visual consistency
const TILE_PATTERNS = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
];

export const RoomGalleryGrid: React.FC<RoomGalleryGridProps> = ({
  images, roomName, onClose, onSelect,
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-hc-bg flex flex-col" style={{ height: '100dvh' }}>
      <div
        className="flex items-center justify-between px-5 pb-3 bg-hc-bg/90 backdrop-blur-md sticky top-0 z-10"
        style={{ paddingTop: 'max(calc(3.5rem + env(safe-area-inset-top, 16px)), 72px)' }}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-hc-primary font-body text-sm"
          aria-label="Close gallery"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-hc-text-light font-body text-sm truncate max-w-[40vw]">
            {roomName}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-hc-primary/10 flex items-center justify-center"
            aria-label="Close gallery"
          >
            <X size={16} className="text-hc-primary" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-8">
        <div className="grid grid-cols-3 gap-1.5 auto-rows-[120px]">
          {images.map((src, i) => {
            const pattern = TILE_PATTERNS[i % TILE_PATTERNS.length];
            return (
              <button
                key={i}
                type="button"
                className={`${pattern} relative overflow-hidden rounded-lg cursor-pointer group`}
                onClick={() => onSelect(i)}
              >
                <img
                  src={src}
                  alt={`${roomName} — ${i + 1}`}
                  className="w-full h-full object-cover group-active:scale-95 transition-transform duration-200"
                  draggable={false}
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
