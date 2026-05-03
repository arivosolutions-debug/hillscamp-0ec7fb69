import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePropertyCount = () => {
  return useQuery({
    queryKey: ['property-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);
      if (error) throw error;
      return count ?? 0;
    },
  });
};