import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, ArrowRight } from 'lucide-react';
import { DISTRICT_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/types';
import type { Property } from '@/lib/types';

interface PropertyCardProps {
  property: Property & { amenity_names?: string[]; tags?: string[] | null };
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  // Show tags first; fallback to property_type label so card never looks empty
  const tags =
    property.tags && property.tags.length > 0
      ? property.tags.slice(0, 3)
      : [PROPERTY_TYPE_LABELS[property.property_type] ?? property.property_type];

  return (
    <Link to={`/property/${property.slug}`} className="group block">
      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden mb-3 aspect-[4/3] md:aspect-[4/5]">
        <img
          src={property.cover_image ?? '/placeholder.svg'}
          alt={property.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Body */}
      <div className="px-1 md:px-0 py-2">
        <h3 className="font-headline text-hc-primary text-xl md:text-lg leading-snug mb-1">
          {property.name}
        </h3>

        <p className="text-sm text-hc-text flex items-center gap-1.5 mb-0.5 font-body">
          <MapPin size={13} strokeWidth={1.5} />
          {(property as any).location || DISTRICT_LABELS[property.district]}
        </p>
        <p className="text-sm text-hc-text flex items-center gap-1.5 font-body">
          <Users size={13} strokeWidth={1.5} />
          Up to {property.max_guests} Guests
        </p>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-hc-accent-light text-hc-primary border border-hc-primary/10 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full font-body"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-hc-primary text-sm font-body">
            Contact for Pricing
          </span>
          <ArrowRight size={16} className="text-hc-primary group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
};
