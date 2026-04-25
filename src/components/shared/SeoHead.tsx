import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Hills Camp Kerala';
const SITE_URL = 'https://hillscamp.com';
const DEFAULT_DESCRIPTION =
  "Luxury wilderness retreats and curated experiences in Kerala's Western Ghats.";

const truncate = (str: string, max = 160): string => {
  const clean = str.replace(/[#*_>`\-]/g, '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + '…';
};

interface SeoHeadProps {
  title: string;
  description?: string | null;
  image?: string | null;
  url?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, unknown> | null;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  jsonLd,
}) => {
  const fullTitle = `${title} — ${SITE_NAME}`;
  const desc = truncate(description?.trim() || DEFAULT_DESCRIPTION);
  const pageUrl =
    url ?? (typeof window !== 'undefined' ? window.location.href : SITE_URL);
  const absoluteImage = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`
    : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={pageUrl} />
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}
      {absoluteImage && <meta property="og:image:secure_url" content={absoluteImage} />}
      {absoluteImage && <meta property="og:image:width" content="1200" />}
      {absoluteImage && <meta property="og:image:height" content="630" />}
      {absoluteImage && <meta property="og:image:alt" content={title} />}

      {/* Twitter */}
      <meta name="twitter:card" content={absoluteImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {absoluteImage && <meta name="twitter:image" content={absoluteImage} />}

      {/* WhatsApp / generic */}
      {absoluteImage && <meta itemProp="image" content={absoluteImage} />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};