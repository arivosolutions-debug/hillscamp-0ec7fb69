// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://hillscamp.com";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "https://amlhmlfzvqdghbbuluio.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/listings", changefreq: "weekly", priority: "0.9" },
  { path: "/experiences", changefreq: "weekly", priority: "0.8" },
  { path: "/packages", changefreq: "weekly", priority: "0.8" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
];

async function fetchDynamic(): Promise<SitemapEntry[]> {
  if (!SUPABASE_KEY) return [];
  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
    const [props, pkgs, posts] = await Promise.all([
      sb.from("properties").select("slug, updated_at").eq("is_published", true),
      sb.from("packages").select("slug, updated_at").eq("is_published", true),
      sb.from("blog_posts").select("slug, published_at").eq("is_published", true),
    ]);
    const out: SitemapEntry[] = [];
    (props.data ?? []).forEach((r: any) =>
      out.push({ path: `/property/${r.slug}`, lastmod: r.updated_at?.slice(0, 10), changefreq: "monthly", priority: "0.8" }),
    );
    (pkgs.data ?? []).forEach((r: any) =>
      out.push({ path: `/packages/${r.slug}`, lastmod: r.updated_at?.slice(0, 10), changefreq: "monthly", priority: "0.7" }),
    );
    (posts.data ?? []).forEach((r: any) =>
      out.push({ path: `/blog/${r.slug}`, lastmod: r.published_at?.slice(0, 10), changefreq: "monthly", priority: "0.6" }),
    );
    return out;
  } catch (e) {
    console.warn("sitemap: skipping dynamic entries —", (e as Error).message);
    return [];
  }
}

function render(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

(async () => {
  const dynamic = await fetchDynamic();
  const all = [...staticEntries, ...dynamic];
  writeFileSync(resolve("public/sitemap.xml"), render(all));
  console.log(`sitemap.xml written (${all.length} entries)`);
})();