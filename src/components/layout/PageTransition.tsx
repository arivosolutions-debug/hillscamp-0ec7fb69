import React, { useEffect, useRef } from 'react';
import { useLocation } from '@/lib/router-compat';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.filter = 'blur(4px)';
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out, filter 0.5s ease-out';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.style.filter = 'blur(0)';
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => cancelAnimationFrame(raf);
  }, [location.pathname]);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};
