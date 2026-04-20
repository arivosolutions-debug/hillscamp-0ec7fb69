import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images, index, title, onClose, onNavigate,
}) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const prev = useCallback(() =>
    onNavigate((index - 1 + images.length) % images.length),
    [index, images.length, onNavigate]
  );

  const next = useCallback(() =>
    onNavigate((index + 1) % images.length),
    [index, images.length, onNavigate]
  );

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next, onClose]);

  // Lock body scroll
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);

  const src = images[index];

  const content = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0,0,0,0.20)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClose}
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
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
          dx < 0 ? next() : prev();
        }
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          flexShrink: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: 0 }}>
            {title}
          </p>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
            {index + 1} / {images.length}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          style={{
            width: 40, height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close"
        >
          <X size={18} color="white" />
        </button>
      </div>

      {/* Image area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 56px',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {src ? (
          <img
            src={src}
            alt={`${title} — ${index + 1} of ${images.length}`}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 130px)',
              objectFit: 'contain',
              borderRadius: 12,
              userSelect: 'none',
              display: 'block',
            }}
            draggable={false}
          />
        ) : (
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            No image
          </div>
        )}
      </div>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            style={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 44, height: 44,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Previous"
          >
            <ChevronLeft size={22} color="white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 44, height: 44,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Next"
          >
            <ChevronRight size={22} color="white" />
          </button>
        </>
      )}
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};