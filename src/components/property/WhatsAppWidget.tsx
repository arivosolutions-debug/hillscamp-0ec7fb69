import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_PHONE = '917510810961';

interface WhatsAppWidgetProps {
  propertyName?: string;
  phone?: string;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  propertyName,
  phone = DEFAULT_PHONE,
}) => {
  const [pulsed, setPulsed] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    const t = setTimeout(() => setPulsed(false), 2500);
    return () => clearTimeout(t);
  }, []);

  // Hide on listings, property detail, and admin pages
  if (pathname === '/listings' || pathname.startsWith('/property/') || pathname.startsWith('/admin')) return null;

  const msg = encodeURIComponent(
    propertyName
      ? `Hi, I'm interested in ${propertyName} at Hills Camp Kerala. Could you share availability and pricing details?`
      : `Hi, I'd like to enquire about a stay`
  );
  const href = `https://wa.me/${phone}?text=${msg}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`lg:hidden fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#1a4724] rounded-full flex flex-col items-center justify-center shadow-[0_8px_24px_rgba(148,71,41,0.35)] hover:scale-110 active:scale-95 transition-transform ${pulsed ? 'animate-pulse' : ''}`}
      aria-label="Enquire via WhatsApp"
    >
      <span className="font-logo text-white leading-none text-base">Enquire</span>
      <span className="font-logo text-white leading-none underline decoration-wavy decoration-white/60 underline-offset-2 text-base">Now</span>
    </a>
  );
};
