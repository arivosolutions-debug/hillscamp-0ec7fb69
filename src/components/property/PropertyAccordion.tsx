import React, { useState } from 'react';
import { Leaf, Plus } from 'lucide-react';
import { MarkdownContent } from '@/components/shared/MarkdownContent';

interface PropertyAccordionProps {
  title: string;
  children: React.ReactNode;
}

export const PropertyAccordion: React.FC<PropertyAccordionProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-[#c2c8bf]/20">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full px-5 py-4"
      >
        <span className="font-headline text-[#17341e] text-lg">{title}</span>
        <Plus
          size={20}
          className={`text-[#17341e] transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? '600px' : '0px' }}
      >
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  );
};

interface HighlightsAccordionProps {
  highlights: string[] | null;
}

export const HighlightsAccordion: React.FC<HighlightsAccordionProps> = ({ highlights }) => {
  if (!highlights?.length) return null;
  return (
    <PropertyAccordion title="Highlights">
      <div className="space-y-3">
        {highlights.map((h, i) => (
          <div key={i} className="flex items-start gap-3">
            <Leaf size={14} strokeWidth={1.5} className="text-[#924a29] mt-0.5 shrink-0" />
            <p className="text-sm text-[#424842] font-body">{h}</p>
          </div>
        ))}
      </div>
    </PropertyAccordion>
  );
};

interface TermsAccordionProps {
  terms: string[] | null;
}

export const TermsAccordion: React.FC<TermsAccordionProps> = ({ terms }) => {
  if (!terms?.length) return null;
  // Single-item arrays are treated as a Markdown document (new admin format).
  if (terms.length === 1) {
    return (
      <PropertyAccordion title="Terms & Conditions">
        <MarkdownContent source={terms[0]} size="sm" />
      </PropertyAccordion>
    );
  }
  return (
    <PropertyAccordion title="Terms & Conditions">
      <div className="space-y-3 text-sm text-[#424842] font-body">
        {terms.map((t, i) => {
          const colonIdx = t.indexOf(':');
          if (colonIdx > 0 && colonIdx < 30) {
            return (
              <p key={i}>
                <strong className="text-hc-primary">{t.slice(0, colonIdx)}</strong>
                {t.slice(colonIdx)}
              </p>
            );
          }
          return <p key={i}>{t}</p>;
        })}
      </div>
    </PropertyAccordion>
  );
};
