import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function htmlHeaders(extra: Record<string, string> = {}): Headers {
  const h = new Headers();
  // CORS first
  for (const [k, v] of Object.entries(corsHeaders)) h.set(k, v);
  // Then content-type and caching — set last so nothing overrides them
  for (const [k, v] of Object.entries(extra)) h.set(k, v);
  h.set("Content-Type", "text/html; charset=utf-8");
  return h;
}

const SITE_NAME = "Hills Camp Kerala";
const SITE_URL = "https://hillscamp.com";
const DEFAULT_DESCRIPTION =
  "Luxury wilderness retreats and curated experiences in Kerala's Western Ghats.";

// In-memory cache (per edge instance) — 5 minutes per slug
const CACHE_TTL_MS = 5 * 60 * 1000;
// Cache bot vs human variants separately
const cache = new Map<string, { html: string; expiresAt: number }>();

// Known link-preview / social crawler user-agents.
// Matched case-insensitively as substrings.
const BOT_UA_PATTERNS = [
  "whatsapp",
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "slackbot",
  "linkedinbot",
  "telegrambot",
  "discordbot",
  "pinterest",
  "redditbot",
  "skypeuripreview",
  "applebot",
  "googlebot",
  "bingbot",
  "yandexbot",
  "duckduckbot",
  "baiduspider",
  "embedly",
  "quora link preview",
  "vkshare",
  "w3c_validator",
  "iframely",
  "outbrain",
  "nuzzel",
  "bitlybot",
  "tumblr",
  "viber",
  "line/",
  "snapchat",
  "preview",
  "fetch", // generic node/python "fetch" libs sometimes used by previewers
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true; // no UA = treat as bot (safer for previews)
  const ua = userAgent.toLowerCase();
  return BOT_UA_PATTERNS.some((p) => ua.includes(p));
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncate(str: string, max = 160): string {
  const clean = str.replace(/[#*_>`\-]/g, "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + "…";
}

function absoluteImage(image: string | null | undefined): string | null {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

function renderHtml(opts: {
  title: string;
  description: string;
  image: string | null;
  canonicalUrl: string;
  redirectUrl: string;
  type: "product" | "article" | "website";
  jsonLd: Record<string, unknown>;
  isBot: boolean;
}): string {
  const fullTitle = `${opts.title} — ${SITE_NAME}`;
  const desc = truncate(opts.description || DEFAULT_DESCRIPTION);
  const img = opts.image;
  const t = escapeHtml(opts.title);
  const ft = escapeHtml(fullTitle);
  const d = escapeHtml(desc);
  const canonical = escapeHtml(opts.canonicalUrl);
  const redirect = escapeHtml(opts.redirectUrl);
  const jsonLdStr = JSON.stringify(opts.jsonLd).replace(/</g, "\\u003c");

  // Bots: serve clean OG HTML with NO meta-refresh and NO JS redirect.
  // iOS WhatsApp in particular bails on the preview if it sees a refresh/redirect.
  // Humans: instant client-side replace + meta-refresh fallback.
  const redirectMarkup = opts.isBot
    ? ""
    : `<meta http-equiv="refresh" content="0;url=${redirect}" />
<script>window.location.replace(${JSON.stringify(opts.redirectUrl)});</script>`;

  const bodyMarkup = opts.isBot
    ? `<h1>${ft}</h1>${img ? `\n<img src="${escapeHtml(img)}" alt="${t}" width="1200" height="630" />` : ""}\n<p>${d}</p>\n<p><a href="${redirect}">View on ${escapeHtml(SITE_NAME)}</a></p>`
    : `<p>Redirecting to <a href="${redirect}">${ft}</a>…</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${ft}</title>
<meta name="description" content="${d}" />
<link rel="canonical" href="${canonical}" />

<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
<meta property="og:type" content="${opts.type}" />
<meta property="og:title" content="${ft}" />
<meta property="og:description" content="${d}" />
<meta property="og:url" content="${canonical}" />
${img ? `<meta property="og:image" content="${escapeHtml(img)}" />
<meta property="og:image:secure_url" content="${escapeHtml(img)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${t}" />` : ""}

<meta name="twitter:card" content="${img ? "summary_large_image" : "summary"}" />
<meta name="twitter:title" content="${ft}" />
<meta name="twitter:description" content="${d}" />
${img ? `<meta name="twitter:image" content="${escapeHtml(img)}" />` : ""}
${img ? `<meta itemProp="image" content="${escapeHtml(img)}" />` : ""}

<script type="application/ld+json">${jsonLdStr}</script>
${redirectMarkup}
</head>
<body>
${bodyMarkup}
</body>
</html>`;
}

function notFoundHtml(message = "Not found"): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${SITE_NAME}</title></head><body><p>${escapeHtml(message)}</p></body></html>`;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function buildPropertyHtml(slug: string, isBotReq: boolean): Promise<string | null> {
  const { data: property, error } = await supabase
    .from("properties")
    .select(
      "id, slug, name, tagline, description, cover_image, location, district, latitude, longitude, property_images(image_url, sort_order)",
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !property) return null;

  const images = (property.property_images ?? [])
    .slice()
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const image = absoluteImage(
    property.cover_image || images[0]?.image_url || null,
  );
  const description = property.tagline || property.description || DEFAULT_DESCRIPTION;
  const canonicalUrl = `${SITE_URL}/property/${property.slug}`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: property.name,
    description: description ?? undefined,
    image: image ?? undefined,
    url: canonicalUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location || property.district,
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
  };
  if (property.latitude && property.longitude) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: property.latitude,
      longitude: property.longitude,
    };
  }

  return renderHtml({
    title: property.name,
    description,
    image,
    canonicalUrl,
    redirectUrl: canonicalUrl,
    type: "product",
    jsonLd,
    isBot: isBotReq,
  });
}

async function buildPackageHtml(slug: string, isBotReq: boolean): Promise<string | null> {
  const { data: pkg, error } = await supabase
    .from("packages")
    .select(
      "id, slug, name, hero_images, location, region, price_inr, duration_days, duration_nights, tags, itinerary, package_gallery(image_url, display_order)",
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !pkg) return null;

  const gallery = (pkg.package_gallery ?? [])
    .slice()
    .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0));
  const image = absoluteImage(
    (pkg.hero_images && pkg.hero_images[0]) || gallery[0]?.image_url || null,
  );
  const description =
    [pkg.location, pkg.region].filter(Boolean).join(" · ") ||
    DEFAULT_DESCRIPTION;
  const canonicalUrl = `${SITE_URL}/packages/${pkg.slug}`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.name,
    description,
    image: image ?? undefined,
    url: canonicalUrl,
    touristType: pkg.tags ?? undefined,
  };
  if (pkg.price_inr) {
    jsonLd.offers = {
      "@type": "Offer",
      price: pkg.price_inr,
      priceCurrency: "INR",
      url: canonicalUrl,
    };
  }
  if (Array.isArray(pkg.itinerary)) {
    jsonLd.itinerary = (pkg.itinerary as Array<Record<string, unknown>>).map(
      (step, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: (step?.title as string) ?? `Day ${i + 1}`,
      }),
    );
  }

  return renderHtml({
    title: pkg.name,
    description,
    image,
    canonicalUrl,
    redirectUrl: canonicalUrl,
    type: "product",
    jsonLd,
    isBot: isBotReq,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  // Path looks like: /share-meta/property/:slug or /share-meta/package/:slug
  // Be lenient: also accept /property/:slug or /package/:slug after the function root.
  const parts = url.pathname.split("/").filter(Boolean);
  // Drop the leading function name segment if present
  const idx = parts.findIndex((p) => p === "property" || p === "package");
  if (idx === -1 || !parts[idx + 1]) {
    return new Response(notFoundHtml("Missing type or slug"), {
      status: 404,
      headers: htmlHeaders(),
    });
  }
  const type = parts[idx];
  const slug = decodeURIComponent(parts[idx + 1]);

  const userAgent = req.headers.get("user-agent");
  const botRequest = isBot(userAgent);
  const cacheKey = `${type}:${slug}:${botRequest ? "bot" : "human"}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return new Response(cached.html, {
      status: 200,
      headers: htmlHeaders({
        "Cache-Control": "public, max-age=300, s-maxage=300",
        Vary: "User-Agent",
        "X-Cache": "HIT",
        "X-Bot": botRequest ? "1" : "0",
      }),
    });
  }

  let html: string | null = null;
  try {
    if (type === "property") html = await buildPropertyHtml(slug, botRequest);
    else if (type === "package") html = await buildPackageHtml(slug, botRequest);
  } catch (err) {
    console.error("share-meta error:", err);
    return new Response(notFoundHtml("Server error"), {
      status: 500,
      headers: htmlHeaders(),
    });
  }

  if (!html) {
    return new Response(notFoundHtml("Not found"), {
      status: 404,
      headers: htmlHeaders(),
    });
  }

  cache.set(cacheKey, { html, expiresAt: now + CACHE_TTL_MS });

  return new Response(html, {
    status: 200,
    headers: htmlHeaders({
      "Cache-Control": "public, max-age=300, s-maxage=300",
      Vary: "User-Agent",
      "X-Cache": "MISS",
      "X-Bot": botRequest ? "1" : "0",
    }),
  });
});