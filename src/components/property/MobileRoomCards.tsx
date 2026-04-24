import React, { useRef, useState, useEffect } from 'react';
import { BedDouble, Users } from 'lucide-react';
import { type RoomType, formatRoomPrice } from '@/lib/types';
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
      className="relative overflow-hidden aspect-[16/10] cursor-pointer"
      onClick={() => onImageClick(current)}
    >
      {images.map((src, i) => (
        <img key={src + i} src={src} alt={`${alt} — ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex items-center
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
  const [grid, setGrid] = useState<{ images: string[]; roomName: string } | null>(null);
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
            const priceLabel = formatRoomPrice(room.price_per_night);

            return (
              <div
                key={room.id}
                className="min-w-[85vw] snap-start bg-hc-bg-alt rounded-2xl overflow-hidden flex flex-col"
                style={{ scrollSnapStop: 'always' }}
              >
                <RoomImageCarouselClickable
                  images={images}
                  alt={room.name}
                  onImageClick={() => setGrid({ images, roomName: room.name })}
                />
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-headline text-hc-primary text-lg leading-snug">{room.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-hc-secondary font-bold uppercase tracking-wider font-body">
                    {room.bed_type && (
                      <span className="flex items-center gap-1">
                        <BedDouble size={11} strokeWidth={2} />
                        {room.bed_type}
                      </span>
                    )}
                    {room.bed_type && room.max_guests && <span>·</span>}
                    {room.max_guests && (
                      <span className="flex items-center gap-1">
                        <Users size={11} strokeWidth={2} />
                        {room.max_guests} Guest{room.max_guests !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  {room.description && (
                    <div className="line-clamp-3">
                      <MarkdownContent source={room.description} size="sm" />
                    </div>
                  )}
                  <div className="border-t border-hc-text-light/10 mt-1 pt-2">
                    <span className="font-bold text-hc-primary font-body text-xs uppercase tracking-wider">
                      {priceLabel ?? 'Contact for Pricing'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {grid && !lightbox && (
        <RoomGalleryGrid
          images={grid.images}
          roomName={grid.roomName}
          onClose={() => setGrid(null)}
          onSelect={(idx) => setLightbox({ images: grid.images, index: idx, roomName: grid.roomName })}
        />
      )}

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
