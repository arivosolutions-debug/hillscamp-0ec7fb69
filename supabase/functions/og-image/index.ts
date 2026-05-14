// Dynamic branded OG image generator for Hills Camp Kerala.
// GET /og-image?type=property|package|post&slug=<slug>
// Returns a 1200x630 PNG: full-bleed cover image + dark gradient + title + Hills Camp wordmark + location/category badge.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-ignore - wasm module without types
import { Resvg, initWasm } from "https://esm.sh/@resvg/resvg-wasm@2.6.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const W = 1200;
const H = 630;

// ── one-time init ────────────────────────────────────────────────
let wasmReady: Promise<void> | null = null;
async function ensureWasm() {
  if (!wasmReady) {
    wasmReady = (async () => {
      const wasmBytes = await fetch(
        "https://esm.sh/@resvg/resvg-wasm@2.6.2/index_bg.wasm",
      ).then((r) => r.arrayBuffer());
      await initWasm(wasmBytes);
    })();
  }
  return wasmReady;
}

let serifFont: Uint8Array | null = null;
let sansFont: Uint8Array | null = null;
async function loadFonts() {
  if (!serifFont) {
    serifFont = new Uint8Array(
      await fetch(
        "https://github.com/google/fonts/raw/main/ofl/notoserifdisplay/NotoSerifDisplay%5Bwdth%2Cwght%5D.ttf",
      ).then((r) => r.arrayBuffer()),
    );
  }
  if (!sansFont) {
    sansFont = new Uint8Array(
      await fetch(
        "https://github.com/google/fonts/raw/main/ofl/manrope/Manrope%5Bwght%5D.ttf",
      ).then((r) => r.arrayBuffer()),
    );
  }
}

// ── helpers ──────────────────────────────────────────────────────
function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Wrap title text into N lines based on a rough character budget
function wrapTitle(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const probe = current ? `${current} ${w}` : w;
    if (probe.length > maxCharsPerLine && current) {
      lines.push(current);
      current = w;
      if (lines.length === maxLines - 1) break;
    } else {
      current = probe;
    }
  }
  if (current) lines.push(current);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.length > maxCharsPerLine - 1
      ? last.slice(0, maxCharsPerLine - 1).trimEnd() + "…"
      : last + "…";
  }
  return lines;
}

async function fetchAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "image/jpeg";
    const buf = new Uint8Array(await res.arrayBuffer());
    // base64 encode
    let bin = "";
    const chunk = 0x8000;
    for (let i = 0; i < buf.length; i += chunk) {
      bin += String.fromCharCode(...buf.subarray(i, i + chunk));
    }
    return `data:${ct};base64,${btoa(bin)}`;
  } catch {
    return null;
  }
}

// ── data fetch ───────────────────────────────────────────────────
interface CardData {
  title: string;
  badge: string;
  coverImage: string | null;
}

async function fetchCard(type: string, slug: string): Promise<CardData | null> {
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  if (type === "property") {
    const { data } = await sb
      .from("properties")
      .select("name, district, location, cover_image, property_type")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (!data) return null;
    return {
      title: data.name,
      badge: (data.location || data.district || "Kerala").toString().toUpperCase(),
      coverImage: data.cover_image,
    };
  }
  if (type === "package") {
    const { data } = await sb
      .from("packages")
      .select("name, location, region, hero_images")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (!data) return null;
    return {
      title: data.name,
      badge: (data.location || data.region || "Experience").toString().toUpperCase(),
      coverImage: data.hero_images?.[0] ?? null,
    };
  }
  if (type === "post") {
    const { data } = await sb
      .from("blog_posts")
      .select("title, category, cover_image")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (!data) return null;
    return {
      title: data.title,
      badge: (data.category || "Journal").toString().toUpperCase(),
      coverImage: data.cover_image,
    };
  }
  return null;
}

// ── SVG composition ──────────────────────────────────────────────
function buildSvg(card: CardData, coverDataUrl: string | null): string {
  const titleLines = wrapTitle(card.title, 28, 3);
  const lineHeight = 88;
  const titleStartY = H - 90 - (titleLines.length - 1) * lineHeight;
  const titleSvg = titleLines
    .map(
      (line, i) =>
        `<text x="64" y="${titleStartY + i * lineHeight}" fill="#ffffff" font-family="NotoSerifDisplay, serif" font-size="76" font-weight="500">${escapeXml(line)}</text>`,
    )
    .join("");

  const badgeText = escapeXml(card.badge.slice(0, 40));
  const badgeWidth = Math.min(560, Math.max(140, badgeText.length * 14 + 40));

  const coverLayer = coverDataUrl
    ? `<image href="${coverDataUrl}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" />
       <rect x="0" y="0" width="${W}" height="${H}" fill="url(#shade)" />`
    : `<rect x="0" y="0" width="${W}" height="${H}" fill="#17341e" />
       <rect x="0" y="0" width="${W}" height="${H}" fill="url(#shade)" />`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.15" />
      <stop offset="55%" stop-color="#000000" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#0a1f12" stop-opacity="0.92" />
    </linearGradient>
  </defs>
  ${coverLayer}

  <!-- Top wordmark -->
  <g>
    <circle cx="80" cy="72" r="10" fill="#e8a87c" />
    <text x="104" y="82" fill="#ffffff" font-family="Manrope, sans-serif" font-size="28" font-weight="700" letter-spacing="6">HILLS CAMP</text>
    <text x="104" y="112" fill="#ffffff" font-family="Manrope, sans-serif" font-size="16" font-weight="400" letter-spacing="4" opacity="0.8">KERALA</text>
  </g>

  <!-- Location/category badge -->
  <g>
    <rect x="64" y="${titleStartY - 90}" rx="22" ry="22" width="${badgeWidth}" height="44" fill="#ffffff" fill-opacity="0.15" stroke="#ffffff" stroke-opacity="0.4" />
    <text x="${64 + badgeWidth / 2}" y="${titleStartY - 60}" text-anchor="middle" fill="#ffffff" font-family="Manrope, sans-serif" font-size="18" font-weight="600" letter-spacing="3">${badgeText}</text>
  </g>

  <!-- Title -->
  ${titleSvg}

  <!-- Bottom thin rule -->
  <rect x="64" y="${H - 38}" width="60" height="2" fill="#e8a87c" />
  <text x="140" y="${H - 30}" fill="#ffffff" font-family="Manrope, sans-serif" font-size="16" font-weight="500" letter-spacing="3" opacity="0.85">HILLSCAMP.COM</text>
</svg>`;
}

// ── PNG cache ────────────────────────────────────────────────────
const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, { png: Uint8Array; expiresAt: number }>();

async function renderPng(card: CardData): Promise<Uint8Array> {
  await Promise.all([ensureWasm(), loadFonts()]);
  const coverDataUrl = card.coverImage ? await fetchAsBase64(card.coverImage) : null;
  const svg = buildSvg(card, coverDataUrl);
  const fontFiles: Uint8Array[] = [];
  if (serifFont) fontFiles.push(serifFont);
  if (sansFont) fontFiles.push(sansFont);
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: W },
    font: {
      fontFiles: [],
      fontBuffers: fontFiles,
      loadSystemFonts: false,
      defaultFontFamily: "NotoSerifDisplay",
    },
    background: "#17341e",
  });
  const rendered = resvg.render();
  const png = rendered.asPng();
  rendered.free();
  resvg.free();
  return png;
}

// ── HTTP entry ───────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const type = (url.searchParams.get("type") ?? "").toLowerCase();
    const slug = url.searchParams.get("slug") ?? "";
    if (!["property", "package", "post"].includes(type) || !slug) {
      return new Response(JSON.stringify({ error: "type and slug are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cacheKey = `${type}:${slug}`;
    const now = Date.now();
    const hit = cache.get(cacheKey);
    if (hit && hit.expiresAt > now) {
      return new Response(hit.png, {
        headers: {
          ...corsHeaders,
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=1800, s-maxage=86400",
        },
      });
    }

    const card = await fetchCard(type, slug);
    if (!card) {
      return new Response(JSON.stringify({ error: "not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const png = await renderPng(card);
    cache.set(cacheKey, { png, expiresAt: now + CACHE_TTL_MS });

    return new Response(png, {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=1800, s-maxage=86400",
      },
    });
  } catch (err) {
    console.error("og-image error", err);
    return new Response(
      JSON.stringify({ error: "render failed", detail: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});