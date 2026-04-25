// Edge function: serves crawler-friendly HTML with Open Graph / Twitter meta
// tags for property, package, and blog detail pages. Browsers are redirected
// to the SPA via meta-refresh; bots see the rich preview.
//
// URL shape: /functions/v1/og-meta/{type}/{slug}
//   type: "property" | "package" | "blog"

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://hillscamp.com";
const SITE_NAME = "Hills Camp Kerala";
const DEFAULT_DESC =
  "A luxury wilderness retreat in Kerala's Western Ghats.";
const DEFAULT_IMAGE = `${SITE_URL}/lovable-uploads/placeholder-share.jpg`;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripMarkdown(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(s: string, n = 160): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}

interface MetaPayload {
  title: string;
  description: string;
  image: string;
  canonical: string;
  type: "website" | "article";
}

async function fetchProperty(slug: string): Promise<MetaPayload | null> {
  const { data } = await supabase
    .from("properties")
    .select("name, tagline, description, cover_image, property_images(image_url, sort_order)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!data) return null;
  const fallbackImg = (data.property_images ?? [])
    .slice()
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0]?.image_url;
  const desc = data.tagline?.trim() || stripMarkdown(data.description) || DEFAULT_DESC;
  return {
    title: `${data.name} — ${SITE_NAME}`,
    description: truncate(desc),
    image: data.cover_image || fallbackImg || DEFAULT_IMAGE,
    canonical: `${SITE_URL}/property/${slug}`,
    type: "website",
  };
}

async function fetchPackage(slug: string): Promise<MetaPayload | null> {
  const { data } = await supabase
    .from("packages")
    .select("name, hero_images, package_gallery(image_url, display_order)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!data) return null;
  const hero = (data.hero_images ?? [])[0];
  const galleryImg = (data.package_gallery ?? [])
    .slice()
    .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))[0]?.image_url;
  return {
    title: `${data.name} — ${SITE_NAME}`,
    description: truncate(`Discover ${data.name} — a curated experience by ${SITE_NAME}.`),
    image: hero || galleryImg || DEFAULT_IMAGE,
    canonical: `${SITE_URL}/packages/${slug}`,
    type: "website",
  };
}

async function fetchBlog(slug: string): Promise<MetaPayload | null> {
  const { data } = await supabase
    .from("blog_posts")
    .select("title, excerpt, content, cover_image")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!data) return null;
  const desc = data.excerpt?.trim() || stripMarkdown(data.content) || DEFAULT_DESC;
  return {
    title: `${data.title} — ${SITE_NAME}`,
    description: truncate(desc),
    image: data.cover_image || DEFAULT_IMAGE,
    canonical: `${SITE_URL}/blog/${slug}`,
    type: "article",
  };
}

function renderHtml(m: MetaPayload): string {
  const t = escapeHtml(m.title);
  const d = escapeHtml(m.description);
  const img = escapeHtml(m.image);
  const url = escapeHtml(m.canonical);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${t}</title>
<meta name="description" content="${d}" />
<link rel="canonical" href="${url}" />

<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${d}" />
<meta property="og:image" content="${img}" />
<meta property="og:image:secure_url" content="${img}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="${m.type}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${t}" />
<meta name="twitter:description" content="${d}" />
<meta name="twitter:image" content="${img}" />

<meta http-equiv="refresh" content="0; url=${url}" />
</head>
<body>
<p>Redirecting to <a href="${url}">${url}</a>…</p>
<script>window.location.replace(${JSON.stringify(m.canonical)});</script>
</body>
</html>`;
}

function notFoundHtml(): string {
  return `<!doctype html><html><head><title>Not found — ${SITE_NAME}</title>
<meta http-equiv="refresh" content="0; url=${SITE_URL}" /></head>
<body><a href="${SITE_URL}">Return home</a></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    // Path will look like: /og-meta/property/the-veranta
    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("og-meta");
    const segs = idx >= 0 ? parts.slice(idx + 1) : parts;
    const [type, ...rest] = segs;
    const slug = rest.join("/");

    if (!type || !slug) {
      return new Response(notFoundHtml(), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      });
    }

    let meta: MetaPayload | null = null;
    if (type === "property") meta = await fetchProperty(slug);
    else if (type === "package" || type === "packages") meta = await fetchPackage(slug);
    else if (type === "blog" || type === "journal") meta = await fetchBlog(slug);

    if (!meta) {
      return new Response(notFoundHtml(), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response(renderHtml(meta), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=600",
      },
    });
  } catch (e) {
    console.error("og-meta error", e);
    return new Response(notFoundHtml(), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });
  }
});