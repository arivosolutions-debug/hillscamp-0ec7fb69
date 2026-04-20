import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Package {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  region: string | null;
  duration_days: number | null;
  duration_nights: number | null;
  price_inr: number | null;
  distance_km: number | null;
  coordinates: any;
  tags: string[] | null;
  hero_images: string[] | null;
  itinerary: any;
  whats_not_included: string[] | null;
  terms_conditions: string[] | null;
  instagram_hashtag: string | null;
  is_featured: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface PackageFilters {
  region?: string;
  featured?: boolean;
}

export function usePackages(filters: PackageFilters = {}) {
  return useQuery({
    queryKey: ['packages', filters],
    queryFn: async () => {
      let query = supabase
        .from('packages' as any)
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters.region) {
        query = query.eq('region', filters.region);
      }

      if (filters.featured === true) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as Package[];
    },
  });
}
