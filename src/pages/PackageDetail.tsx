import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  IndianRupee,
  Route,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Images,
  MessageCircle,
  Instagram,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { MobileHeroSlideshow } from "@/components/property/MobileHeroSlideshow";
import { MobileGalleryButton } from "@/components/property/MobileGalleryButton";
import { PhotoGallery } from "@/components/property/PhotoGallery";
import { usePackage } from "@/hooks/usePackage";
import { ShareSheet } from "@/components/shared/ShareSheet";
import { usePackages } from "@/hooks/usePackages";
import type { PropertyImage } from "@/lib/types";
import { PropertyReviews } from "@/components/property/PropertyReviews";
import { ImageLightbox } from "@/components/property/ImageLightbox";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { SeoHead } from "@/components/shared/SeoHead";
import { ogImageUrl } from "@/lib/ogImage";

const WHATSAPP_PHONE = "917510810961";

/* ─── Itinerary Day type ─── */
interface ItineraryDay {
  day: number;
  title: string;
  subtitle: string;
  description: string;
  image?: string | null;
}

/* ═══════════════════════════════════════════════════════════════ */
/*  PackageDetail Page                                            */
/* ═══════════════════════════════════════════════════════════════ */

const PackageDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: pkg, isLoading, error } = usePackage(slug);

  /* ── Loading ── */
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

  /* ── 404 ── */
  if (error || !pkg) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-hc-bg flex flex-col items-center justify-center gap-4">
          <h1 className="font-headline text-4xl text-hc-primary">Experience not found</h1>
          <Link to="/packages" className="font-body text-hc-secondary hover:underline">
            ← Back to all experiences
          </Link>
        </div>
      </>
    );
  }

  const allImages = [...(pkg.hero_images ?? []), ...(pkg.gallery ?? []).map((g) => g.image_url)].filter(Boolean);

  // Adapt images for property components: first image as cover, rest as PropertyImage[]
  const coverImage = allImages[0] ?? null;
  const propertyImages: PropertyImage[] = allImages.slice(1).map((url, i) => ({
    id: `pkg-img-${i}`,
    image_url: url,
    alt_text: `${pkg.name} — ${i + 2}`,
    sort_order: i,
    property_id: null,
    created_at: null,
  }));

  const coords = pkg.coordinates as { lat?: number; lng?: number } | null;
  const lat = coords?.lat ?? 10.0;
  const lng = coords?.lng ?? 76.5;
  const itinerary: ItineraryDay[] = Array.isArray(pkg.itinerary) ? pkg.itinerary : [];

  const ogImage = pkg.slug ? ogImageUrl('package', pkg.slug) : null;
  const ogDescription =
    (pkg as { tagline?: string | null }).tagline ||
    (pkg as { description?: string | null }).description ||
    (itinerary[0]?.description ?? null);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.name,
    description: ogDescription ?? undefined,
    image: ogImage ?? undefined,
    touristType: pkg.tags ?? undefined,
    itinerary: itinerary.map((d) => ({
      '@type': 'ListItem',
      position: d.day,
      name: d.title,
    })),
    ...(pkg.price_inr
      ? {
          offers: {
            '@type': 'Offer',
            price: pkg.price_inr,
            priceCurrency: 'INR',
          },
        }
      : {}),
  };

  return (
    <>
      <SeoHead
        title={pkg.name}
        description={ogDescription}
        image={ogImage}
        type="product"
        jsonLd={jsonLd}
      />
      <Navbar />
      <PageTransition>
        <main className="bg-hc-bg">
          {/* ═══ MOBILE LAYOUT ═══ */}
          <MobileHeroSlideshow
            coverImage={coverImage}
            images={propertyImages}
            propertyName={pkg.name}
            location={pkg.location ?? ""}
            maxGuests={0}
            amenityNames={pkg.tags ?? []}
            backLink="/packages"
            backLabel="All Experiences"
          />
          <MobileGalleryButton coverImage={coverImage} images={propertyImages} propertyName={pkg.name} />

          {/* Mobile Share Row */}
          <div className="md:hidden flex items-center justify-between px-5 pt-3 pb-1">
            <span className="font-body text-xs text-hc-text-light uppercase tracking-widest">
              Share this experience
            </span>
            <ShareSheet title={pkg.name} variant="pill" />
          </div>

          {/* ═══ DESKTOP LAYOUT ═══ */}
          {/* Desktop Header */}
          <section className="hidden md:block pt-28 pb-6 px-8 max-w-[1280px] mx-auto">
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 text-hc-text-light hover:text-hc-primary font-body text-sm mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> All Experiences
            </Link>
            <div className="flex items-start gap-4">
              <h1 className="font-headline text-hc-primary text-4xl md:text-6xl tracking-tight mb-3 flex-1">
                {pkg.name}
              </h1>
              <div className="pt-2 shrink-0">
                <ShareSheet title={pkg.name} variant="icon" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-hc-text font-body">
              {pkg.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} strokeWidth={1.5} className="text-hc-secondary" /> {pkg.location}
                </span>
              )}
              {pkg.duration_days && pkg.duration_nights && (
                <span>
                  {pkg.duration_days} Days / {pkg.duration_nights} Nights
                </span>
              )}
            </div>
          </section>

          {/* Desktop Photo Gallery */}
          <section className="hidden md:block px-8 max-w-[1280px] mx-auto mb-12">
            <PhotoGallery coverImage={coverImage} images={propertyImages} propertyName={pkg.name} />
          </section>

          {/* Stats Section */}
          <section className="px-5 md:px-8 max-w-[1280px] mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={<Clock size={20} className="text-hc-secondary" />}
                label="Duration"
                value={
                  pkg.duration_days && pkg.duration_nights
                    ? `${pkg.duration_days} Days & ${pkg.duration_nights} Nights`
                    : "—"
                }
              />
              <StatCard
                icon={<IndianRupee size={20} className="text-hc-secondary" />}
                label="Cost"
                value={pkg.price_inr ? `₹${pkg.price_inr.toLocaleString("en-IN")} per person` : "Contact us"}
              />
              <StatCard
                icon={<Route size={20} className="text-hc-secondary" />}
                label="Distance Covered"
                value={pkg.distance_km ? `${pkg.distance_km} km` : "—"}
              />
            </div>
          </section>

          {/* Book Now */}
          <BookNowSection packageName={pkg.name} />

          {/* Trip Itinerary */}
          {itinerary.length > 0 && (
            <section className="px-5 md:px-8 max-w-[1280px] mx-auto py-10">
              <h2 className="font-headline text-hc-primary text-3xl mb-6">Trip Itinerary</h2>
              <div className="space-y-0">
                {itinerary.map((day) => (
                  <ItineraryAccordion key={day.day} day={day} />
                ))}
              </div>
            </section>
          )}

          {/* Getting There */}
          <section className="px-5 md:px-8 max-w-[1280px] mx-auto py-10">
            <h2 className="font-headline text-hc-primary text-3xl mb-2">Getting There</h2>
            <p className="text-sm text-hc-text font-body mb-4 tabular-nums">
              <MapPin size={13} className="inline mr-1 text-hc-secondary" />
              {lat.toFixed(6)}, {lng.toFixed(6)}
            </p>
            <div className="rounded-2xl overflow-hidden border border-hc-text-light/10">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${(lng - 0.08).toFixed(4)}%2C${(lat - 0.08).toFixed(4)}%2C${(lng + 0.08).toFixed(4)}%2C${(lat + 0.08).toFixed(4)}&layer=mapnik&marker=${lat}%2C${lng}`}
                title="Package location"
                className="w-full h-[250px] md:h-[300px]"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </section>

          {/* Instagram */}
          {pkg.instagram_hashtag && (
            <section className="px-5 md:px-8 max-w-[1280px] mx-auto py-10 text-center">
              <Instagram size={28} className="mx-auto text-hc-secondary mb-3" />
              <p className="font-headline text-hc-primary text-2xl mb-1">#{pkg.instagram_hashtag}</p>
              <p className="text-sm text-hc-text-light font-body">tag us to get featured</p>
              <div className="mt-6 grid grid-cols-3 gap-3 max-w-md mx-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square rounded-xl bg-hc-bg-alt flex items-center justify-center">
                    <Instagram size={20} className="text-hc-text-light/30" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-hc-text-light/50 font-body mt-3">Posts coming soon</p>
            </section>
          )}

          {/* What's Not Included & Terms */}
          <section className="px-5 md:px-8 max-w-[1280px] mx-auto pb-6">
            {pkg.whats_included && pkg.whats_included.length > 0 && (
              <CollapsibleList title="What's Included" items={pkg.whats_included} />
            )}
            {pkg.whats_not_included && pkg.whats_not_included.length > 0 && (
              <CollapsibleList title="What's Not Included" items={pkg.whats_not_included} />
            )}
            {pkg.highlights && pkg.highlights.length > 0 && (
              <CollapsibleList title="Highlights" items={pkg.highlights} />
            )}
            {pkg.terms_conditions && pkg.terms_conditions.length > 0 && (
              <CollapsibleList title="Terms & Conditions" items={pkg.terms_conditions} renderAsMarkdown />
            )}
          </section>

          {/* Guest Reviews */}
          <section className="px-5 md:px-8 max-w-[1280px] md:mx-auto">
            <PropertyReviews packageId={pkg.id} />
          </section>

          {/* Similar Packages */}
          <SimilarPackages currentSlug={pkg.slug} region={pkg.region} tags={pkg.tags} />
        </main>
        <Footer />
      </PageTransition>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Sub-Components                                                */
/* ═══════════════════════════════════════════════════════════════ */

/* ── Stat Card ── */
const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-hc-bg-alt rounded-2xl p-6 flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-hc-bg flex items-center justify-center shrink-0">{icon}</div>
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-hc-text-light font-body mb-1">{label}</p>
      <p className="font-headline text-hc-primary text-lg leading-snug">{value}</p>
    </div>
  </div>
);

/* ── Book Now Section ── */
const BookNowSection: React.FC<{ packageName: string }> = ({ packageName }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);

  const handleSubmit = () => {
    const msg = encodeURIComponent(
      `Hi, I'm interested in the "${packageName}" experience.\nName: ${name}\nPhone: ${phone}\nGuests: ${guests}`,
    );
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`, "_blank");
    setOpen(false);
  };

  return (
    <div className="px-5 md:px-8 max-w-[1280px] mx-auto">
      <button
        onClick={() => setOpen(!open)}
        className="w-full md:w-auto md:mx-auto md:flex md:px-16 bg-hc-secondary text-white rounded-full py-4 text-lg font-bold font-body hover:brightness-110 transition-all flex items-center justify-center gap-2"
      >
        Book Now <ArrowRight size={18} />
      </button>

      {open && (
        <div className="mt-4 bg-hc-bg-alt rounded-2xl p-6 max-w-lg mx-auto animate-accordion-down">
          <h2 className="font-headline text-2xl text-hc-primary mb-1">Book This Experience</h2>
          <p className="font-headline italic text-hc-secondary text-sm mb-5">{packageName}</p>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white rounded-xl px-4 py-3 text-sm font-body text-hc-text placeholder:text-hc-text/50 outline-none focus:ring-2 focus:ring-hc-primary/20"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white rounded-xl px-4 py-3 text-sm font-body text-hc-text placeholder:text-hc-text/50 outline-none focus:ring-2 focus:ring-hc-primary/20"
            />
            <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-body text-hc-text/50">Number of Guests</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="w-8 h-8 rounded-full bg-hc-bg-alt flex items-center justify-center text-hc-primary font-bold"
                >
                  −
                </button>
                <span className="font-body font-bold text-hc-text w-6 text-center">{guests}</span>
                <button
                  onClick={() => setGuests((g) => g + 1)}
                  className="w-8 h-8 rounded-full bg-hc-bg-alt flex items-center justify-center text-hc-primary font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#25D366] text-white rounded-full py-4 font-bold font-body mt-5 flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle size={18} /> Confirm via WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};

/* ── Itinerary Accordion ── */
const ItineraryAccordion: React.FC<{ day: ItineraryDay }> = ({ day }) => {
  const [open, setOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div className="border-t border-hc-text-light/15">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-4 w-full py-5 text-left">
        <span className="font-headline text-3xl text-hc-secondary/30 w-12 shrink-0 tabular-nums">
          {String(day.day).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-headline text-hc-primary text-lg leading-snug">{day.title}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-hc-text-light font-body mt-0.5">{day.subtitle}</p>
        </div>
        <Plus
          size={20}
          className={`text-hc-primary shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? "900px" : "0px" }}
      >
        <div className="pl-16 pr-4 pb-5">
          {day.image && (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="block w-full max-w-2xl mb-4 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-hc-secondary"
              aria-label={`View Day ${day.day} photo fullscreen`}
            >
              <img
                src={day.image}
                alt={`Day ${day.day} — ${day.title}`}
                className="w-full object-cover aspect-[16/9] cursor-zoom-in"
                loading="lazy"
              />
            </button>
          )}
          <MarkdownContent source={day.description} size="sm" className="text-hc-text" />
        </div>
      </div>
      {lightboxOpen && day.image && (
        <ImageLightbox
          images={[day.image]}
          index={0}
          title={`Day ${day.day} — ${day.title}`}
          onClose={() => setLightboxOpen(false)}
          onNavigate={() => {}}
        />
      )}
    </div>
  );
};

/* ── Collapsible List ── */
const CollapsibleList: React.FC<{ title: string; items: string[]; renderAsMarkdown?: boolean }> = ({ title, items, renderAsMarkdown }) => {
  const [open, setOpen] = useState(false);
  const asMarkdown = renderAsMarkdown && items.length === 1;
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState(0);

  useEffect(() => {
    if (!open) {
      setMaxH(0);
      return;
    }
    const el = contentRef.current;
    if (!el) return;
    const update = () => setMaxH(el.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  return (
    <div className="border-t border-hc-text-light/15">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center justify-between w-full py-4">
        <span className="font-headline text-hc-primary text-lg">{title}</span>
        <Plus size={20} className={`text-hc-primary transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: `${maxH}px` }}
      >
        <div ref={contentRef}>
          {asMarkdown ? (
            <div className="pb-5">
              <MarkdownContent source={items[0]} size="sm" />
            </div>
          ) : (
            <ul className="pb-5 space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-hc-text font-body">
                  <span className="text-hc-secondary mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Similar Packages ── */
const SimilarPackages: React.FC<{ currentSlug: string; region: string | null; tags: string[] | null }> = ({
  currentSlug,
  region,
  tags,
}) => {
  const { data: allPackages } = usePackages();

  const similar = (allPackages ?? [])
    .filter((p) => {
      if (p.slug === currentSlug) return false;
      if (region && p.region === region) return true;
      if (tags && p.tags) return tags.some((t) => p.tags!.includes(t));
      return false;
    })
    .slice(0, 4);

  if (!similar.length) return null;

  return (
    <section className="py-10">
      <h2 className="font-headline text-hc-primary text-2xl px-5 md:px-8 mb-4">Similar Experiences</h2>

      {/* Mobile carousel */}
      <div className="md:hidden overflow-x-auto snap-x snap-mandatory hide-scrollbar px-5 flex gap-3">
        {similar.map((p) => (
          <Link
            key={p.slug}
            to={`/packages/${p.slug}`}
            className="flex-shrink-0 snap-start snap-always rounded-2xl overflow-hidden relative"
            style={{ width: "calc(50vw - 28px)" }}
          >
            <div className="aspect-[3/4] relative">
              <img
                src={p.hero_images?.[0] ?? "/placeholder.svg"}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {p.region && (
                <span className="absolute top-3 left-3 bg-[#17341e]/80 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-body">
                  {p.region}
                </span>
              )}
              <p className="absolute bottom-3 left-3 right-3 font-headline text-white text-sm font-bold leading-tight">
                {p.name}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-4 gap-4 px-8 max-w-[1280px] mx-auto">
        {similar.map((p) => (
          <Link key={p.slug} to={`/packages/${p.slug}`} className="rounded-2xl overflow-hidden relative group">
            <div className="aspect-[3/4] relative">
              <img
                src={p.hero_images?.[0] ?? "/placeholder.svg"}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {p.region && (
                <span className="absolute top-3 left-3 bg-[#17341e]/80 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-body">
                  {p.region}
                </span>
              )}
              <p className="absolute bottom-3 left-3 right-3 font-headline text-white text-sm font-bold leading-tight">
                {p.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PackageDetail;
