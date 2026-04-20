import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LocationRow {
  id: string;
  name: string;
  sort_order: number | null;
}

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('locations' as any) as any)
        .select('id, name, sort_order')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      return (data ?? []) as LocationRow[];
    },
  });
}
