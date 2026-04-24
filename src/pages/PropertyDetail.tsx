import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Leaf, MessageCircle, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { PhotoGallery } from '@/components/property/PhotoGallery';
import { AmenitiesSidebar } from '@/components/property/AmenitiesSidebar';
import { RoomTypesList } from '@/components/property/RoomTypesList';
import { NearbyAttractions } from '@/components/property/NearbyAttractions';
import { MapEmbed } from '@/components/property/MapEmbed';
import { WhatsAppWidget } from '@/components/property/WhatsAppWidget';
import { MobileHeroSlideshow } from '@/components/property/MobileHeroSlideshow';
import { MobileGalleryButton } from '@/components/property/MobileGalleryButton';
import { MobileRoomCards } from '@/components/property/MobileRoomCards';
import { BookNowModal } from '@/components/property/BookNowModal';
import { AmenitiesGrid } from '@/components/property/AmenitiesGrid';
import { GettingThereMobile } from '@/components/property/GettingThereMobile';
import { HighlightsAccordion, TermsAccordion } from '@/components/property/PropertyAccordion';
import { SimilarStays } from '@/components/property/SimilarStays';
import { PropertyReviews } from '@/components/property/PropertyReviews';
import { useProperty } from '@/hooks/useProperty';
import { DISTRICT_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/types';
import { Helmet } from 'react-helmet-async';
import { ShareSheet } from '@/components/shared/ShareSheet';

const WHATSAPP_PHONE = '919847012345';

const PropertyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: property, isLoading, error } = useProperty(slug);
  const [mobileGalleryOpen, setMobileGalleryOpen] = React.useState(false);

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

  if (error || !property) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-hc-bg flex flex-col items-center justify-center gap-4">
          <h1 className="font-headline text-4xl text-hc-primary">Retreat not found</h1>
          <Link to="/listings" className="font-body text-hc-secondary hover:underline">← Back to all retreats</Link>
        </div>
      </>
    );
  }

  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in ${property.name} at Hills Camp Kerala.`);
  const whatsappHref = `https://wa.me/${WHATSAPP_PHONE}?text=${whatsappMsg}`;
  const districtLabel = DISTRICT_LABELS[property.district];
  const amenityNames = property.amenities.map(a => a.name);

  return (
    <>
        <Helmet>
          <title>{property.name} — Hills Camp Kerala</title>
          <meta property="og:title" content={`${property.name} — Hills Camp Kerala`} />
          <meta property="og:description" content={property.description ?? 'A luxury wilderness retreat in Kerala\'s Western Ghats.'} />
          {property.cover_image && (
            <meta property="og:image" content={property.cover_image} />
          )}
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${property.name} — Hills Camp Kerala`} />
          <meta name="twitter:description" content={property.description ?? 'A luxury wilderness retreat in Kerala\'s Western Ghats.'} />
          {property.cover_image && (
            <meta name="twitter:image" content={property.cover_image} />
          )}
        </Helmet>
      <Navbar />
      <PageTransition>
        <main className="bg-hc-bg">

          {/* ═══════════════════ MOBILE LAYOUT ═══════════════════ */}

          {/* 1. Mobile Hero Slideshow */}
          <MobileHeroSlideshow
            coverImage={property.cover_image}
            images={property.property_images}
            propertyName={property.name}
            location={property.location}
            maxGuests={property.max_guests}
            amenityNames={amenityNames}
            onImageClick={() => setMobileGalleryOpen(true)}
          />

          {/* 2. Gallery Icon Button */}
          <MobileGalleryButton
            coverImage={property.cover_image}
            images={property.property_images}
            propertyName={property.name}
            open={mobileGalleryOpen}
            onOpenChange={setMobileGalleryOpen}
          />

          {/* 3. Mobile Share Row */}
          <div className="md:hidden flex items-center justify-between px-5 pt-3 pb-1">
            <span className="font-body text-xs text-hc-text-light uppercase tracking-widest">
              Share this retreat
            </span>
            <ShareSheet title={property.name} variant="pill" />
          </div>

          {/* 3. Description (mobile) */}
          <div className="md:hidden px-5 mt-6">
            <MarkdownContent source={property.description} size="base" className="text-[#424842]" />
          </div>

          {/* 4. Rooms (mobile) */}
          <MobileRoomCards rooms={property.room_types} coverImage={property.cover_image} />

          {/* 5. Book Now (mobile only, above amenities) */}
          <div className="md:hidden">
            <BookNowModal propertyName={property.name} phone={WHATSAPP_PHONE} rooms={property.room_types} />
          </div>

          {/* 6. Amenities (mobile) */}
          <div className="md:hidden">
            <AmenitiesGrid amenities={property.amenities} />
          </div>

          {/* 7a. Nearby Attractions (mobile) */}
          <div className="md:hidden">
            <NearbyAttractions attractions={property.nearby_attractions} />
          </div>

          {/* 7b. Getting There (mobile) */}
          <GettingThereMobile
            latitude={property.latitude}
            longitude={property.longitude}
            district={districtLabel}
            nearestAirport={property.nearest_airport}
            nearestAirportDistance={property.nearest_airport_distance}
            nearestRailway={property.nearest_railway}
            nearestRailwayDistance={property.nearest_railway_distance}
            travelTips={property.travel_tips}
          />

          {/* ═══════════════════ DESKTOP LAYOUT ═══════════════════ */}

          {/* Desktop Header */}
          <section className="hidden md:block pt-28 pb-6 px-8 max-w-[1280px] mx-auto">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 text-hc-text-light hover:text-hc-primary font-body text-sm mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> All Retreats
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="bg-hc-accent-light text-[#360f00] text-xs font-bold uppercase tracking-tight px-3 py-1 rounded-full font-body">
                    {PROPERTY_TYPE_LABELS[property.property_type]}
                  </span>
                  {(property.location || districtLabel) && (
                    <span className="text-sm text-hc-text flex items-center gap-1 font-body">
                      <MapPin size={12} strokeWidth={1.5} /> {property.location || districtLabel}
                    </span>
                  )}
                </div>
                <div className="flex items-start gap-4">
                  <h1 className="font-headline text-hc-primary text-4xl md:text-6xl tracking-tight mb-3 flex-1">
                    {property.name}
                  </h1>
                  <div className="pt-2 shrink-0">
                    <ShareSheet title={property.name} variant="icon" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm text-hc-text font-body">
                  <span className="flex items-center gap-1.5">
                    <Users size={16} strokeWidth={1.5} /> Up to {property.max_guests} Guests
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Desktop Photo Gallery */}
          <section className="hidden md:block px-8 max-w-[1280px] mx-auto mb-12">
            <PhotoGallery
              coverImage={property.cover_image}
              images={property.property_images}
              propertyName={property.name}
            />
          </section>

          {/* Desktop Description */}
          <section className="hidden md:block px-8 max-w-[1280px] mx-auto mb-10">
            <MarkdownContent source={property.description} size="lg" />
          </section>

          {/* Desktop Rooms */}
          <section className="hidden md:block px-8 max-w-[1280px] mx-auto">
            <RoomTypesList rooms={property.room_types} coverImage={property.cover_image} />
          </section>

          {/* Desktop Book Now */}
          <section className="hidden md:flex justify-center px-8 max-w-[1280px] mx-auto mb-12">
            <div className="w-1/2">
              <BookNowModal propertyName={property.name} phone={WHATSAPP_PHONE} rooms={property.room_types} />
            </div>
          </section>

          {/* Desktop Amenities */}
          <section className="hidden md:block px-8 max-w-[1280px] mx-auto mb-12">
            <AmenitiesGrid amenities={property.amenities} />
          </section>

          {/* Desktop Nearby Attractions */}
          <section className="hidden md:block px-8 max-w-[1280px] mx-auto mb-12">
            <NearbyAttractions attractions={property.nearby_attractions} />
          </section>

          {/* Desktop Map */}
          <section className="hidden md:block px-8 max-w-[1280px] mx-auto mb-12">
            <MapEmbed
              latitude={property.latitude}
              longitude={property.longitude}
              district={districtLabel}
              nearestAirport={property.nearest_airport}
              nearestAirportDistance={property.nearest_airport_distance}
              nearestRailway={property.nearest_railway}
              nearestRailwayDistance={property.nearest_railway_distance}
              travelTips={property.travel_tips}
            />
          </section>

          {/* Accordions (both) */}
          <div className="mt-10 md:px-8 md:max-w-[1280px] md:mx-auto">
            <HighlightsAccordion highlights={property.highlights} />
            <TermsAccordion terms={property.terms_conditions ?? null} />
          </div>

          {/* Guest Reviews */}
          <div className="md:px-8 md:max-w-[1280px] md:mx-auto">
            <PropertyReviews propertyId={property.id} />
          </div>

          {/* Similar Stays */}
          <div className="mb-16">
            <SimilarStays
              currentSlug={property.slug}
              district={property.district}
              propertyType={property.property_type}
            />
          </div>
        </main>

        <Footer />
      </PageTransition>


    </>
  );
};

export default PropertyDetail;
