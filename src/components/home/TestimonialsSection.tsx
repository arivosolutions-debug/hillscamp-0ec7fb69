import React, { useEffect, useRef, useState } from 'react';
import { Quote } from 'lucide-react';
import { useReviews, type Review } from '@/hooks/useReviews';

const getInitials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const Avatar = ({ review, className = '' }: { review: Review; className?: string }) => (
  <div className={`w-12 h-12 rounded-full bg-hc-secondary/20 flex items-center justify-center shrink-0 ${className}`}>
    <span className="font-body font-bold text-hc-primary text-sm">
      {review.initials ?? getInitials(review.guest_name)}
    </span>
  </div>
);

export const TestimonialsSection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { data: allReviews = [] } = useReviews(true);
  const reviews = allReviews.slice(0, 4);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const items = section.querySelectorAll<HTMLElement>('.testimonial-card');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); }),
      { threshold: 0.1 }
    );
    items.forEach((item, i) => {
      item.classList.add('section-fade-up');
      item.style.transitionDelay = `${i * 150}ms`;
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, [reviews]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  if (reviews.length === 0) return null;

  return (
    <section ref={ref} className="relative py-16 md:py-32 px-5 md:px-8 bg-hc-bg">
      <div className="relative z-10 max-w-content mx-auto">
        {/* Label */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-hc-secondary" />
          <span className="font-label text-xs tracking-[0.4em] text-hc-secondary">THE EXPERIENCE</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-16">
          <h2 className="font-headline text-3xl md:text-5xl leading-tight max-w-sm text-hc-primary">
            Words from those<br /><em>who stayed.</em>
          </h2>
        </div>

        {/* Desktop grid - single row, compact */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="testimonial-card group bg-white rounded-2xl p-6 flex flex-col shadow-card">
              <div className="h-0.5 w-8 group-hover:w-14 bg-hc-secondary mb-4 transition-all duration-500 ease-out" />
              <Quote size={24} className="text-hc-secondary/20 mb-3 group-hover:text-hc-secondary/40 transition-colors duration-500" />
              <blockquote className="font-headline text-hc-primary text-base italic leading-relaxed mb-6 flex-1">
                "{review.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <Avatar review={review} className="w-10 h-10 grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div>
                  <div className="font-body font-bold text-hc-primary text-sm">{review.guest_name}</div>
                  <div className="font-body text-xs text-hc-text-light">{review.guest_title ?? ''}</div>
                </div>
              </div>
            </div>
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
            {reviews.map((review) => (
              <div key={review.id} className="min-w-[85vw] snap-start" style={{ scrollSnapStop: 'always' }}>
                <div className="testimonial-card bg-white/80 backdrop-blur-xl rounded-2xl p-6 relative">
                  <div className="absolute -top-4 right-4">
                    <Avatar review={review} className="border-2 border-white shadow-lg w-14 h-14" />
                  </div>
                  <Quote size={28} className="text-hc-secondary/30 mb-3" />
                  <blockquote className="font-headline text-hc-primary text-lg italic leading-relaxed mb-6">
                    "{review.quote}"
                  </blockquote>
                  <div className="font-body font-bold text-hc-primary text-sm">{review.guest_name}</div>
                  {review.stayed_at && (
                    <div className="font-body text-xs text-hc-secondary">stayed at {review.stayed_at}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
