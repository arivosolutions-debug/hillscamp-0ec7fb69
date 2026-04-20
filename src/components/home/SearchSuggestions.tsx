import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { MapPin, Loader2 } from 'lucide-react';
import { usePropertySearch } from '@/hooks/usePropertySearch';
import { DISTRICT_LABELS } from '@/lib/types';

interface SearchSuggestionsProps {
  query: string;
  anchorRef: React.RefObject<HTMLElement>;
  onSelect?: () => void;
  width?: number; // optional fixed width; defaults to anchor width
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  anchorRef,
  onSelect,
  width,
}) => {
  const { data, isLoading } = usePropertySearch(query);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!query.trim()) return;
    const update = () => {
      if (anchorRef.current) setRect(anchorRef.current.getBoundingClientRect());
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [query, anchorRef]);

  if (!query.trim() || !rect) return null;

  const style: React.CSSProperties = {
    position: 'fixed',
    top: rect.bottom + 8,
    left: rect.left,
    width: width ?? rect.width,
    zIndex: 9999,
  };

  return createPortal(
    <div
      style={style}
      className="rounded-2xl shadow-xl overflow-hidden bg-white border border-black/5"
    >
      {isLoading && (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-hc-text font-body">
          <Loader2 size={14} className="animate-spin" />
          Searching…
        </div>
      )}

      {!isLoading && (data?.length ?? 0) === 0 && (
        <div className="px-4 py-3 text-sm text-hc-text font-body">
          No properties match “{query}”
        </div>
      )}

      {!isLoading && data && data.length > 0 && (
        <ul className="max-h-80 overflow-y-auto">
          {data.map((p: any) => (
            <li key={p.id}>
              <Link
                to={`/property/${p.slug}`}
                onClick={onSelect}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-hc-bg transition-colors"
              >
                <img
                  src={p.cover_image ?? '/placeholder.svg'}
                  alt={p.name}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-headline text-hc-primary text-sm truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-hc-text flex items-center gap-1 font-body truncate">
                    <MapPin size={11} strokeWidth={1.5} />
                    {p.location || DISTRICT_LABELS[p.district] || p.district}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>,
    document.body
  );
};
