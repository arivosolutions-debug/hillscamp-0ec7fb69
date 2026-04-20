import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Property, District, PropertyType } from '@/lib/types';

export interface PropertyFilters {
  district?: District;
  property_type?: PropertyType;
  max_guests?: number;
  featured?: boolean;
}

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*, property_amenities(amenity_id, amenities(name))')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (filters.district) query = query.eq('district', filters.district);
      if (filters.property_type) query = query.eq('property_type', filters.property_type);
      if (filters.max_guests) query = query.gte('max_guests', filters.max_guests);
      if (filters.featured) query = query.eq('is_featured', true).limit(4);

      const { data, error } = await query;
      if (error) throw error;

      // Flatten amenity names onto each property
      return (data as any[]).map((p) => {
        const amenity_names: string[] = (p.property_amenities ?? [])
          .map((pa: any) => pa.amenities?.name)
          .filter(Boolean);
        const { property_amenities, ...rest } = p;
        return { ...rest, amenity_names } as Property & { amenity_names: string[] };
      });
    },
  });
}
