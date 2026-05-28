import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import type { BlogPost } from '@/lib/types';

/* ── Staggered grid card ─────────────────────────────────────── */
interface BlogCardProps {
  post:    BlogPost;
  offset?: boolean; // middle card gets md:mt-20
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, offset }) => {
  const date = post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : '';

  return (
    <Link to={`/blog/${post.slug}`} className={`group block${offset ? ' md:mt-20' : ''}`}>
      <div className="rounded-3xl overflow-hidden mb-6 aspect-[3/4]">
        <img
          src={post.cover_image ?? '/placeholder.svg'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <p className="text-hc-secondary text-xs font-bold uppercase tracking-wider mb-2 font-body">
        {post.category ?? 'Journal'}
      </p>
      <h3 className="font-headline text-hc-primary text-xl mb-3 group-hover:text-hc-secondary transition-colors">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="text-hc-text leading-relaxed font-body text-sm">
          {post.excerpt}
        </p>
      )}
      {date && (
        <p className="text-xs text-hc-text-light font-body mt-2">{date}</p>
      )}
    </Link>
  );
};

/* ── Featured hero post ──────────────────────────────────────── */
interface FeaturedPostProps {
  post: BlogPost;
}

export const FeaturedPost: React.FC<FeaturedPostProps> = ({ post }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
    <div className="lg:col-span-7">
      <Link to={`/blog/${post.slug}`} className="block rounded-3xl overflow-hidden">
        <img
          src={post.cover_image ?? '/placeholder.svg'}
          alt={post.title}
          className="w-full h-[420px] md:h-[522px] object-cover transition-transform duration-700 hover:scale-105"
        />
      </Link>
    </div>
    <div className="lg:col-span-5 lg:pl-12">
      {post.category && (
        <span className="inline-block bg-hc-accent-light text-[#360f00] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight mb-4 font-body">
          {post.category}
        </span>
      )}
      <h2 className="font-headline text-hc-primary text-3xl md:text-4xl leading-tight mb-6">
        <Link to={`/blog/${post.slug}`} className="hover:text-hc-secondary transition-colors">
          {post.title}
        </Link>
      </h2>
      {post.excerpt && (
        <p className="text-hc-text text-lg leading-relaxed mb-6 font-body">{post.excerpt}</p>
      )}
      <Link
        to={`/blog/${post.slug}`}
        className="text-hc-primary font-bold flex items-center gap-2 hover:gap-3 transition-all font-body text-sm"
        aria-label={`Read the full story: ${post.title}`}
      >
        Read the full story <ArrowRight size={16} />
      </Link>
    </div>
  </div>
);
