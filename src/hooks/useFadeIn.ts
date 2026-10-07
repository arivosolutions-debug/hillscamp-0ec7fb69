import { useEffect, useRef } from 'react';

interface UseFadeInOptions {
  threshold?: number;
  delay?: number;
}

export function useFadeIn(options: UseFadeInOptions = {}) {
  const { threshold = 0.15, delay = 0 } = options;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add('section-fade-up');
    if (delay) el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add('in-view');
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, delay]);

  return ref;
}
