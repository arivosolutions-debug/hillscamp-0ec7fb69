import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Property } from '@/lib/types';

/**
 * Live search across properties.
 * Matches case-insensitive partial against:
 *   name, district, location, property_type, tags[], highlights[]
 */
export function usePropertySearch(query: string) {
  const q = query.trim();

  return useQuery({
    queryKey: ['property-search', q.toLowerCase()],
    enabled: q.length >= 1,
    queryFn: async () => {
      const like = `%${q}%`;
      // Use Supabase `or` filter — `cs` (contains) for arrays needs exact tokens,
      // so for tags/highlights we fetch broadly then filter client-side as a safety net.
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_published', true)
        .or(
          [
            `name.ilike.${like}`,
            `district.ilike.${like}`,
            `location.ilike.${like}`,
            `property_type.ilike.${like}`,
          ].join(',')
        )
        .limit(20);

      if (error) throw error;

      // Also pull rows where tags or highlights array contains a partial match
      const { data: arrayMatches } = await supabase
        .from('properties')
        .select('*')
        .eq('is_published', true)
        .limit(200);

      const lower = q.toLowerCase();
      const extras = (arrayMatches ?? []).filter((p: any) => {
        const tags: string[] = p.tags ?? [];
        const highlights: string[] = p.highlights ?? [];
        return (
          tags.some((t) => t?.toLowerCase().includes(lower)) ||
          highlights.some((h) => h?.toLowerCase().includes(lower))
        );
      });

      // Merge & dedupe
      const map = new Map<string, Property>();
      [...(data ?? []), ...extras].forEach((p: any) => map.set(p.id, p));
      return Array.from(map.values()).slice(0, 8) as Property[];
    },
    staleTime: 30_000,
  });
}
