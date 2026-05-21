import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

export interface PriceBucket {
  label: string;
  min: number;
  max: number | null;
}

export const PRICE_BUCKETS: PriceBucket[] = [
  { label: 'Under ₹5k', min: 0, max: 5000 },
  { label: '₹5k – ₹10k', min: 5000, max: 10000 },
  { label: '₹10k – ₹20k', min: 10000, max: 20000 },
  { label: '₹20k – ₹50k', min: 20000, max: 50000 },
  { label: '₹50k+', min: 50000, max: null },
];

export function getBucketById(id: string | null | undefined): PriceBucket | null {
  if (!id) return null;
  return PRICE_BUCKETS.find((b) => b.label === id) ?? null;
}

interface PriceFilterPopoverProps {
  value: string;
  onChange: (value: string) => void;
  variant?: 'dark' | 'light';
  className?: string;
  label?: string;
}

export const PriceFilterPopover: React.FC<PriceFilterPopoverProps> = ({
  value,
  onChange,
  variant = 'dark',
  className = '',
  label = 'Price',
}) => {
  const active = getBucketById(value);
  const display = active ? active.label : 'Any Price';
  const isDark = variant === 'dark';

  return (
    <div className={className}>
      <label className={`block text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 font-body ${isDark ? 'text-white' : 'text-hc-primary'}`}>
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`w-full flex items-center justify-between gap-2 rounded-full px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-body cursor-pointer transition-colors ${
              isDark
                ? 'bg-white/15 text-white hover:bg-white/20'
                : 'bg-hc-bg-alt text-hc-primary hover:bg-hc-bg-alt/80'
            }`}
          >
            <span className="truncate">{display}</span>
            <ChevronDown size={14} className={isDark ? 'text-white/60' : 'text-hc-primary/60'} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-2 bg-hc-bg border border-hc-primary/10 rounded-2xl shadow-lg z-50">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => onChange('')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-body transition-colors ${
                !value ? 'bg-hc-primary text-hc-bg' : 'text-hc-primary hover:bg-hc-bg-alt'
              }`}
            >
              Any Price
            </button>
            {PRICE_BUCKETS.map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => onChange(b.label)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-body transition-colors ${
                  value === b.label ? 'bg-hc-primary text-hc-bg' : 'text-hc-primary hover:bg-hc-bg-alt'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};