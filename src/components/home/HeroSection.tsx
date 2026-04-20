import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Search } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
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

const MobileHeroSearch: React.FC<{ onSubmit: (value: string) => void }> = ({ onSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'in' | 'out'>('in');
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused) return;
    const cycle = () => {
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
    <form onSubmit={handleSubmit} className="mt-4 md:hidden">
      <div className="relative">
        <SearchSuggestions query={inputValue} onSelect={() => setInputValue('')} />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { if (!inputValue) setIsFocused(false); }}
          className="w-full bg-white/20 backdrop-blur-sm rounded-full px-5 py-3 pr-12 text-sm text-white font-body border border-white/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40 placeholder:text-white/60"
        />
        {!isFocused && !inputValue && (
          <div className="absolute inset-0 flex items-center px-5 pointer-events-none" onClick={() => inputRef.current?.focus()}>
            <span className="text-sm text-white/70 font-body">Search&nbsp;</span>
            <span
              className="text-sm font-bold text-white font-body inline-block transition-all duration-300 ease-out"
              style={{
                opacity: isAnimating && direction === 'out' ? 0 : 1,
                transform:
                  isAnimating && direction === 'out' ? 'translateY(-6px)'
                    : isAnimating && direction === 'in' ? 'translateY(6px)'
                    : 'translateY(0)',
              }}
            >
              {SEARCH_KEYWORDS[currentIndex]}
            </span>
          </div>
        )}
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 p-2" aria-label="Search">
          <Search size={20} strokeWidth={1.75} />
        </button>
      </div>
    </form>
  );
};

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams();
    params.set('district', value.toLowerCase());
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <header className="relative md:min-h-screen h-[65vh] md:h-auto flex items-end md:items-center overflow-hidden rounded-b-[24px] md:rounded-none">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Luxury balcony overlooking misty Kerala mountains"
          className="w-full h-full object-cover animate-kenburns origin-center" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-hc-bg" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto px-6 md:px-8 pb-6 md:pb-0 pt-32 w-full">
        <div className="max-w-3xl">
          <h1 className="font-headline text-white md:text-8xl lg:text-[96px] leading-none mb-2 md:mb-6 animate-fade-in-2 font-bold text-4xl">
            Where Nature<br />Meets Comfort
          </h1>
          <p className="md:text-2xl leading-relaxed max-w-xl mb-4 md:mb-10 animate-fade-in-3 text-white/80 md:text-primary-foreground text-base">
            <span className="md:hidden">A curated experience made just for you!</span>
            <span className="hidden md:inline">Experience the soul of Kerala through curated stays designed to vanish into the wilderness.</span>
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 animate-fade-in-4">
            <Link to="/listings" className="md:hidden flex-1 inline-flex items-center justify-center gap-2 bg-white text-hc-primary px-8 py-3 rounded-full font-semibold text-sm active:scale-[0.97]">
              Stays
            </Link>
            <Link to="/experiences" className="md:hidden flex-1 inline-flex items-center justify-center gap-2 bg-white text-hc-primary px-8 py-3 rounded-full font-semibold text-sm active:scale-[0.97]">
              Experiences
            </Link>
            <Link to="/listings" className="hidden md:inline-flex items-center gap-2 bg-hc-primary text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-hc-primary-deep transition-all active:scale-[0.97] group">
              Explore Properties
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/blog" className="hidden md:inline-flex items-center gap-2 border bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full font-bold text-sm hover:bg-white/20 transition-all active:scale-[0.97] text-primary border-primary">
              View Journal
            </Link>
          </div>

          {/* Mobile search bar inside hero */}
          <MobileHeroSearch onSubmit={handleSearch} />
        </div>
      </div>

      {/* Scroll indicator — desktop only */}
      <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 text-white/60 animate-bounce">
        <ChevronDown size={22} strokeWidth={1.5} />
      </div>
    </header>
  );
};