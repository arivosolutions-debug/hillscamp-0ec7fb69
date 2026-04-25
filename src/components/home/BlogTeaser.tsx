import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useBlogPosts } from '@/hooks/useBlogPosts';

export const BlogTeaser: React.FC = () => {
  const { data: posts, isLoading } = useBlogPosts(undefined, 4, true);
  const ref = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!ref.current || (!posts && !isLoading)) return;
    const section = ref.current;
    const items = section.querySelectorAll<HTMLElement>('.blog-card');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); }),
      { threshold: 0.08 }
    );
    items.forEach((item, i) => {
      item.classList.add('section-fade-up');
      item.style.transitionDelay = `${i * 100}ms`;
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, [posts, isLoading]);

  // Hide entire section when no featured posts are available
  if (!isLoading && (!posts || posts.length === 0)) return null;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  const CardContent = ({ post }: { post: NonNullable<typeof posts>[0] }) => (
    <Link to={`/blog/${post.slug}`} className="blog-card group block bg-white rounded-2xl overflow-hidden shadow-sm md:shadow-none md:bg-transparent md:rounded-none">
      {/* Cover image */}
      <div className="rounded-t-2xl md:rounded-2xl overflow-hidden mb-0 md:mb-6 card-hover bg-hc-bg-alt">
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-[200px] md:h-[210px] aspect-[4/3] md:aspect-auto object-cover"
          />
        )}
      </div>

      <div className="p-5 md:p-0">
        {/* Category */}
        {post.category && (
          <p className="text-hc-secondary text-xs font-bold uppercase tracking-wider mb-2">
            {post.category}
          </p>
        )}

        {/* Title */}
        <h3 className="font-headline text-hc-primary text-lg md:text-xl mb-2 md:mb-3 group-hover:text-hc-secondary transition-colors duration-200 leading-snug">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-hc-text leading-relaxed text-sm line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* Read more */}
        <span className="inline-flex items-center gap-1.5 text-hc-secondary font-bold text-sm group-hover:gap-2.5 transition-all">
          Read More
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );

  return (
    <section ref={ref} className="py-16 md:py-32 px-5 md:px-8 pb-28 md:pb-32 max-w-content mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="h-px w-12 bg-hc-secondary" />
        <span className="font-label text-xs tracking-[0.4em] text-hc-secondary">FROM THE JOURNAL</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-16">
        <div>
          <h2 className="font-headline text-hc-primary text-3xl md:text-5xl mb-2 md:mb-4">
            The Hills Camp <em className="italic">Journal.</em>
          </h2>
          <p className="text-hc-text text-base md:text-lg max-w-2xl">
            Stories of slow travel, mountain life, and the hidden gems of Kerala's lush interiors.
          </p>
        </div>
        <Link
          to="/blog"
          className="flex items-center gap-2 text-hc-primary font-bold hover:gap-3 transition-all group shrink-0"
        >
          All Stories
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-2xl bg-hc-bg-alt h-[200px] md:h-[210px] mb-6" />
              <div className="h-3 bg-hc-bg-alt rounded w-1/4 mb-3" />
              <div className="h-5 bg-hc-bg-alt rounded w-3/4 mb-2" />
              <div className="h-4 bg-hc-bg-alt rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Desktop grid */}
          <div className={`hidden md:grid gap-12 ${
            posts && posts.length >= 3 ? 'grid-cols-3' :
            posts && posts.length === 2 ? 'grid-cols-2 max-w-4xl mx-auto' :
            'grid-cols-1 max-w-xl mx-auto'
          }`}>
            {posts?.map((post) => (
              <CardContent key={post.id} post={post} />
            ))}
          </div>

          {/* Mobile carousel */}
          <div className="md:hidden -mr-5">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {posts?.map((post) => (
                <div key={post.id} className="min-w-[85vw] snap-start" style={{ scrollSnapStop: 'always' }}>
                  <CardContent post={post} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};
