import React, { useRef, useState, useEffect } from 'react';
import { BedDouble, Users } from 'lucide-react';
import type { RoomType } from '@/lib/types';
import { ImageLightbox } from '@/components/property/ImageLightbox';
import { RoomGalleryGrid } from '@/components/property/RoomGalleryGrid';

interface MobileRoomCardsProps {
  rooms: RoomType[];
  coverImage: string | null;
}

const RoomImageCarousel: React.FC<{ images: string[]; alt: string }> = ({ images, alt }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setCurrent(i => (i + 1) % images.length), 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <>
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={`${alt} — ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${i === current ? 'w-[6px] h-[6px] bg-white' : 'w-[5px] h-[5px] bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </>
  );
};

const RoomImageCarouselClickable: React.FC<{
  images: string[];
  alt: string;
  onImageClick: (index: number) => void;
}> = ({ images, alt, onImageClick }) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() =>
      setCurrent(i => (i + 1) % images.length), 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden aspect-[16/9] cursor-pointer"
      onClick={() => onImageClick(current)}
    >
      {images.map((src, i) => (
        <img key={src + i} src={src} alt={`${alt} — ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover
                     transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70
                      to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 z-10">
        <h3 className="font-headline text-xl text-white font-bold mb-1">
          {alt}
        </h3>
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-14 left-0 right-0 flex items-center
                        justify-center gap-1.5 z-10">
          {images.map((_, i) => (
            <button key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`rounded-full transition-all ${
                i === current
                  ? 'w-[6px] h-[6px] bg-white'
                  : 'w-[5px] h-[5px] bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const MobileRoomCards: React.FC<MobileRoomCardsProps> = ({ rooms, coverImage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
    roomName: string;
  } | null>(null);

  if (!rooms.length) return null;

  return (
    <div className="md:hidden mt-10">
      <h2 className="font-headline text-hc-primary text-2xl mb-4 px-5">Rooms</h2>
      <div className="pl-5">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {rooms.map(room => {
            const roomImages = (room.room_type_images ?? [])
              .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
              .map(img => img.image_url);
            const images = roomImages.length > 0 ? roomImages : [coverImage ?? '/placeholder.svg'];

            return (
              <div key={room.id} className="min-w-[85vw] snap-start" style={{ scrollSnapStop: 'always' }}>
                <RoomImageCarouselClickable
                  images={images}
                  alt={room.name}
                  onImageClick={(idx) =>
                    setLightbox({ images, index: idx, roomName: room.name })
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          index={lightbox.index}
          title={lightbox.roomName}
          onClose={() => setLightbox(null)}
          onNavigate={(i) => setLightbox(lb => lb ? { ...lb, index: i } : null)}
        />
      )}
    </div>
  );
};
