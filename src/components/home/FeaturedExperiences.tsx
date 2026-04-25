import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import { usePackages, type Package } from "@/hooks/usePackages";

export const FeaturedExperiences: React.FC = () => {
  const { data: packages } = usePackages({ featured: true });
  const ref = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const cards = (packages ?? []).slice(0, 4);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const items = section.querySelectorAll<HTMLElement>(".retreat-card");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in-view");
        }),
      { threshold: 0.08 },
    );
    items.forEach((item, i) => {
      item.classList.add("section-fade-up");
      item.style.transitionDelay = `${i * 80}ms`;
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, [packages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  if (cards.length === 0) return null;

  const CardContent = ({ card }: { card: Package }) => {
    const participants =
      card.min_participants != null && card.max_participants != null
        ? `${card.min_participants} to ${card.max_participants}`
        : card.max_participants != null
        ? `Up to ${card.max_participants}`
        : card.min_participants != null
        ? `${card.min_participants}+`
        : null;
    return (
    <Link
      to={`/packages/${card.slug}`}
      className="retreat-card bg-hc-bg-alt rounded-2xl overflow-hidden group block flex flex-col"
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={card.hero_images?.[0] ?? "/placeholder.svg"}
          alt={card.name}
          className="w-full h-[280px] md:h-[280px] aspect-[4/3] md:aspect-auto object-cover transition-transform duration-700 group-hover:scale-105 brightness-90 group-hover:brightness-100"
        />
        {card.duration_days != null && (
          <span className="absolute top-3 left-4 bg-hc-bg/90 backdrop-blur-sm text-hc-primary text-xs font-bold uppercase tracking-tight px-3 py-1 rounded-full font-body">
            {card.duration_days}D / {card.duration_nights}N
          </span>
        )}
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1">
        {card.location && (
          <p className="text-hc-secondary text-xs font-bold uppercase tracking-[0.2em] mb-1 font-body">
            {card.location}
          </p>
        )}
        <h3 className="font-headline text-hc-primary text-lg md:text-xl mb-3 group-hover:text-hc-secondary transition-colors duration-200 leading-snug">
          {card.name}
        </h3>
        {participants && (
          <div className="flex items-center gap-1 text-hc-text-light text-xs font-body mb-3">
            <Users size={12} />
            <span>{participants}</span>
          </div>
        )}
        {card.tags && card.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {card.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="bg-hc-accent-light text-hc-primary border border-hc-primary/10 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full font-body"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="font-bold text-hc-primary text-sm font-body">
            {card.price_inr != null
              ? `Price Starting from ₹${Number(card.price_inr).toLocaleString('en-IN')}`
              : 'Contact for Pricing'}
          </span>
          <ArrowRight
            size={14}
            className="text-hc-primary group-hover:translate-x-1 transition-transform duration-200"
          />
        </div>
      </div>
    </Link>
    );
  };

  return (
    <section ref={ref} className="bg-hc-bg px-5 md:px-8 pt-4 pb-8 md:pt-10 md:pb-10">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 md:gap-6 mb-6 md:mb-16">
          <div>
            <h2 className="font-headline text-hc-primary text-3xl md:text-5xl mb-1 md:mb-4">Featured Experiences</h2>
            <p className="text-hc-text text-base md:text-lg max-w-xl hidden md:block">
              Curated journeys through Kerala's wilderness — guided, immersive, unforgettable.
            </p>
          </div>
          <Link
            to="/experiences"
            className="text-hc-secondary md:text-hc-primary font-bold flex items-center gap-2 hover:gap-3 transition-all group shrink-0 text-sm"
          >
            View More
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card) => (
            <CardContent key={card.slug} card={card} />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 overscroll-x-contain pr-10"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {cards.map((card) => (
              <div key={card.slug} className="w-[80vw] shrink-0 snap-start" style={{ scrollSnapStop: "always" }}>
                <CardContent card={card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
