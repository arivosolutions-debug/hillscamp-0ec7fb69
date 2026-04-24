import React, { useRef, useState } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  Heading2, Heading3, Quote, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight,
  Eye, Pencil,
} from "lucide-react";
import { MarkdownContent } from "@/components/shared/MarkdownContent";

interface MarkdownEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

/**
 * Lightweight markdown editor with a formatting toolbar.
 * Inserts markdown syntax around the current selection in the textarea.
 * Supports bold, italic, underline (HTML <u>), headings, lists,
 * blockquote, link, and alignment (HTML wrapper for align).
 */
export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  const wrap = (before: string, after = before, placeholder = "") => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  const linePrefix = (prefix: string) => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = value.slice(0, start);
    const selection = value.slice(start, end) || "text";
    const after = value.slice(end);
    const lines = selection.split("\n").map((l) => (l ? `${prefix}${l}` : l)).join("\n");
    const next = before + lines + after;
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start, start + lines.length);
    });
  };

  const orderedList = () => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selection = value.slice(start, end) || "First item\nSecond item";
    const numbered = selection
      .split("\n")
      .map((l, i) => (l ? `${i + 1}. ${l}` : l))
      .join("\n");
    onChange(value.slice(0, start) + numbered + value.slice(end));
    requestAnimationFrame(() => {
      ta?.focus();
      ta?.setSelectionRange(start, start + numbered.length);
    });
  };

  const insertLink = () => {
    const ta = ref.current;
    if (!ta) return;
    const url = window.prompt("Enter URL", "https://");
    if (!url) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = value.slice(start, end) || "link text";
    const md = `[${text}](${url})`;
    onChange(value.slice(0, start) + md + value.slice(end));
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start, start + md.length);
    });
  };

  const align = (dir: "left" | "center" | "right") => {
    wrap(`<div style="text-align:${dir}">\n\n`, `\n\n</div>`, "Aligned text");
  };

  const Btn: React.FC<{ onClick: () => void; title: string; children: React.ReactNode }> = ({ onClick, title, children }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className="w-8 h-8 rounded-md flex items-center justify-center text-hc-text hover:bg-white hover:text-hc-primary transition-colors"
    >
      {children}
    </button>
  );

  const Sep = () => <span className="w-px h-5 bg-hc-text-light/30 mx-0.5" />;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">
          {label}
        </label>
      )}
      <div className="border border-hc-text-light/30 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-hc-primary/20">
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-hc-bg-alt border-b border-hc-text-light/20">
          <Btn title="Bold" onClick={() => wrap("**", "**", "bold text")}><Bold size={14} /></Btn>
          <Btn title="Italic" onClick={() => wrap("*", "*", "italic text")}><Italic size={14} /></Btn>
          <Btn title="Underline" onClick={() => wrap("<u>", "</u>", "underlined text")}><UnderlineIcon size={14} /></Btn>
          <Sep />
          <Btn title="Heading 2" onClick={() => linePrefix("## ")}><Heading2 size={14} /></Btn>
          <Btn title="Heading 3" onClick={() => linePrefix("### ")}><Heading3 size={14} /></Btn>
          <Sep />
          <Btn title="Bullet list" onClick={() => linePrefix("- ")}><List size={14} /></Btn>
          <Btn title="Numbered list" onClick={orderedList}><ListOrdered size={14} /></Btn>
          <Btn title="Quote" onClick={() => linePrefix("> ")}><Quote size={14} /></Btn>
          <Sep />
          <Btn title="Link" onClick={insertLink}><LinkIcon size={14} /></Btn>
          <Sep />
          <Btn title="Align left" onClick={() => align("left")}><AlignLeft size={14} /></Btn>
          <Btn title="Align center" onClick={() => align("center")}><AlignCenter size={14} /></Btn>
          <Btn title="Align right" onClick={() => align("right")}><AlignRight size={14} /></Btn>
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className="inline-flex items-center gap-1.5 text-xs font-body font-semibold text-hc-secondary hover:text-hc-primary px-2 py-1 rounded-md"
            >
              {preview ? <><Pencil size={12} /> Edit</> : <><Eye size={12} /> Preview</>}
            </button>
          </div>
        </div>
        {preview ? (
          <div className="px-4 py-3 min-h-[120px] bg-white">
            {value ? (
              <MarkdownContent source={value} size="sm" />
            ) : (
              <p className="text-sm text-hc-text-light italic font-body">Nothing to preview yet.</p>
            )}
          </div>
        ) : (
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-2.5 text-sm font-body text-hc-text bg-white focus:outline-none resize-y"
          />
        )}
      </div>
      <p className="text-[10px] text-hc-text-light font-body">
        Markdown supported · **bold**, *italic*, lists, headings, links
      </p>
    </div>
  );
};

export default MarkdownEditor;