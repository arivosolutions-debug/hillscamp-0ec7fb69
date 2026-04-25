import React from 'react';
import { PropertyCard } from './PropertyCard';
import type { Property } from '@/lib/types';

interface PropertyGridProps {
  properties: (Property & { amenity_names?: string[]; min_price?: number | null })[];
  isLoading: boolean;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({ properties, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="rounded-2xl bg-hc-bg-alt aspect-[4/3] md:aspect-[4/5] mb-3" />
            <div className="h-5 bg-hc-bg-alt rounded w-3/4 mb-2" />
            <div className="h-3 bg-hc-bg-alt rounded w-1/2 mb-1.5" />
            <div className="h-3 bg-hc-bg-alt rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="font-headline text-6xl mb-6 opacity-20">⛰</div>
        <h3 className="font-headline text-2xl text-hc-primary mb-3">No retreats found</h3>
        <p className="font-body text-sm text-hc-text-light max-w-xs">
          Try adjusting your filters — the right wilderness retreat is waiting.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {properties.map(p => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
};
