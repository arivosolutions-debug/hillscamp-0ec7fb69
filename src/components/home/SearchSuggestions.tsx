import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Loader2 } from 'lucide-react';
import { usePropertySearch } from '@/hooks/usePropertySearch';
import { DISTRICT_LABELS } from '@/lib/types';

interface SearchSuggestionsProps {
  query: string;
  onSelect?: () => void;
  variant?: 'light' | 'dark'; // dark = on hero (light text), light = on white bg
  className?: string;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSelect,
  variant = 'light',
  className = '',
}) => {
  const { data, isLoading } = usePropertySearch(query);

  if (!query.trim()) return null;

  return (
    <div
      className={`absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl shadow-xl overflow-hidden bg-white border border-black/5 ${className}`}
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
    </div>
  );
};
