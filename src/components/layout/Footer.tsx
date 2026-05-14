import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { useLocations } from '@/hooks/useLocations';

const WHATSAPP_URL =
  'https://wa.me/917510810961?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20a%20Hills%20Camp%20Kerala%20retreat.';

const EXPLORE_LINKS = [
  { label: 'All Stays',        to: '/listings' },
  { label: 'Experiences',      to: '/experiences' },
  { label: 'The Journal',      to: '/blog' },
  { label: 'About Us',         to: '/about' },
  { label: 'Contact Us',       to: '/contact' },
];

const linkCls = 'text-[rgba(167,243,208,0.6)] hover:text-emerald-100 transition-colors text-sm font-body';

export const Footer: React.FC = () => {
  const { data: locations } = useLocations();
  const locationLinks = (locations ?? []).slice(0, 4).map(l => ({
    label: l.name,
    to: `/listings?district=${encodeURIComponent(l.name.toLowerCase().replace(/\s+/g, '-'))}`,
  }));

  return (
    <footer className="relative z-10 bg-[#022c22] rounded-tl-[32px] rounded-tr-[32px]">
      <div className="max-w-content mx-auto px-5 md:px-12 py-16 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">

        {/* Brand */}
        <div>
          <div className="mb-6">
            <Logo variant="light" />
          </div>
          <p className="text-[rgba(167,243,208,0.6)] text-sm leading-relaxed mb-6">
           An editorial retreat experience nestled in the nature.
          </p>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/hillscamp_india?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
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
              href="https://www.linkedin.com/company/hillscamp/"
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
            {locationLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={linkCls}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#011d17] mx-0 px-5 md:px-12 py-7 flex flex-col items-center gap-4">
        <p className="text-emerald-50/40 text-xs font-body">
          Powered by{' '}
          <a
            href="https://arivosolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-emerald-50/60 hover:text-emerald-50 transition-colors"
          >
            Arivo Solutions
          </a>
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
