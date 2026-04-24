import React, { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

marked.setOptions({ breaks: true, gfm: true });

interface MarkdownContentProps {
  source?: string | null;
  className?: string;
  /** Visual size variant for the prose */
  size?: "sm" | "base" | "lg";
}

/**
 * Renders user-authored markdown safely.
 * Sanitizes HTML output via DOMPurify and applies Tailwind typography
 * tokens consistent with the editorial design system.
 */
export const MarkdownContent: React.FC<MarkdownContentProps> = ({
  source,
  className,
  size = "base",
}) => {
  const html = useMemo(() => {
    if (!source) return "";
    const raw = marked.parse(source, { async: false }) as string;
    return DOMPurify.sanitize(raw, {
      ALLOWED_TAGS: [
        "p", "br", "strong", "em", "u", "s", "del", "blockquote",
        "h1", "h2", "h3", "h4", "ul", "ol", "li", "a", "code", "pre",
        "hr", "div", "span",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "style", "class"],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
  }, [source]);

  if (!source) return null;

  const sizeClass =
    size === "sm" ? "text-sm leading-relaxed" :
    size === "lg" ? "text-lg leading-[1.8]" :
    "text-base leading-relaxed";

  return (
    <div
      className={cn(
        "font-body text-hc-text",
        sizeClass,
        // Element styling — no @tailwindcss/typography dependency
        "[&_p]:mb-3 [&_p:last-child]:mb-0",
        "[&_strong]:font-semibold [&_strong]:text-hc-primary",
        "[&_em]:italic",
        "[&_u]:underline [&_u]:underline-offset-2",
        "[&_h1]:font-headline [&_h1]:text-hc-primary [&_h1]:text-3xl [&_h1]:mt-6 [&_h1]:mb-3",
        "[&_h2]:font-headline [&_h2]:text-hc-primary [&_h2]:text-2xl [&_h2]:mt-6 [&_h2]:mb-3",
        "[&_h3]:font-headline [&_h3]:text-hc-primary [&_h3]:text-xl [&_h3]:mt-5 [&_h3]:mb-2",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1",
        "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1",
        "[&_li]:marker:text-hc-secondary",
        "[&_a]:text-hc-secondary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-hc-primary",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-hc-secondary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-hc-primary/80 [&_blockquote]:my-3",
        "[&_code]:font-mono [&_code]:text-[0.9em] [&_code]:bg-hc-bg-alt [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded",
        "[&_hr]:my-6 [&_hr]:border-hc-text-light/20",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownContent;