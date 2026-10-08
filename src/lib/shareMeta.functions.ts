import { createServerFn } from "@tanstack/react-start";

export type ShareKind = "property" | "package" | "post";

export interface ShareMeta {
  title: string;
  description: string | null;
  image: string | null;
}

const TABLE: Record<ShareKind, string> = {
  property: "properties",
  package: "packages",
  post: "blog_posts",
};

const clean = (s: string | null | undefined, max = 160): string | null => {
  if (!s) return null;
  const t = s.replace(/[#*_>`]/g, "").replace(/\s+/g, " ").trim();
  if (!t) return null;
  return t.length <= max ? t : t.slice(0, max - 1).trimEnd() + "…";
};

/** Convert a Supabase public storage URL into a share-sized 1200x630 JPEG rendition. */
const shareSized = (url: string | null | undefined): string | null => {
  if (!url || !url.startsWith("http")) return null;
  if (url.includes("/storage/v1/object/public/")) {
    return (
      url.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/").split("?")[0] +
      "?width=1200&height=630&resize=cover&quality=70"
    );
  }
  return url;
};

export const getShareMeta = createServerFn({ method: "GET" })
  .inputValidator((d: { kind: ShareKind; slug: string }) => {
    if (!d || !TABLE[d.kind] || typeof d.slug !== "string" || d.slug.length > 200) {
      throw new Error("Invalid input");
    }
    return d;
  })
  .handler(async ({ data }): Promise<ShareMeta | null> => {
    const env = (import.meta as any).env ?? {};
    const base: string =
      process.env["SUPABASE_URL"] || env.VITE_SUPABASE_URL || "https://amlhmlfzvqdghbbuluio.supabase.co";
    const key: string | undefined =
      process.env["SUPABASE_PUBLISHABLE_KEY"] || env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!key) return null;
    try {
      const url = `${base}/rest/v1/${TABLE[data.kind]}?select=*&slug=eq.${encodeURIComponent(data.slug)}&limit=1`;
      const res = await fetch(url, { headers: { apikey: key } });
      if (!res.ok) return null;
      const rows = (await res.json()) as any[];
      const r = rows?.[0];
      if (!r) return null;
      if (r.is_published === false) return null;
      return {
        title: String(r.name || r.title || "Hills Camp").trim(),
        description: clean(r.tagline || r.excerpt || r.short_description || r.description),
        image: shareSized(r.cover_image || r.image_url || r.hero_image),
      };
    } catch {
      return null;
    }
  });

export function shareHead(meta: ShareMeta | null | undefined, path: string, type: string) {
  if (!meta) return {};
  const url = `https://hillscamp.com${path}`;
  const title = `${meta.title} — Hills Camp`;
  const m: Array<Record<string, string>> = [
    { title },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { name: "twitter:title", content: title },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  if (meta.description) {
    m.push(
      { name: "description", content: meta.description },
      { property: "og:description", content: meta.description },
      { name: "twitter:description", content: meta.description },
    );
  }
  if (meta.image) {
    m.push(
      { property: "og:image", content: meta.image },
      { property: "og:image:secure_url", content: meta.image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/jpeg" },
      { name: "twitter:image", content: meta.image },
    );
  }
  return { meta: m, links: [{ rel: "canonical", href: url }] };
}
