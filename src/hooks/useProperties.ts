import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Property, District, PropertyType } from '@/lib/types';

export interface PropertyFilters {
  district?: District;
  property_type?: PropertyType;
  max_guests?: number;
  featured?: boolean;
  /** Free-text location — partial (case-insensitive) match across location, district, tags, highlights. */
  location?: string;
}

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*, property_amenities(amenity_id, amenities(name)), property_images(image_url, sort_order)')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (filters.district) query = query.eq('district', filters.district);
      if (filters.property_type) query = query.eq('property_type', filters.property_type);
      if (filters.max_guests) query = query.gte('max_guests', filters.max_guests);
      if (filters.featured) query = query.eq('is_featured', true).limit(4);

      const { data, error } = await query;
      if (error) throw error;

      // Client-side location filter across location, district, tags[], highlights[]
      let rows = (data ?? []) as any[];
      if (filters.location && filters.location.trim()) {
        const term = filters.location.trim().toLowerCase();
        rows = rows.filter((p) => {
          const fields: string[] = [p.location, p.district].filter(Boolean);
          if (fields.some((f) => String(f).toLowerCase().includes(term))) return true;
          const tags: string[] = p.tags ?? [];
          const highlights: string[] = p.highlights ?? [];
          return (
            tags.some((t) => t?.toLowerCase().includes(term)) ||
            highlights.some((h) => h?.toLowerCase().includes(term))
          );
        });
      }

      return rows.map((p) => {
        const amenity_names: string[] = (p.property_amenities ?? [])
          .map((pa: any) => pa.amenities?.name)
          .filter(Boolean);
        const gallery_images: string[] = ((p.property_images ?? []) as any[])
          .slice()
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((pi: any) => pi.image_url)
          .filter(Boolean);
        const { property_amenities, property_images, ...rest } = p;
        return { ...rest, amenity_names, gallery_images } as Property & {
          amenity_names: string[];
          gallery_images: string[];
        };
      });
    },
  });
}
