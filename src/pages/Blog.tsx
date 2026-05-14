import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { BlogCard, FeaturedPost } from '@/components/blog/BlogCard';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useBlogPost } from '@/hooks/useBlogPost';
import { MarkdownContent } from '@/components/shared/MarkdownContent';
import { SeoHead } from '@/components/shared/SeoHead';
import { ogImageUrl } from '@/lib/ogImage';

const CATEGORIES = ['All', 'Wayanad', 'Alleppey', 'Munnar', 'Travel Tips', 'Sustainability'];

/* ═══════════════════════════════════════════════════════════════
   Blog Listing
════════════════════════════════════════════════════════════════ */
export const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { data: posts, isLoading } = useBlogPosts(
    activeCategory !== 'All' ? activeCategory : undefined,
  );

  const featured  = posts?.[0];
  const remaining = posts?.slice(1) ?? [];

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-hc-bg min-h-screen">

          {/* ── Header ─────────────────────────────────────────── */}
          <section className="pt-36 pb-4 px-8 max-w-[1280px] mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-[1px] w-10 bg-[#924a29]" />
              <span className="text-[#924a29] text-[10px] font-bold uppercase tracking-[0.4em] font-body">
                From the Western Ghats
              </span>
              <div className="h-[1px] w-10 bg-[#924a29]" />
            </div>
            <h1 className="font-headline text-[#17341e] text-6xl md:text-8xl tracking-tight leading-[1.0]">
              The Journal
            </h1>
          </section>

          {/* ── Category Filter ─────────────────────────────────── */}
          <section className="px-8 max-w-[1280px] mx-auto pt-10 pb-2">
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full font-body text-sm font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-[#17341e] text-white shadow-sm'
                      : 'bg-[#f5f3f3] text-[#424842] hover:text-[#17341e] hover:bg-[#ede9e8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* ── Skeletons ───────────────────────────────────────── */}
          {isLoading && (
            <section className="px-8 max-w-[1280px] mx-auto py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`animate-pulse${i === 1 ? ' md:mt-20' : ''}`}>
                    <div className="rounded-3xl bg-hc-bg-alt aspect-[3/4] mb-6" />
                    <div className="h-3 bg-hc-bg-alt rounded w-1/4 mb-3" />
                    <div className="h-5 bg-hc-bg-alt rounded w-3/4 mb-2" />
                    <div className="h-3 bg-hc-bg-alt rounded w-full" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {!isLoading && (
            <>
              {/* ── Featured Post ─────────────────────────────── */}
              {featured && (
                <section className="px-8 max-w-[1280px] mx-auto py-16">
                  <FeaturedPost post={featured} />
                </section>
              )}

              {/* ── Post Grid ─────────────────────────────────── */}
              {remaining.length > 0 && (
                <section className="px-8 max-w-[1280px] mx-auto py-12">
                  <div className={`grid grid-cols-1 gap-12 ${
                    remaining.length === 1 ? 'md:grid-cols-1 max-w-xl mx-auto' :
                    remaining.length === 2 ? 'md:grid-cols-2' :
                    'md:grid-cols-3'
                  }`}>
                    {remaining.map((post, idx) => (
                      <BlogCard key={post.id} post={post} offset={remaining.length >= 3 && idx % 3 === 1} />
                    ))}
                  </div>
                </section>
              )}

              {/* Empty state */}
              {!featured && !isLoading && (
                <div className="flex flex-col items-center justify-center py-32 text-center px-8">
                  <p className="font-headline text-4xl text-hc-primary mb-3">No stories yet</p>
                  <p className="font-body text-hc-text-light text-sm">
                    {activeCategory !== 'All' ? `No posts in "${activeCategory}" — try another category.` : 'Check back soon.'}
                  </p>
                </div>
              )}
            </>
          )}

          {/* ── Sticky enquire FAB (desktop) ────────────────────── */}
          <Link
            to="/contact"
            className="fixed bottom-8 right-8 bg-hc-primary text-white px-6 py-3 rounded-full font-semibold shadow-lg items-center gap-2 hover:bg-hc-primary-deep transition-all z-40 hidden md:flex font-body text-sm"
          >
            Enquire Now <MessageCircle size={18} strokeWidth={1.75} />
          </Link>
        </main>
        <Footer />
      </PageTransition>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Blog Post
════════════════════════════════════════════════════════════════ */
export const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-hc-bg flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-hc-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-hc-bg flex flex-col items-center justify-center gap-4">
          <h1 className="font-headline text-4xl text-hc-primary">Story not found</h1>
          <Link to="/blog" className="font-body text-hc-secondary hover:underline">← Back to Journal</Link>
        </div>
      </>
    );
  }

  const date     = post.published_at ? format(new Date(post.published_at), 'MMMM d, yyyy') : '';
  const wordCount = (post.content ?? '').split(/\s+/).length;
  const readMins  = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <>
      <SeoHead
        title={post.title}
        description={post.excerpt || null}
        image={post.slug ? ogImageUrl('post', post.slug) : null}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          datePublished: post.published_at ?? undefined,
          articleSection: post.category ?? undefined,
          image: post.cover_image ?? undefined,
        }}
      />
      <Navbar />
      <PageTransition>
        <main className="bg-hc-bg">
          <article className="max-w-3xl mx-auto px-8 pt-36 pb-20">

            {/* ── Back nav ─────────────────────────────────────── */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-hc-text-light hover:text-hc-primary font-body text-sm mb-10 transition-colors"
            >
              <ArrowLeft size={14} /> The Journal
            </Link>

            {/* ── Article Header ───────────────────────────────── */}
            <div className="text-center mb-12">
              <p className="text-hc-secondary text-xs font-bold uppercase tracking-[0.3em] mb-4 font-body">
                {[post.category, `${readMins} min read`].filter(Boolean).join(' · ')}
              </p>
              <h1 className="font-headline text-hc-primary text-4xl md:text-6xl leading-tight mb-8">
                {post.title}
              </h1>
              {date && (
                <p className="text-sm text-hc-text-light font-body">{date}</p>
              )}
            </div>

            {/* ── Cover Image ──────────────────────────────────── */}
            {post.cover_image && (
              <figure className="my-12 -mx-8 md:-mx-12">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                </div>
                {post.category && (
                  <figcaption className="text-center text-sm text-hc-text-light mt-4 italic font-body">
                    Hills Camp Kerala — {post.category}
                  </figcaption>
                )}
              </figure>
            )}

            {/* ── Pull Quote (excerpt) ─────────────────────────── */}
            {post.excerpt && (
              <div className="border-l-2 border-hc-secondary pl-8 mb-12">
                <p className="font-headline text-hc-primary text-xl italic leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            )}

            {/* ── Body Content ─────────────────────────────────── */}
            <MarkdownContent source={post.content} size="lg" />

            {/* ── CTA Block ────────────────────────────────────── */}
            <div className="bg-hc-primary rounded-3xl p-12 mt-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-hc-accent/10 rounded-full -mr-20 -mt-20" />
              <div className="relative">
                <h3 className="font-headline text-white text-2xl mb-3">Start your own story.</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-md font-body">
                  Explore our curated collection of wilderness retreats and find the one that speaks to your soul.
                </p>
                <Link
                  to="/listings"
                  className="bg-hc-accent text-[#360f00] px-8 py-3 rounded-xl font-bold text-sm inline-block hover:brightness-110 transition-all font-body"
                >
                  Explore Properties
                </Link>
              </div>
            </div>
          </article>
        </main>
        <Footer />
      </PageTransition>
    </>
  );
};
