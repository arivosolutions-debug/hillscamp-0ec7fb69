import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { PropertyGrid } from '@/components/listings/PropertyGrid';
import { useProperties } from '@/hooks/useProperties';
import { SeoHead } from '@/components/shared/SeoHead';

export interface LocationFaq {
  q: string;
  a: string;
}

export interface LocationLandingProps {
  /** Free-text used to filter properties across location/district/tags/highlights. */
  locationQuery: string;
  /** Canonical URL path, e.g. "/wayanad-resorts". */
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: React.ReactNode;
  /** Short area-guide paragraphs (rendered below intro). */
  guide?: React.ReactNode;
  faqs: LocationFaq[];
  /** Display name used in headings/JSON-LD, e.g. "Wayanad". */
  placeName: string;
}

export const LocationLanding: React.FC<LocationLandingProps> = ({
  locationQuery,
  path,
  title,
  description,
  h1,
  intro,
  guide,
  faqs,
  placeName,
}) => {
  const { data: properties, isLoading } = useProperties({ location: locationQuery });
  const url = `https://hillscamp.com${path}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hillscamp.com/' },
          { '@type': 'ListItem', position: 2, name: 'Stays', item: 'https://hillscamp.com/listings' },
          { '@type': 'ListItem', position: 3, name: placeName, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <SeoHead title={title} description={description} url={url} jsonLd={jsonLd} />
      <Navbar />
      <PageTransition>
        <main className="min-h-screen bg-hc-bg">
          {/* Editorial intro */}
          <section className="px-6 md:px-8 max-w-[1100px] mx-auto pt-[120px] md:pt-32 pb-10">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-hc-primary/60 mb-4">
              Kerala · {placeName}
            </p>
            <h1 className="font-headline text-4xl md:text-6xl leading-[1.05] text-hc-primary mb-6">
              {h1}
            </h1>
            <div className="font-body text-base md:text-lg text-hc-primary/80 leading-relaxed max-w-[680px]">
              {intro}
            </div>
          </section>

          {/* Stays grid */}
          <section className="px-5 md:px-8 max-w-[1280px] mx-auto pb-16">
            <h2 className="font-headline text-2xl md:text-3xl text-hc-primary mb-6">
              Handpicked stays in {placeName}
            </h2>
            {!isLoading && (properties?.length ?? 0) === 0 ? (
              <p className="font-body text-hc-primary/70">
                We're curating new stays in {placeName}.{' '}
                <Link to="/listings" className="underline">
                  Browse all retreats
                </Link>{' '}
                in the meantime.
              </p>
            ) : (
              <PropertyGrid properties={properties ?? []} isLoading={isLoading} />
            )}
          </section>

          {/* Area guide */}
          {guide && (
            <section className="px-6 md:px-8 max-w-[900px] mx-auto pb-16">
              <h2 className="font-headline text-2xl md:text-3xl text-hc-primary mb-6">
                About {placeName}
              </h2>
              <div className="font-body text-base text-hc-primary/80 leading-relaxed space-y-4">
                {guide}
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="px-6 md:px-8 max-w-[900px] mx-auto pb-24">
            <h2 className="font-headline text-2xl md:text-3xl text-hc-primary mb-8">
              Frequently asked
            </h2>
            <dl className="space-y-8">
              {faqs.map((f) => (
                <div key={f.q}>
                  <dt className="font-headline text-lg md:text-xl text-hc-primary mb-2">
                    {f.q}
                  </dt>
                  <dd className="font-body text-base text-hc-primary/80 leading-relaxed">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </main>
        <Footer />
      </PageTransition>
    </>
  );
};

export default LocationLanding;