import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { SearchSuggestions } from '@/components/home/SearchSuggestions';

const SEARCH_KEYWORDS = [
  'for Wayanad...',
  'for Treehouse...',
  'for Munnar...',
  'for Alleppey...',
  'for lakeside cabin...',
  'for Mountainview...',
  'for House Boat...',
];

const AnimatedSearchBar: React.FC<{ onSubmit: (value: string) => void }> = ({ onSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'in' | 'out'>('in');
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused) return;

    const cycle = () => {
      // Fade out
      setDirection('out');
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SEARCH_KEYWORDS.length);
        setDirection('in');
        setTimeout(() => setIsAnimating(false), 20);
      }, 300);
    };

    const interval = setInterval(cycle, 2800);
    return () => clearInterval(interval);
  }, [isFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) onSubmit(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#ffdbcd]/25 rounded-2xl mx-5 mt-4 px-4 py-3 hidden">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            if (!inputValue) setIsFocused(false);
          }}
          className="w-full bg-white/60 rounded-full px-5 py-3 pr-12 text-sm text-hc-primary font-body border-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-hc-secondary/30"
        />

        {/* Animated placeholder overlay */}
        {!isFocused && !inputValue && (
          <div
            className="absolute inset-0 flex items-center px-5 pointer-events-none"
            onClick={() => inputRef.current?.focus()}
          >
            <span className="text-sm text-[#8b938a] font-body">Search </span>
            <span
              className="text-sm font-bold text-hc-secondary font-body inline-block transition-all duration-300 ease-out"
              style={{
                opacity: isAnimating && direction === 'out' ? 0 : 1,
                transform:
                  isAnimating && direction === 'out'
                    ? 'translateY(-6px)'
                    : isAnimating && direction === 'in'
                    ? 'translateY(6px)'
                    : 'translateY(0)',
              }}
            >
              {SEARCH_KEYWORDS[currentIndex]}
            </span>
          </div>
        )}

        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-hc-secondary p-2"
          aria-label="Search"
        >
          <Search size={20} strokeWidth={1.75} />
        </button>
      </div>
    </form>
  );
};

export const FloatingSearch: React.FC = () => {
  const navigate = useNavigate();
  const [desktopQuery, setDesktopQuery] = useState('');
  const desktopInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams();
    params.set('district', value.toLowerCase());
    navigate(`/listings?${params.toString()}`);
  };

  const handleDesktopSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const q = (data.get('q') as string) || desktopQuery;
    const district = data.get('district') as string;
    const type = data.get('type') as string;
    const guests = data.get('guests') as string;
    if (q) params.set('q', q);
    if (district) params.set('district', district.toLowerCase());
    if (type) params.set('type', type.toLowerCase().replace(' ', '_'));
    if (guests) params.set('guests', guests.replace(/\D/g, ''));
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <section className="relative z-20 md:px-8 md:max-w-content md:mx-auto mb-8 md:mb-20 md:-mt-8">
      {/* Mobile: animated search */}
      <AnimatedSearchBar onSubmit={handleSearch} />

      {/* Desktop: full search bar */}
      <form
        onSubmit={handleDesktopSearch}
        className="hidden md:flex bg-white rounded-2xl shadow-[0_20px_25px_-5px_rgba(27,28,28,0.05),0_8px_10px_-6px_rgba(27,28,28,0.05)] p-2 items-center gap-2 relative">
        <div className="flex-1 grid grid-cols-4 gap-2">
          <div className="px-6 py-3 rounded-xl relative">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 mx-[4px] text-[#944729]">
              Search
            </label>
            <input
              ref={desktopInputRef}
              name="q"
              value={desktopQuery}
              onChange={(e) => setDesktopQuery(e.target.value)}
              placeholder="Munnar, treehouse…"
              className="w-full bg-transparent border-none p-0 text-hc-primary font-semibold focus:ring-0 focus:outline-none text-sm placeholder:text-hc-text/50"
            />
            <SearchSuggestions
              query={desktopQuery}
              anchorRef={desktopInputRef}
              onSelect={() => setDesktopQuery('')}
              width={360}
            />
          </div>
          <div className="px-6 py-3 rounded-xl">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 mx-[4px] text-[#944729]">
              District
            </label>
            <select
              name="district"
              className="w-full bg-transparent border-none p-0 text-hc-primary font-semibold focus:ring-0 focus:outline-none text-sm cursor-pointer">
              <option value="">Any</option>
              <option>Wayanad</option>
              <option>Munnar</option>
              <option>Alleppey</option>
              <option>Thekkady</option>
              <option>Vagamon</option>
              <option>Kozhikode</option>
              <option>Kannur</option>
            </select>
          </div>
          <div className="px-6 py-3 rounded-xl">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 mx-[4px] text-[#944729]">
              Guests
            </label>
            <select
              name="guests"
              className="w-full bg-transparent border-none p-0 text-hc-primary font-semibold focus:ring-0 focus:outline-none text-sm cursor-pointer">
              <option value="2">2 Adults</option>
              <option value="4">4 Adults</option>
              <option value="6">6 Adults</option>
              <option value="8">8+ Adults</option>
            </select>
          </div>
          <div className="px-6 py-3 rounded-xl">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 mx-[4px] text-[#944729]">
              Type
            </label>
            <select
              name="type"
              className="w-full bg-transparent border-none p-0 text-hc-primary font-semibold focus:ring-0 focus:outline-none text-sm cursor-pointer">
              <option value="">Any</option>
              <option value="tree_house">Canopy Retreat</option>
              <option value="tea_estate_cabin">Planter's Legacy</option>
              <option value="backwater_villa">Floating Villa</option>
              <option value="heritage_bungalow">Heritage Bungalow</option>
            </select>
          </div>
        </div>
      </form>
    </section>
  );
};
