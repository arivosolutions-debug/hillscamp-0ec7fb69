import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, Compass, Headphones, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import aboutHero from '@/assets/about-hero.jpg';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import type { TeamMember } from '@/lib/types';

const WHY_CARDS = [
  {
    icon: Heart,
    title: 'Handpicked With Heart',
    body: "We personally vet every stay to ensure it's more than just a room — it's a space where you can truly belong.",
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  },
  {
    icon: Compass,
    title: 'Pure, Raw Adventure',
    body: 'From rugged treks to hidden trails, we design experiences that get you away from the crowds and back to nature.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
  },
  {
    icon: Headphones,
    title: 'Always By Your Side',
    body: "We're a hands-on team that stays connected from your first enquiry to your journey home, making sure every detail feels right.",
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  },
];

const FALLBACK_TEAM: TeamMember[] = [
  { id: '1', name: 'Shibin', role: '', bio: null, photo_url: null, sort_order: 0 },
  { id: '2', name: 'Aloysius', role: '', bio: null, photo_url: null, sort_order: 1 },
  { id: '3', name: 'Ameer', role: '', bio: null, photo_url: null, sort_order: 2 },
  { id: '4', name: 'Suhail', role: '', bio: null, photo_url: null, sort_order: 3 },
  { id: '5', name: 'Richu', role: '', bio: null, photo_url: null, sort_order: 4 },
];

const About = () => {
  const { data: team } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const { data, error } = await supabase.from('team_members').select('*').order('sort_order');
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const displayTeam = team?.length ? team : FALLBACK_TEAM;

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-hc-bg text-hc-text font-body antialiased">

          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <section className="relative min-h-[calc(85vh-170px)] flex flex-col items-center justify-center text-center overflow-hidden rounded-b-[32px]">
            <div className="absolute inset-0 rounded-b-[32px] overflow-hidden">
              <img
                src={aboutHero}
                alt="Mountain camp in the hills"
                className="w-full h-full object-cover object-[center_calc(50%+100px)]"
                loading="eager"
              />
            </div>
            <div className="relative z-10 px-6 max-w-3xl mx-auto">
              <h1 className="font-headline text-white text-4xl md:text-7xl lg:text-8xl leading-[0.95] mb-6">
                A Better Way{' '}
                <br className="md:hidden" />
                to <em className="text-hc-accent not-italic">Wander!</em>
              </h1>
              <p className="text-white/70 text-base md:text-xl max-w-lg mx-auto leading-relaxed font-body italic mb-10">
                It's about the morning mist on a trek!
              </p>
              <div className="flex items-center justify-center gap-4 mb-[-20px]">
                <Link
                  to="/listings"
                  className="bg-white text-hc-primary px-8 py-3 rounded-full font-bold text-sm hover:bg-white/90 transition-colors font-body"
                >
                  Stays
                </Link>
                <Link
                  to="/experiences"
                   className="bg-white text-hc-primary px-8 py-3 rounded-full font-bold text-sm hover:bg-white/90 transition-colors font-body"
                >
                  Experiences
                </Link>
              </div>
            </div>
          </section>

          {/* ── Why Hills Camp? ───────────────────────────────────────────── */}
          <section className="py-20 md:py-28 px-6 max-w-[1280px] mx-auto">
            <div className="mb-4">
              <h2 className="font-headline text-hc-primary text-3xl md:text-5xl leading-tight">
                Why Hills Camp?
              </h2>
              <Link
                to="/blog"
                className="text-hc-secondary font-bold flex items-center gap-1.5 font-body text-sm mt-2 hover:opacity-80 transition-opacity"
              >
                Read Stories <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {WHY_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="relative rounded-[2rem] overflow-hidden aspect-[2/1] md:aspect-[3/4] group"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 md:inset-auto md:bottom-0 md:left-0 md:right-0 flex flex-col justify-center md:block p-4 md:p-8 text-center md:text-left">
                    <h3 className="font-headline text-white text-base md:text-2xl mb-1 md:mb-2 leading-tight font-bold">
                      {card.title}
                    </h3>
                    <p className="text-white/75 text-xs md:text-sm leading-snug md:leading-relaxed font-body">
                      {card.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Standards ─────────────────────────────────────────────────── */}
          <section className="py-20 md:py-28 px-6 bg-hc-bg-alt">
            <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-headline text-hc-primary text-3xl md:text-5xl leading-tight mb-8">
                  Standards
                </h2>
                <p className="text-hc-text text-base md:text-lg leading-relaxed font-body">
                  Today's travel is about more than a destination. It's about the morning mist on a trek, the thrill of a hike, and the magic found in stays that tell a story. We realized that travelers are looking for quality, depth, and moments they never want to forget.
                </p>
              </div>
              <div className="flex items-center gap-12 md:gap-16 justify-center lg:justify-end">
                <div className="text-center">
                  <span className="font-headline text-hc-primary text-5xl md:text-6xl block">15</span>
                  <p className="text-xs text-hc-text-light uppercase tracking-[0.2em] mt-2 font-bold font-body">
                    Estates
                  </p>
                </div>
                <div className="text-center">
                  <span className="font-headline text-hc-primary text-5xl md:text-6xl block">1000+</span>
                  <p className="text-xs text-hc-text-light uppercase tracking-[0.2em] mt-2 font-bold font-body">
                    Trips Completed
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Team ──────────────────────────────────────────────────────── */}
          <section className="py-20 md:py-28 px-6 max-w-[1280px] mx-auto">
            <div className="mb-10">
              <h2 className="font-headline text-hc-primary text-3xl md:text-5xl leading-tight mb-3">
                The People Behind the Peaks
              </h2>
              <p className="text-hc-text text-base md:text-lg max-w-xl font-body">
                A team of explorers and storytellers who share one belief: nature is the ultimate luxury.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {displayTeam.map((member) => (
                <div key={member.id} className="group">
                  <div className="aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-hc-bg-alt relative">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-hc-bg-alt">
                        <span className="font-headline text-4xl md:text-5xl text-hc-text-light">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Name overlay on image */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 md:p-4">
                      <span className="text-white font-bold font-body text-sm md:text-base">
                        {member.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA Banner ────────────────────────────────────────────────── */}
          <section className="relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1920&q=80"
              alt="Western Ghats aerial"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.35]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-hc-primary/40" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-hc-bg to-transparent" />

            <div className="relative z-10 text-center px-6 max-w-3xl">
              <h2 className="font-headline text-white text-4xl md:text-6xl leading-tight mb-8">
                Start your <em className="not-italic block md:inline">own story!</em>
              </h2>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 bg-hc-secondary text-white px-10 py-4 rounded-full font-bold text-base hover:brightness-110 transition-all font-body"
              >
                Enquire Now
              </Link>
            </div>
          </section>

        </main>
        <Footer />
      </PageTransition>
    </>
  );
};

export default About;
