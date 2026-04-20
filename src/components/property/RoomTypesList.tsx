import React, { useState, useEffect } from 'react';
import { BedDouble, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { RoomType } from '@/lib/types';
import { ImageLightbox } from '@/components/property/ImageLightbox';
import { RoomGalleryGrid } from '@/components/property/RoomGalleryGrid';

interface RoomTypesListProps {
  rooms:      RoomType[];
  coverImage: string | null;
}

const RoomCarousel: React.FC<{
  images: string[];
  alt: string;
  onImageClick: (index: number) => void;
}> = ({ images, alt, onImageClick }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setCurrent(i => (i + 1) % images.length), 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div
      className="relative w-full h-full cursor-pointer"
      onClick={() => onImageClick(current)}
    >
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
        <>
          <button onClick={(e) => { e.stopPropagation(); setCurrent(i => (i - 1 + images.length) % images.length); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 z-10 transition-colors"
            >
            <ChevronLeft size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setCurrent(i => (i + 1) % images.length); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 z-10 transition-colors"
            >

            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? 'w-[6px] h-[6px] bg-white' : 'w-[5px] h-[5px] bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const RoomTypesList: React.FC<RoomTypesListProps> = ({ rooms, coverImage }) => {
  const [grid, setGrid] = useState<{ images: string[]; roomName: string } | null>(null);
  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
    roomName: string;
  } | null>(null);

  if (!rooms.length) return null;

  return (
    <div className="mb-12">
      <h2 className="font-headline text-hc-primary text-3xl mb-8">Accommodation Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rooms.map(room => {
          const roomImages = (room.room_type_images ?? [])
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map(img => img.image_url);
          const images = roomImages.length > 0 ? roomImages : [coverImage ?? '/placeholder.svg'];

          return (
            <div
              key={room.id}
              className="bg-hc-bg-alt rounded-2xl overflow-hidden flex group hover:shadow-card transition-shadow duration-300"
            >
              <div className="w-[45%] shrink-0 relative overflow-hidden">
                <RoomCarousel
                images={images}
                alt={room.name}
                onImageClick={() => setGrid({ images, roomName: room.name })}
              />
              </div>

              <div className="flex-1 p-5 flex flex-col justify-between min-h-[180px]">
                <div>
                  <div className="flex items-start justify-between mb-1 gap-2">
                    <h3 className="font-headline text-hc-primary text-lg leading-snug">{room.name}</h3>
                    <BedDouble size={15} strokeWidth={1.5} className="text-hc-text-light mt-1 shrink-0" />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-hc-secondary font-bold uppercase tracking-wider mb-3 font-body">
                    {room.bed_type && <span>{room.bed_type}</span>}
                    {room.bed_type && room.max_guests && <span>·</span>}
                    {room.max_guests && (
                      <span className="flex items-center gap-1">
                        <Users size={11} strokeWidth={2} />
                        {room.max_guests} Guest{room.max_guests !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {room.description && (
                    <p className="text-sm text-hc-text leading-relaxed font-body line-clamp-3">
                      {room.description}
                    </p>
                  )}
                </div>

                <div className="border-t border-hc-text-light/10 mt-4 pt-3 flex items-center justify-between">
                  <span className="font-bold text-hc-primary font-body text-xs uppercase tracking-wider">
                    Contact for Pricing
                  </span>
                  <ArrowRight size={14} className="text-hc-primary group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </div>
          );
        })}
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
