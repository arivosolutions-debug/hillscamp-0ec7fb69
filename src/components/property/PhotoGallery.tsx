import React, { useState } from 'react';
import { Images } from 'lucide-react';
import type { PropertyImage } from '@/lib/types';
import { ImageLightbox } from '@/components/property/ImageLightbox';
import { RoomGalleryGrid } from '@/components/property/RoomGalleryGrid';

interface PhotoGalleryProps {
  coverImage:   string | null;
  images:       PropertyImage[];
  propertyName: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ coverImage, images, propertyName }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [gridOpen, setGridOpen] = useState(false);

  const allImages: string[] = [
    coverImage ?? '/placeholder.svg',
    ...images.map(i => i.image_url),
  ].filter(Boolean);

  const mosaic = allImages.slice(0, 5);
  while (mosaic.length < 5) mosaic.push('/placeholder.svg');

  const openLightbox  = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  return (
    <>
      {/* ── Bento mosaic: 7/12 hero left + 5/12 2×2 right ─────────── */}
      <div className="grid grid-cols-12 gap-3 h-[480px] md:h-[580px] rounded-3xl overflow-hidden">

        {/* Hero — 7 cols, full height */}
        <div
          className="col-span-12 md:col-span-7 relative overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <img
            src={mosaic[0]}
            alt={propertyName}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </div>

        {/* 2×2 right — 5 cols */}
        <div className="hidden md:grid col-span-5 grid-cols-2 grid-rows-2 gap-3">

          {/* Top-left thumbnail */}
          <div
            className="relative overflow-hidden rounded-none cursor-pointer group"
            onClick={() => openLightbox(1)}
          >
            <img
              src={mosaic[1]}
              alt={`${propertyName} — photo 2`}
              className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </div>

          {/* Top-right thumbnail */}
          <div
            className="relative overflow-hidden rounded-none cursor-pointer group"
            onClick={() => openLightbox(2)}
          >
            <img
              src={mosaic[2]}
              alt={`${propertyName} — photo 3`}
              className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </div>

          {/* Bottom-left thumbnail */}
          <div
            className="relative overflow-hidden rounded-none cursor-pointer group"
            onClick={() => openLightbox(3)}
          >
            <img
              src={mosaic[3]}
              alt={`${propertyName} — photo 4`}
              className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </div>

          {/* Bottom-right — "View all" overlay */}
          <div
            className="relative overflow-hidden rounded-none cursor-pointer group"
            onClick={() => allImages.length > 5 ? setGridOpen(true) : openLightbox(4)}
          >
            <img
              src={mosaic[4]}
              alt={`${propertyName} — photo 5`}
              className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
            />
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${allImages.length > 5 ? 'bg-hc-primary-dark/60' : 'bg-black/0 group-hover:bg-black/20'}`}>
              {allImages.length > 5 && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Images size={16} className="text-white" />
                  </div>
                  <span className="text-white font-body font-semibold text-sm tracking-wide">
                    View all {allImages.length} →
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: show 2nd image as strip below hero */}
        <div
          className="md:hidden col-span-12 h-32 relative overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(1)}
        >
          <img
            src={mosaic[1]}
            alt={`${propertyName} — photo 2`}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
          />
          {allImages.length > 2 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-body font-semibold text-sm flex items-center gap-1.5">
                <Images size={15} /> View all {allImages.length} photos
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox ───────────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={allImages}
          index={lightboxIndex}
          title={propertyName}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
};
