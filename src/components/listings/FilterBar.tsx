import React from 'react';
import { Minus, Plus, ChevronDown } from 'lucide-react';
import type { District, PropertyType } from '@/lib/types';
import { usePropertyTypes } from '@/hooks/usePropertyTypes';

interface FilterBarProps {
  district: District | '';
  propertyType: PropertyType | '';
  guests: number;
  onDistrict: (v: District | '') => void;
  onPropertyType: (v: PropertyType | '') => void;
  onGuests: (v: number) => void;
  totalCount?: number;
  isSticky?: boolean;
}

const DISTRICTS: { value: District; label: string }[] = [
  { value: 'wayanad', label: 'Wayanad' },
  { value: 'munnar', label: 'Munnar' },
  { value: 'alleppey', label: 'Alleppey' },
  { value: 'thekkady', label: 'Thekkady' },
  { value: 'vagamon', label: 'Vagamon' },
  { value: 'kozhikode', label: 'Kozhikode' },
  { value: 'kannur', label: 'Kannur' },
];

// Property types are now loaded dynamically from the `property_types` admin table.

export const FilterBar: React.FC<FilterBarProps> = ({
  district, propertyType, guests,
  onDistrict, onPropertyType, onGuests,
  isSticky = false,
}) => {
  const { data: typeOptions = [] } = usePropertyTypes();
  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
        isSticky
          ? 'bg-[#17341e]/80 backdrop-blur-xl shadow-lg'
          : 'bg-[#17341e]'
      }`}
    >
      <div className="grid grid-cols-3 gap-2 md:gap-4 p-4 md:p-6">
        {/* LOCATIONS */}
        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 font-body text-white">
            Locations
          </label>
          <div className="relative">
            <select
              value={district}
              onChange={(e) => onDistrict(e.target.value as District | '')}
              className="w-full appearance-none bg-white/15 text-xs md:text-sm rounded-full px-3 md:px-4 py-2 md:py-2.5 pr-8 border-none focus:ring-0 font-body cursor-pointer text-white opacity-100"
            >
              <option value="" className="text-black">All Kerala</option>
              {DISTRICTS.map((d) => (
                <option key={d.value} value={d.value} className="text-black">{d.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
          </div>
        </div>

        {/* GUESTS */}
        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 font-body text-white">
            &nbsp; GUESTS
          </label>
          <div className="flex items-center bg-white/15 rounded-full px-1 md:px-2 py-1 md:py-1.5 opacity-100">
            <button
              onClick={() => onGuests(Math.max(1, guests - 1))}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors"
              aria-label="Decrease guests"
            >
              <Minus size={12} />
            </button>
            <span className="flex-1 text-center text-white font-bold text-xs md:text-sm font-body">
              {guests}
            </span>
            <button
              onClick={() => onGuests(Math.min(12, guests + 1))}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors"
              aria-label="Increase guests"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        {/* PROPERTY TYPE */}
        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 font-body text-white">
            Property Type
          </label>
          <div className="relative">
            <select
              value={propertyType}
              onChange={(e) => onPropertyType(e.target.value as PropertyType | '')}
              className="w-full appearance-none bg-white/15 text-xs md:text-sm rounded-full px-3 md:px-4 py-2 md:py-2.5 pr-8 border-none focus:ring-0 font-body cursor-pointer text-white opacity-100"
            >
              <option value="" className="text-black">All Types</option>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value} className="text-black">{t.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
