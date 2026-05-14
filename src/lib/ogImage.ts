// Build an absolute URL for the dynamic branded OG card edge function.
// The function returns a 1200x630 PNG suitable for og:image.

const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL ??
  "https://amlhmlfzvqdghbbuluio.supabase.co";

export type OgCardType = "property" | "package" | "post";

export function ogImageUrl(type: OgCardType, slug: string): string {
  return `${SUPABASE_URL}/functions/v1/og-image?type=${type}&slug=${encodeURIComponent(slug)}`;
}