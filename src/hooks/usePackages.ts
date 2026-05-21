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
  min_participants: number | null;
  max_participants: number | null;
  whats_not_included: string[] | null;
  terms_conditions: string[] | null;
  whats_included: string[] | null;
  highlights: string[] | null;
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
        .select('*, package_gallery(image_url, display_order)')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (filters.region) {
        query = query.eq('region', filters.region);
      }

      if (filters.featured === true) {
        query = query.eq('is_featured', true).limit(7);
      }

      const { data, error } = await query;
      if (error) throw error;
      const rows = (data ?? []) as any[];
      const merged = rows.map((r) => {
        const gallery = ((r.package_gallery ?? []) as any[])
          .slice()
          .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
          .map((g) => g.image_url as string)
          .filter(Boolean);
        const heros = (r.hero_images ?? []) as string[];
        const combined = Array.from(new Set([...(heros ?? []), ...gallery]));
        return { ...r, hero_images: combined } as Package;
      });
      return merged as Package[];
    },
  });
}
