import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DISTRICT_LABELS } from '@/lib/types';

interface SimilarStaysProps {
  currentSlug: string;
  district: string;
  propertyType: string;
}

export const SimilarStays: React.FC<SimilarStaysProps> = ({ currentSlug, district, propertyType }) => {
  const { data: similar } = useQuery({
    queryKey: ['similar-stays', currentSlug],
    queryFn: async () => {
      const { data } = await supabase
        .from('properties')
        .select('slug, name, cover_image, district')
        .eq('is_published', true)
        .neq('slug', currentSlug)
        .or(`district.eq.${district},property_type.eq.${propertyType}`)
        .limit(4);
      return data ?? [];
    },
  });

  if (!similar?.length) return null;

  return (
    <div className="mt-10">
      <h2 className="font-headline text-[#17341e] text-2xl px-5 mb-4">Similar Stays</h2>

      {/* Mobile carousel */}
      <div className="md:hidden overflow-x-auto snap-x snap-mandatory hide-scrollbar px-5 flex gap-3">
        {similar.map(p => (
          <Link
            key={p.slug}
            to={`/property/${p.slug}`}
            className="flex-shrink-0 snap-start snap-always rounded-2xl overflow-hidden relative"
            style={{ width: 'calc(50vw - 28px)' }}
          >
            <div className="aspect-[3/4] relative">
              <img
                src={p.cover_image ?? '/placeholder.svg'}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute top-3 left-3 bg-[#17341e]/80 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-body">
                {DISTRICT_LABELS[p.district] ?? p.district}
              </span>
              <p className="absolute bottom-3 left-3 right-3 font-headline text-white text-sm font-bold leading-tight">
                {p.name}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-4 gap-4 px-8 max-w-[1280px] mx-auto">
        {similar.map(p => (
          <Link
            key={p.slug}
            to={`/property/${p.slug}`}
            className="rounded-2xl overflow-hidden relative group"
          >
            <div className="aspect-[3/4] relative">
              <img
                src={p.cover_image ?? '/placeholder.svg'}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute top-3 left-3 bg-[#17341e]/80 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-body">
                {DISTRICT_LABELS[p.district] ?? p.district}
              </span>
              <p className="absolute bottom-3 left-3 right-3 font-headline text-white text-sm font-bold leading-tight">
                {p.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
