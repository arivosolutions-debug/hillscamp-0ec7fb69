import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { usePackages } from '@/hooks/usePackages';
import { MapPin, ArrowRight, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import experiencesHeroBg from '@/assets/experiences-hero-bg.jpg';

const PAGE_SIZE = 8;

const Packages: React.FC = () => {
  const [region, setRegion] = useState('');
  const [page, setPage] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const filterSentinelRef = useRef<HTMLDivElement>(null);

  const { data: packages, isLoading } = usePackages({
    region: region || undefined,
  });

  useEffect(() => setPage(0), [region]);

  // Sticky observer
  useEffect(() => {
    const sentinel = filterSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-72px 0px 0px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const totalPages = Math.ceil((packages?.length ?? 0) / PAGE_SIZE);
  const paged = packages?.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) ?? [];

  const filterBar = (
    <div className={`bg-[#17341e]/80 backdrop-blur-xl rounded-2xl px-6 py-4 flex items-center justify-between gap-4 ${isSticky ? '' : ''}`}>
      <div className="flex items-center gap-6">
        <span className="text-[10px] font-body uppercase tracking-[0.2em] text-secondary-foreground">Locations</span>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="bg-transparent text-white font-body text-sm border-none outline-none cursor-pointer appearance-none pr-4"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
        >
          <option value="" className="text-black">All Regions</option>
          <option value="South India" className="text-black">South India</option>
          <option value="North India" className="text-black">North India</option>
        </select>
      </div>
      {!isLoading && packages && (
        <span className="text-xs font-body text-secondary-foreground">
          Showing {packages.length} {packages.length === 1 ? 'package' : 'packages'}
        </span>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="min-h-screen bg-hc-bg">
          {/* Hero Section */}
          <section ref={heroRef} className="relative h-[calc(40vh+80px)] md:h-[calc(50vh+80px)] overflow-hidden rounded-b-[32px]">
            <img
              src={experiencesHeroBg}
              alt="Trekkers in Western Ghats forest"
              className="absolute inset-0 w-full h-full object-cover object-bottom"
              style={{ objectPosition: 'calc(50% - 15px) calc(100% + 25px)', transform: 'scale(1.15)' }}
              width={1920}
              height={1080}
            />

            {/* Hero Content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-8 max-w-[1280px] mx-auto pb-20 md:pb-24 pt-[55px]">
              <h1 className="font-headline text-3xl md:text-7xl leading-none mb-2 font-bold text-secondary-foreground">
                Discover<br />
                <span className="italic font-normal">Your Experience</span>
              </h1>
              <p className="text-sm md:text-base text-white/70 mt-2 font-body font-semibold">
                Curated experiences made just for you!
              </p>
            </div>

            {/* Filter bar sentinel */}
            <div ref={filterSentinelRef} className="absolute bottom-0 left-0 right-0 h-1" />

            {/* Filter bar inside hero, overlapping bottom */}
            {!isSticky && (
              <div className="absolute bottom-[70px] left-0 right-0 translate-y-1/2 z-30 px-5 md:px-8">
                <div className="max-w-[1280px] mx-auto opacity-80">
                  {filterBar}
                </div>
              </div>
            )}
          </section>

          {/* Sticky filter bar */}
          {isSticky && (
            <div className="sticky top-[72px] z-40 px-5 md:px-8">
              <div className="max-w-[1280px] mx-auto">
                {filterBar}
              </div>
            </div>
          )}

          {/* Showing count */}
          {!isLoading && packages && (
            <p className="text-center font-headline italic text-sm text-hc-secondary underline mt-4 mb-6 text-primary">
              Showing {packages.length} {packages.length === 1 ? 'experience' : 'experiences'}
            </p>
          )}

          {/* Cards Grid */}
          <section className="px-5 md:px-8 max-w-[1280px] mx-auto pb-12">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/3] rounded-xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : paged.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-headline italic text-2xl text-hc-text/50">No experiences found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {paged.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => { setPage(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                      page === i
                        ? 'bg-hc-primary text-white'
                        : 'bg-transparent text-hc-primary border border-hc-text-light/30 hover:bg-hc-bg-alt'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </section>
        </main>
        <Footer />
      </PageTransition>
    </>
  );
};

/* ── Package Card ── */
interface PackageCardProps {
  pkg: {
    id: string;
    name: string;
    slug: string;
    location: string | null;
    duration_days: number | null;
    duration_nights: number | null;
    tags: string[] | null;
    hero_images: string[] | null;
    min_participants: number | null;
    max_participants: number | null;
  };
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  const image = pkg.hero_images?.[0] ?? '/placeholder.svg';
  const participants =
    pkg.min_participants != null && pkg.max_participants != null
      ? `${pkg.min_participants} to ${pkg.max_participants}`
      : pkg.max_participants != null
      ? `Up to ${pkg.max_participants}`
      : pkg.min_participants != null
      ? `${pkg.min_participants}+`
      : null;

  return (
    <Link
      to={`/packages/${pkg.slug}`}
      className="group block overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-[4/3] rounded-t-2xl overflow-hidden">
        <img
          src={image}
          alt={pkg.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Card body with light background and rounded bottom */}
      <div className="bg-surface-low rounded-b-2xl px-4 py-4">
        {/* Name */}
        <h3 className="font-headline text-lg text-hc-primary leading-snug mb-1">
          {pkg.name}
        </h3>

        {/* Location & Guests row */}
        <div className="flex items-center gap-3 text-hc-text-light text-xs font-body mb-2">
          {pkg.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {pkg.location}
            </span>
          )}
          {participants && (
            <span className="flex items-center gap-1">
              <Users size={12} />
              {participants}
            </span>
          )}
        </div>

        {/* Tags */}
        {pkg.tags && pkg.tags.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-3">
            {pkg.tags.map((tag) => (
              <span
                key={tag}
                className="shrink-0 bg-hc-secondary text-white text-[10px] font-body px-2.5 py-1 rounded-full capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Learn More */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-hc-text text-xs font-body font-medium">Learn More</span>
          <ArrowRight size={14} className="text-hc-secondary" />
        </div>
      </div>
    </Link>
  );
};

export default Packages;
