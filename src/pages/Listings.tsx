import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { FilterBar } from '@/components/listings/FilterBar';
import { PropertyGrid } from '@/components/listings/PropertyGrid';
import { useProperties } from '@/hooks/useProperties';
import type { District, PropertyType } from '@/lib/types';
import listingsHeroBg from '@/assets/listings-hero-bg.jpg';

const PAGE_SIZE = 6;

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [location, setLocation] = useState<string>(searchParams.get('location') ?? searchParams.get('district') ?? '');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>((searchParams.get('type') as PropertyType) ?? '');
  const [guests, setGuests] = useState<number>(Number(searchParams.get('guests')) || 2);
  const [page, setPage] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const filterSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocation(searchParams.get('location') ?? searchParams.get('district') ?? '');
    setPropertyType((searchParams.get('type') as PropertyType) ?? '');
    setGuests(Number(searchParams.get('guests')) || 2);
    setPage(0);
  }, [searchParams]);

  // Intersection observer for sticky filter bar
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

  const { data: properties, isLoading } = useProperties({
    location: location || undefined,
    property_type: propertyType || undefined,
    max_guests: guests > 1 ? guests : undefined,
  });

  const totalPages = Math.ceil((properties?.length ?? 0) / PAGE_SIZE);
  const paged = properties?.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) ?? [];

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="min-h-screen bg-hc-bg">
          {/* Hero Section */}
          <section ref={heroRef} className="relative h-[calc(40vh+80px)] md:h-[calc(50vh+80px)] overflow-hidden rounded-b-[32px]">
            <img
              src={listingsHeroBg}
              alt="Misty Kerala mountains"
className="absolute inset-0 w-full h-full object-cover scale-[1.15]"
              style={{ objectPosition: 'calc(50% + 25px) calc(50% - 20px)' }}
              width={1920}
              height={1080}
            />

            {/* Hero Content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-8 max-w-[1280px] mx-auto pb-20 md:pb-24 pt-[55px]">
              <h1 className="font-headline text-3xl md:text-7xl leading-none mb-2 font-bold text-primary">
                Discover<br />
                <span className="italic font-normal">Your Escape</span>
              </h1>
              <p className="text-sm md:text-base text-white/70 mt-2 font-body font-semibold">
                A curated stays made just for you!
              </p>
            </div>

            {/* Filter bar sentinel — marks where filter bar originally sits */}
            <div ref={filterSentinelRef} className="absolute bottom-0 left-0 right-0 h-1" />

            {/* Filter bar inside hero, overlapping bottom */}
            {!isSticky && (
              <div className="absolute bottom-[70px] left-0 right-0 translate-y-1/2 z-30 px-5 md:px-8">
                <div className="max-w-[1280px] mx-auto opacity-80">
                  <FilterBar
                    location={location}
                    propertyType={propertyType}
                    guests={guests}
                    onLocation={(v) => { setLocation(v); setPage(0); }}
                    onPropertyType={(v) => { setPropertyType(v); setPage(0); }}
                    onGuests={(v) => { setGuests(v); setPage(0); }}
                    totalCount={properties?.length}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Sticky filter bar */}
          {isSticky && (
            <div className="sticky top-[72px] z-40 px-5 md:px-8">
              <div className="max-w-[1280px] mx-auto">
                <FilterBar
                  location={location}
                  propertyType={propertyType}
                  guests={guests}
                  onLocation={(v) => { setLocation(v); setPage(0); }}
                  onPropertyType={(v) => { setPropertyType(v); setPage(0); }}
                  onGuests={(v) => { setGuests(v); setPage(0); }}
                  totalCount={properties?.length}
                  isSticky
                />
              </div>
            </div>
          )}

          {/* Spacer for filter bar overlap */}
          

          {/* Showing count */}
          {!isLoading && properties && (
            <p className="text-center font-headline italic text-sm text-hc-secondary underline mt-4 mb-6 text-primary">
              Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
            </p>
          )}

          {/* Grid */}
          <section className="px-5 md:px-8 max-w-[1280px] mx-auto pb-12">
            <PropertyGrid properties={paged} isLoading={isLoading} />

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

export default Listings;
