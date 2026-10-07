import React, { useEffect, useRef } from 'react';

export const ParallaxSection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const content = section.querySelector<HTMLElement>('.parallax-content');
    if (!content) return;
    content.classList.add('section-fade-up');
    const observer = new IntersectionObserver(
      ([e]) => {if (e?.isIntersecting) content.classList.add('in-view');},
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ height: '700px' }}>
      
      {/* Parallax background */}
      <div
        className="absolute inset-0 hero-parallax"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=2000&q=80')`
        }} />
      
      {/* Primary colour overlay at 60% */}
      <div className="absolute inset-0 bg-hc-primary" style={{ opacity: 0.60 }} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8 parallax-content bg-zinc-50/[0.27]">
        <p className="font-label text-xs tracking-[0.4em] text-hc-accent-light/70 mb-8">
          THE WESTERN GHATS PROMISE
        </p>
        <h2 className="font-headline text-5xl md:text-6xl text-white italic leading-tight mb-6 max-w-3xl">
          "The hills are not a backdrop to your stay. They are the entire point of it."
        </h2>
        <p className="text-white/70 font-body text-lg max-w-xl leading-relaxed">
          Every retreat is chosen because it cannot be replicated anywhere else on earth.
          The landscape is not scenery; it is the experience itself.
        </p>
      </div>
    </section>);

};