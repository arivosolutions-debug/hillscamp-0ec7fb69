import React, { useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { MapPin, Calendar, Search } from 'lucide-react';

export const SearchSection: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('district', location.toLowerCase());
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <section className="relative -mt-32 z-10 px-8 pb-24">
      <div className="max-w-content mx-auto">
        <div
          className="relative rounded-[2.5rem] overflow-hidden"
          style={{ minHeight: '420px' }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80"
              alt="Find your retreat"
              className="w-full h-full object-cover brightness-40"
              style={{ filter: 'brightness(0.4) blur(0px)' }}
            />
            <div className="absolute inset-0 bg-hc-primary/50" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-12 py-16 md:py-20">
            <p className="font-label text-xs tracking-[0.4em] text-hc-accent-light/70 mb-4">
              FIND YOUR RETREAT
            </p>
            <h2 className="font-headline text-4xl md:text-5xl text-white mb-12 leading-tight max-w-lg">
              Every forest has<br />
              <em className="text-hc-accent">the right path.</em>
            </h2>

            {/* Glassmorphic search bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-3 py-3 max-w-2xl">
              {/* Location */}
              <div className="flex items-center gap-3 flex-1 px-4 py-2">
                <MapPin size={16} className="text-hc-accent shrink-0" strokeWidth={1.75} />
                <input
                  type="text"
                  placeholder="Location — Wayanad, Munnar…"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="bg-transparent text-white placeholder:text-white/50 font-body text-sm w-full outline-hidden"
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-white/20 shrink-0" />

              {/* Dates */}
              <div className="flex items-center gap-3 flex-1 px-4 py-2">
                <Calendar size={16} className="text-hc-accent shrink-0" strokeWidth={1.75} />
                <input
                  type="text"
                  placeholder="Dates — When are you visiting?"
                  value={dates}
                  onChange={e => setDates(e.target.value)}
                  className="bg-transparent text-white placeholder:text-white/50 font-body text-sm w-full outline-hidden"
                />
              </div>

              {/* Search button */}
              <button
                onClick={handleSearch}
                className="bg-hc-secondary text-white px-8 py-3 rounded-full font-bold text-sm hover:brightness-110 transition-all active:scale-[0.97] shrink-0 whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
