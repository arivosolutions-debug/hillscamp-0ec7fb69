import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BlogPost } from '@/lib/types';

export function useBlogPosts(category?: string, limit?: number, featuredOnly?: boolean) {
  return useQuery({
    queryKey: ['blog-posts', category, limit, featuredOnly],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (category) query = query.eq('category', category);
      if (featuredOnly) query = query.eq('is_featured', true);
      if (limit)    query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      return data as BlogPost[];
    },
  });
}
