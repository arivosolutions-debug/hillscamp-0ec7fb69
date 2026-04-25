import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, ChevronRight } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { CardSlideshow } from "@/components/shared/CardSlideshow";

const FALLBACK_CARDS = [
  {
    image: "/lovable-uploads/d9024755-5800-41b6-9aaa-b2133b6d9f87.jpg",
    images: ["/lovable-uploads/d9024755-5800-41b6-9aaa-b2133b6d9f87.jpg"],
    badge: "Canopy Retreat",
    district: "Wayanad",
    name: "Canopy at Vythiri",
    guests: "2 Guests",
    amenity: "Jungle Canopy",
    slug: "canopy-vythiri",
  },
  {
    image: "https://images.unsplash.com/photo-1587922546307-776227941871?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1587922546307-776227941871?w=800&q=80"],
    badge: "Floating Villa",
    district: "Alleppey",
    name: "Kettuvallam on the Backwaters",
    guests: "4 Guests",
    amenity: "Private Deck",
    slug: "kettuvallam-alleppey",
  },
  {
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80"],
    badge: "Planter's Legacy",
    district: "Munnar",
    name: "Silver Oak Estate",
    guests: "2 Guests",
    amenity: "Tea Plantation",
    slug: "silver-oak-munnar",
  },
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
    badge: "Heritage Bungalow",
    district: "Kannur",
    name: "Pallikkunnu Bungalow",
    guests: "6 Guests",
    amenity: "Heritage Grounds",
    slug: "pallikkunnu-kannur",
  },
];

export const FeaturedRetreats: React.FC = () => {
  const { data: properties } = useProperties({ featured: true });
  const ref = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(false);

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
  }, [properties]);

  // One-time mobile peek nudge: scroll right then return so users see there's more
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 768px)").matches) return;
    const el = scrollRef.current;
    if (!el) return;
    const nudge = window.setTimeout(() => {
      setShowSwipeHint(true);
      el.scrollTo({ left: 60, behavior: "smooth" });
      window.setTimeout(() => {
        el.scrollTo({ left: 0, behavior: "smooth" });
      }, 550);
      window.setTimeout(() => {
        setShowSwipeHint(false);
      }, 1800);
    }, 700);
    return () => window.clearTimeout(nudge);
  }, [properties]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  const cards =
    properties && properties.length > 0
      ? properties.slice(0, 4).map((p) => ({
          image: p.cover_image ?? "/placeholder.svg",
          images: [
            p.cover_image ?? undefined,
            ...(((p as any).gallery_images ?? []) as string[]),
          ].filter((s): s is string => Boolean(s)),
          badge: p.property_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          district: p.district.charAt(0).toUpperCase() + p.district.slice(1),
          name: p.name,
          guests: `${p.max_guests} Guests`,
          amenity: p.highlights?.[0] ?? "Luxury Stay",
          slug: p.slug,
          min_price: (p as any).min_price ?? null,
        }))
      : FALLBACK_CARDS;

  const CardContent = ({ card }: { card: (typeof cards)[0] }) => (
    <Link
      to={`/property/${card.slug}`}
      className="retreat-card bg-hc-bg-alt rounded-2xl overflow-hidden group block flex flex-col"
    >
      <div className="relative overflow-hidden rounded-2xl">
        <div className="w-full h-[280px] md:h-[280px] aspect-[4/3] md:aspect-auto">
          <CardSlideshow
            images={card.images && card.images.length > 0 ? card.images : [card.image]}
            alt={card.name}
          />
        </div>
        <span className="absolute top-3 left-4 z-20 bg-hc-bg/90 backdrop-blur-sm text-hc-primary text-xs font-bold uppercase tracking-tight px-3 py-1 rounded-full font-body">
          {card.badge}
        </span>
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <p className="text-hc-secondary text-xs font-bold uppercase tracking-[0.2em] mb-1 font-body">
          {card.district}, Kerala
        </p>
        <h3 className="font-headline text-hc-primary text-lg md:text-xl mb-3 group-hover:text-hc-secondary transition-colors duration-200 leading-snug">
          {card.name}
        </h3>
        <div className="flex items-center gap-4 text-sm text-hc-text mb-4 font-body">
          <span className="flex items-center gap-1.5">
            <Users size={13} strokeWidth={1.75} />
            {card.guests}
          </span>
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-hc-primary font-bold tracking-tight text-sm font-body">
            {(card as any).min_price != null
              ? `Price Starting from ₹${(card as any).min_price.toLocaleString("en-IN")}`
              : "Contact for Pricing"}
          </span>
          <ArrowRight
            size={14}
            className="text-hc-primary group-hover:translate-x-1 transition-transform duration-200"
          />
        </div>
      </div>
    </Link>
  );

  return (
    <section ref={ref} className="bg-hc-bg px-5 md:px-2 pb-0 md:pt-1 md:pb-10 pt-[5px]">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 md:gap-6 mb-6 md:mb-16">
          <div>
            <h2 className="font-headline text-hc-primary text-3xl md:text-5xl mb-1 md:mb-4">Featured Retreats</h2>
            <p className="text-hc-text text-base md:text-lg max-w-xl hidden md:block">
              From the heights of Wayanad to the tranquil backwaters, find your perfect escape.
            </p>
          </div>
          <Link
            to="/listings"
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
          <div className="relative">
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
            <div
              className={`pointer-events-none absolute top-[120px] right-3 flex items-center gap-1 bg-hc-primary/85 backdrop-blur-sm text-hc-bg text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full font-body transition-opacity duration-500 ${
                showSwipeHint ? "opacity-100" : "opacity-0"
              }`}
            >
              Swipe
              <ChevronRight size={12} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
