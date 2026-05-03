import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PropertyTypeRow {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  collection: string | null;
  sort_order: number | null;
  cover_image: string | null;
}

/**
 * Loads admin-managed property types from the `property_types` table.
 * Single source of truth for type labels (cards, filters, badges).
 */
export function usePropertyTypes() {
  return useQuery({
    queryKey: ['property-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_types')
        .select('id, slug, name, subtitle, collection, sort_order, cover_image')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      return (data ?? []) as PropertyTypeRow[];
    },
    staleTime: 5 * 60_000,
  });
}

/** Build a slug -> name map for quick label lookup. */
export function usePropertyTypeLabels() {
  const { data } = usePropertyTypes();
  const map: Record<string, string> = {};
  (data ?? []).forEach((t) => {
    map[t.slug] = t.name;
  });
  return map;
}
