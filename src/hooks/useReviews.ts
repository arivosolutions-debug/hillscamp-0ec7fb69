import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Review {
  id: string;
  quote: string;
  guest_name: string;
  guest_title: string | null;
  stayed_at: string | null;
  initials: string | null;
  is_featured: boolean;
  property_id: string | null;
  package_id: string | null;
}

interface UseReviewsOptions {
  featuredOnly?: boolean;
  propertyId?: string;
  packageId?: string;
}

export const useReviews = (
  optionsOrFeatured: boolean | UseReviewsOptions = false,
) => {
  const opts: UseReviewsOptions =
    typeof optionsOrFeatured === 'boolean'
      ? { featuredOnly: optionsOrFeatured }
      : optionsOrFeatured;

  return useQuery({
    queryKey: ['reviews', opts],
    queryFn: async () => {
      let q = supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('sort_order', { ascending: true });

      if (opts.featuredOnly) q = q.eq('is_featured', true);
      if (opts.propertyId) q = q.eq('property_id', opts.propertyId);
      if (opts.packageId) q = q.eq('package_id', opts.packageId);

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Review[];
    },
  });
};
