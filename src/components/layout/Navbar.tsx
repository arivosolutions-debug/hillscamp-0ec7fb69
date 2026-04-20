import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, MessageCircle } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

const WHATSAPP_URL =
  "https://wa.me/919847012345?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20a%20Hills%20Camp%20Kerala%20retreat.";

const NAV_LINKS = [
  { label: "Stays", to: "/listings", exact: ["/listings"] },
  { label: "Experiences", to: "/experiences", exact: ["/experiences"] },
  { label: "Discover", to: "/about", exact: ["/about"] },
  { label: "Journal", to: "/blog", exact: ["/blog", "/journal"] },
];

const MOBILE_NAV_LINKS = [...NAV_LINKS, { label: "Contact Us", to: "/contact", exact: ["/contact"] }];

/* Pages with dark hero backgrounds where navbar text should be white when not scrolled */
const DARK_HERO_PAGES = ["/", "/experiences", "/about"];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isActive = (exact: string[]) => exact.includes(location.pathname);

  const isDarkHero = DARK_HERO_PAGES.includes(location.pathname);
  const isLight = !scrolled && isDarkHero;
  const isMobileAlwaysDark = true; // navbar always has solid bg on mobile

  const textPrimary = isLight ? "text-white" : "text-hc-primary-deep";
  const textMuted = isLight ? "text-white/70" : "text-hc-primary-deep/70";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-hc-bg/90 backdrop-blur-xl shadow-float" : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center max-w-content mx-auto px-5 md:px-8 py-4 md:py-6">
          {/* Logo */}
          <Logo variant={isLight ? "light" : "dark"} />

          {/* Desktop nav */}
          <div className="hidden md:flex gap-10 items-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-body text-sm transition-colors duration-200 ${
                  isActive(link.exact)
                    ? `${textPrimary} font-bold border-b-2 border-hc-secondary pb-0.5`
                    : `${textMuted} font-medium hover:${textPrimary}`
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-5">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 bg-hc-secondary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:brightness-110 transition-all active:scale-[0.97]"
            >
              <MessageCircle size={15} />
              Book Now
            </a>
            <button
              className={`md:hidden ${textPrimary} p-1`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={33} /> : <Menu size={33} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-[#022c22]" />
        <nav className="absolute inset-0 flex flex-col items-center justify-center gap-8">
          {MOBILE_NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-headline text-2xl text-white hover:text-hc-accent transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-64 inline-flex items-center justify-center gap-2 bg-hc-secondary text-white px-8 py-4 rounded-full font-bold text-base"
          >
            <MessageCircle size={18} />
            Book Now
          </a>
        </nav>
      </div>
    </>
  );
};
