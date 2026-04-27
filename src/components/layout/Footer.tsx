import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, MessageCircle, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

const WHATSAPP_URL =
  'https://wa.me/919847012345?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20a%20Hills%20Camp%20Kerala%20retreat.';

const EXPLORE_LINKS = [
  { label: 'All Stays',        to: '/listings' },
  { label: 'Experiences',      to: '/experiences' },
  { label: 'The Journal',      to: '/blog' },
  { label: 'Contact Us',       to: '/contact' },
];

const LOCATION_LINKS = [
  { label: 'Wayanad Reserve',     to: '/listings?district=wayanad' },
  { label: 'Munnar Estates',      to: '/listings?district=munnar' },
  { label: 'Ooty Hills',          to: '/listings?district=vagamon' },
  { label: 'Alleppey Backwaters', to: '/listings?district=alleppey' },
];

const linkCls = 'text-[rgba(167,243,208,0.6)] hover:text-emerald-100 transition-colors text-sm font-body';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  return (
    <footer className="relative z-10 bg-[#022c22] rounded-tl-[32px] rounded-tr-[32px]">
      <div className="max-w-content mx-auto px-5 md:px-12 py-16 md:py-20 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">

        {/* Brand */}
        <div>
          <div className="mb-6">
            <Logo variant="light" />
          </div>
          <p className="text-[rgba(167,243,208,0.6)] text-sm leading-relaxed mb-6">
            An editorial retreat experience nestled in the verdant peaks of Kerala's high ranges.
          </p>
          <div className="flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Instagram size={16} className="text-emerald-50" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <MessageCircle size={16} className="text-emerald-50" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Linkedin size={16} className="text-emerald-50" />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-headline text-emerald-50 text-sm uppercase tracking-wider mb-6">Explore</h4>
          <ul className="space-y-3">
            {EXPLORE_LINKS.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={linkCls}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Locations */}
        <div>
          <h4 className="font-headline text-emerald-50 text-sm uppercase tracking-wider mb-6">Locations</h4>
          <ul className="space-y-3">
            {LOCATION_LINKS.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={linkCls}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect / Newsletter */}
        <div>
          <h4 className="font-headline text-emerald-50 text-sm uppercase tracking-wider mb-4">Journal</h4>
          <p className="text-[rgba(167,243,208,0.6)] text-sm mb-4 leading-relaxed">
            Join our seasonal mailing list for mountain stories.
          </p>
          <div className="relative w-full mb-6">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-white/5 rounded-xl px-4 py-3 pr-12 text-sm text-emerald-50 placeholder:text-emerald-50/30 focus:outline-none focus:ring-1 focus:ring-emerald-50/20 border-none"
            />
            <button
              className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 text-emerald-50 p-2 rounded-lg hover:bg-white/20 transition-all ${email.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
              aria-label="Subscribe"
            >
              <ArrowRight size={16} />
            </button>
          </div>
          {/* WhatsApp CTA */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-hc-secondary text-white px-5 py-3 rounded-xl font-bold text-sm hover:brightness-110 active:scale-[0.97] transition-all font-body"
          >
            <MessageCircle size={16} />
            Contact via WhatsApp
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#011d17] mx-0 px-5 md:px-12 py-7 flex flex-col items-center gap-4">
        <p className="text-emerald-50/40 text-xs font-body">
          Powered by <span className="font-bold text-emerald-50/60">Arivo</span>
        </p>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <p className="text-emerald-50/30 text-xs font-body">
            © {new Date().getFullYear()} Hills Camp Kerala. A Curated Wilderness Experience.
          </p>
          <div className="flex gap-6">
            <span className="text-emerald-50/30 text-xs font-body cursor-default">Privacy Policy</span>
            <span className="text-emerald-50/30 text-xs font-body cursor-default">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
