import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";

// Simple in-memory rate limiter (per-IP, 5 submissions per hour)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-+().]{0,30}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

export interface EnquiryInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  property_id?: string | null;
  package_id?: string | null;
}

function validate(input: unknown) {
  const body = (input ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : null);

  const name = stripHtml((str(body["name"]) ?? "").trim());
  if (!name || name.length > 100) throw new Error("Name is required and must be under 100 characters.");

  const email = (str(body["email"]) ?? "").trim().toLowerCase();
  const phoneRaw = str(body["phone"]);
  const phone = phoneRaw ? phoneRaw.trim() : null;

  if (email && (!EMAIL_RE.test(email) || email.length > 255)) throw new Error("A valid email address is required.");
  if (phone && !PHONE_RE.test(phone)) throw new Error("Invalid phone number format.");
  if (!email && !phone) throw new Error("Either an email address or a phone number is required.");

  const messageRaw = str(body["message"]);
  const message = messageRaw ? stripHtml(messageRaw.trim()) : null;
  if (message && message.length > 5000) throw new Error("Message must be under 5000 characters.");

  const pid = str(body["property_id"]);
  const kid = str(body["package_id"]);
  return {
    name,
    email,
    phone,
    message,
    property_id: pid && UUID_RE.test(pid) ? pid : null,
    package_id: kid && UUID_RE.test(kid) ? kid : null,
  };
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: EnquiryInput) => validate(input))
  .handler(async ({ data }) => {
    const ip =
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
      getRequestHeader("cf-connecting-ip") ||
      "unknown";
    if (isRateLimited(ip)) throw new Error("Too many submissions. Please try again later.");

    const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
    const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
    if (!url || !serviceKey) {
      console.error("submitEnquiry: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      throw new Error("Failed to submit enquiry. Please try again.");
    }

    // Service role insert (bypasses RLS) — server-only.
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
    const { error } = await supabase.from("enquiries").insert([data]);
    if (error) {
      console.error("DB insert error:", error);
      throw new Error("Failed to submit enquiry. Please try again.");
    }
    return { success: true as const };
  });
