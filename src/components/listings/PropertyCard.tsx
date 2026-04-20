import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, ArrowRight } from 'lucide-react';
import { DISTRICT_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/types';
import { usePropertyTypeLabels } from '@/hooks/usePropertyTypes';
import type { Property } from '@/lib/types';

interface PropertyCardProps {
  property: Property & { amenity_names?: string[]; tags?: string[] | null };
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const typeLabels = usePropertyTypeLabels();

  // Resolve the property type label from the admin-managed `property_types` table,
  // falling back to the curated PROPERTY_TYPE_LABELS map and finally the raw slug.
  const propertyTypeLabel =
    typeLabels[property.property_type] ??
    PROPERTY_TYPE_LABELS[property.property_type] ??
    property.property_type;

  const tags = property.tags && property.tags.length > 0 ? property.tags.slice(0, 3) : [];

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
        {/* Property type chip — matches Featured Retreats badge style */}
        <span className="absolute top-3 left-3 bg-hc-bg/90 backdrop-blur-sm text-hc-primary text-[10px] font-bold uppercase tracking-tight px-3 py-1 rounded-full font-body">
          {propertyTypeLabel}
        </span>
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

        {/* Admin-defined tag pills */}
        {tags.length > 0 && (
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
        )}

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
