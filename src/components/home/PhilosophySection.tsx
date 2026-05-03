import React, { useEffect, useRef } from 'react';
import { usePropertyCount } from '@/hooks/usePropertyCount';

export const PhilosophySection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const { data: propertyCount } = usePropertyCount();

  const STATS = [
    { value: propertyCount != null ? String(propertyCount) : '—', label: 'PROPERTIES' },
    { value: '100%', label: 'Unique' },
    { value: '0', label: 'Compromises' },
  ];

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const content = section.querySelector<HTMLElement>('.philosophy-content');
    if (!content) return;
    content.classList.add('section-fade-up');
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) content.classList.add('in-view'); },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ minHeight: '600px' }}>
      {/* Full-width background image */}
      <img
        src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=2000&q=80"
        alt="Kerala forest canopy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto px-5 md:px-8 py-16 md:py-32 philosophy-content">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-hc-accent" />
          <span className="font-label text-xs tracking-[0.4em] text-hc-secondary">Our Philosophy</span>
        </div>

        <h2 className="font-headline text-white text-3xl md:text-6xl leading-tight mb-6 max-w-2xl">
          Luxury meets<br className="md:hidden" /> the <em className="italic">wild.</em>
        </h2>

        <p className="text-white/80 text-base md:text-lg leading-relaxed mb-4 max-w-xl">
          Hills Camp was born from a simple conviction: that the most profound luxury is not
          what you add to a landscape, but what you preserve within it. Every retreat is designed
          to dissolve the boundary between shelter and wilderness.
        </p>

        <p className="text-white/60 leading-relaxed mb-10 md:mb-12 max-w-xl hidden md:block">
          We work with local families, conservation biologists, and traditional craftspeople
          to create stays that are acts of ecological stewardship — beautiful precisely because
          they tread lightly on this ancient land.
        </p>

        {/* Stats — mobile: 2+1 layout, desktop: row */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-8 md:gap-12">
          {STATS.map((stat, i) => (
            <div key={stat.label} className={`border-l-2 border-hc-accent-light/40 pl-5 ${i === 2 ? 'col-span-1' : ''}`}>
              <div className="font-headline text-4xl md:text-4xl tabular-nums text-white font-bold leading-none mb-1">
                {stat.value}
              </div>
              <div className="font-label text-[10px] text-white/50 tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
