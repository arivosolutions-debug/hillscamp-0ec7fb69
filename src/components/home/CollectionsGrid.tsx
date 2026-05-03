import React, { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePropertyTypes } from '@/hooks/usePropertyTypes';

const FALLBACK_CARDS = [
  {
    label: 'Tree Houses',
    title: 'Canopy Retreats',
    subtitle: 'Sleep 40 feet above the forest floor.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=85',
    href: '/listings?type=tree_house',
  },
  {
    label: 'Backwater',
    title: 'Floating Villas',
    subtitle: 'Drift through liquid mirrors of Kerala.',
    image: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=900&q=85',
    href: '/listings?type=backwater_villa',
  },
  {
    label: 'Mountain',
    title: 'High Range',
    subtitle: 'Wake above the cloud line.',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=900&q=85',
    href: '/listings?type=mountain_lookout',
  },
  {
    label: 'Tea Plantation',
    title: "Planter's Legacy",
    subtitle: 'A century of stories steeped in your cup.',
    image: 'https://images.unsplash.com/photo-1759148539722-1bbcd7b32d1e?w=1400&q=85',
    href: '/listings?type=tea_estate_cabin',
  },
];

// Desktop layout: 8/4 then 4/8 to keep the asymmetric editorial rhythm
const LAYOUT = [
  { cols: 'lg:col-span-8', aspect: 'aspect-[16/9] lg:aspect-auto' },
  { cols: 'lg:col-span-4', aspect: 'aspect-[3/4] lg:aspect-auto' },
  { cols: 'lg:col-span-4', aspect: 'aspect-[3/4] lg:aspect-auto' },
  { cols: 'lg:col-span-8', aspect: 'aspect-[16/9] lg:aspect-auto' },
];

interface CollectionCardProps {
  label: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  cols: string;
  aspect: string;
  index: number;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  label, title, subtitle, image, href, cols, aspect, index,
}) => (
  <Link
    to={href}
    className={`collection-card group relative overflow-hidden rounded-2xl md:rounded-3xl ${cols} ${aspect} block`}
    style={{ transitionDelay: `${index * 90}ms` }}
  >
    <img
      src={image}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:brightness-90 group-hover:scale-[1.04] transition-all duration-1000"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-hc-primary-dark/85 via-hc-primary-dark/20 to-transparent" />
    <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end">
      <span className="inline-block bg-white/15 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 md:mb-3 self-start font-label border border-white/20">
        {label}
      </span>
      <h3 className="font-headline text-white text-xl md:text-3xl leading-tight mb-1">
        {title}
      </h3>
      <p className="font-body text-sm text-white/80 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 hidden md:block">
        {subtitle}
      </p>
    </div>
  </Link>
);

export const CollectionsGrid: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const { data: types } = usePropertyTypes();

  const cards = useMemo(() => {
    const top4 = (types ?? []).slice(0, 4);
    const base = top4.length
      ? top4.map((t, i) => ({
          label: t.collection || t.name,
          title: t.name,
          subtitle: t.subtitle ?? '',
          image: t.cover_image || FALLBACK_CARDS[i]?.image || '',
          href: `/listings?type=${t.slug}`,
        }))
      : FALLBACK_CARDS;
    return base.map((c, i) => ({ ...c, ...LAYOUT[i] }));
  }, [types]);

  const row1 = cards.slice(0, 2);
  const row2 = cards.slice(2, 4);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const items = section.querySelectorAll<HTMLElement>('.collection-card');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); }),
      { threshold: 0.06 }
    );
    items.forEach(item => {
      item.classList.add('section-fade-up');
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, [cards.length]);

  return (
    <section ref={ref} className="bg-surface-low py-16 md:py-32 px-5 md:px-8">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-hc-secondary" />
              <span className="font-label text-xs tracking-[0.4em] text-hc-secondary uppercase">Curated for you</span>
            </div>
            <h2 className="font-headline text-hc-primary text-3xl md:text-5xl leading-tight">
              Our Collections
            </h2>
          </div>
          <Link
            to="/listings"
            className="flex items-center gap-2 text-hc-secondary md:text-hc-primary font-bold hover:gap-3 transition-all group shrink-0 text-sm font-body"
          >
            View All Categories
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Desktop: asymmetric rows */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5 lg:h-[420px]">
            {row1.map((c, i) => (
              <CollectionCard key={c.label} {...c} index={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:h-[420px]">
            {row2.map((c, i) => (
              <CollectionCard key={c.label} {...c} index={i + 2} />
            ))}
          </div>
        </div>

        {/* Mobile: 2x2 equal grid */}
        <div className="md:hidden grid grid-cols-2 gap-4">
          {cards.map((c) => (
            <Link
              key={c.label}
              to={c.href}
              className="collection-card group relative overflow-hidden rounded-2xl aspect-square block"
            >
              <img
                src={c.image}
                alt={c.title}
                className="absolute inset-0 w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <span className="self-start bg-white/90 text-hc-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-body">
                  {c.label}
                </span>
                <h3 className="font-headline text-white text-lg font-bold leading-snug">
                  {c.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
