import React, { useState } from 'react';
import { MapPin, Mail, Clock, Send, ExternalLink, MessageCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { supabase } from '@/integrations/supabase/client';
import { useProperties } from '@/hooks/useProperties';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { z } from 'zod';

const enquirySchema = z.object({
  name:        z.string().trim().min(1, 'Name is required').max(100),
  email:       z.string().trim().email('Invalid email address').max(255),
  phone:       z.string().trim().max(30).optional(),
  dates:       z.string().trim().max(100).optional(),
  message:     z.string().trim().min(1, 'Message is required').max(2000),
  property_id: z.string().optional(),
});

type EnquiryForm = z.infer<typeof enquirySchema>;

const Contact = () => {
  const [form, setForm]     = useState<EnquiryForm>({ name: '', email: '', phone: '', dates: '', message: '', property_id: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryForm, string>>>({});
  const [loading, setLoading] = useState(false);

  const { data: properties } = useProperties();

  const set = (field: keyof EnquiryForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = enquirySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof EnquiryForm;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke('submit-enquiry', {
        body: {
          name:        result.data.name,
          email:       result.data.email,
          phone:       result.data.phone || null,
          message:     `${result.data.dates ? `Proposed dates: ${result.data.dates}\n\n` : ''}${result.data.message}`,
          property_id: result.data.property_id || null,
        },
      });
      if (fnError) throw fnError;
      if (fnData?.error) throw new Error(fnData.error);
      toast({ title: 'Message sent!', description: "We'll be in touch within 24 hours to help plan your stay." });
      setForm({ name: '', email: '', phone: '', dates: '', message: '', property_id: '' });
      setErrors({});
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again or reach us via WhatsApp.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  /* Input base styles — light surface bg, terracotta focus ring */
  const inputCls = (field: keyof EnquiryForm) =>
    `w-full bg-[#f5f3f3] border rounded-xl px-5 py-4 text-[#17341e] placeholder:text-[#424842]/40 font-body text-sm outline-none transition-all
     ${errors[field]
       ? 'border-red-400 focus:border-red-400'
       : 'border-[#c2c8bf]/30 focus:border-[#924a29]'
     }`;

  const labelCls = 'block text-[10px] font-bold uppercase tracking-[0.35em] text-[#924a29] mb-2 font-body';

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="min-h-screen bg-hc-bg font-body antialiased">

          {/* ── Header ── */}
          <section className="pt-36 pb-12 px-8 max-w-[1280px] mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-[1px] w-10 bg-[#924a29]" />
              <span className="text-[#924a29] text-[10px] font-bold uppercase tracking-[0.4em] font-body">
                Reach Out to Us
              </span>
              <div className="h-[1px] w-10 bg-[#924a29]" />
            </div>
            <h1 className="font-headline text-[#17341e] text-5xl md:text-7xl tracking-tight leading-[1.05] mb-6">
              Let's Plan Your<br /><em className="text-[#924a29]">Escape</em> Together
            </h1>
            <p className="text-[#424842] text-lg max-w-2xl mx-auto leading-relaxed font-body">
              Whether you have a specific property in mind or need help curating the perfect retreat,
              our team is here to guide you every step of the way.
            </p>
          </section>

          {/* ── Bento Grid ── */}
          <section className="px-8 max-w-[1280px] mx-auto pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left column */}
              <div className="lg:col-span-5 space-y-6">

                {/* WhatsApp hero card */}
                <div className="bg-[#25D366]/10 border border-[#25D366]/25 rounded-3xl p-10 relative overflow-hidden">
                  {/* Ghost background icon */}
                  <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.07] select-none pointer-events-none">
                    <MessageCircle size={220} className="text-[#25D366]" />
                  </div>
                  <div className="relative">
                    {/* Prominent icon badge */}
                    <div className="w-16 h-16 bg-[#25D366]/15 rounded-2xl flex items-center justify-center mb-6">
                      <MessageCircle size={32} strokeWidth={1.5} className="text-[#25D366]" />
                    </div>
                    <h2 className="font-headline text-[#17341e] text-2xl mb-3">Chat on WhatsApp</h2>
                    <p className="text-[#424842] text-sm leading-relaxed mb-8 max-w-xs">
                      The fastest way to reach us. Typical reply time is under 30 minutes during business hours.
                    </p>
                    <a
                      href="https://wa.me/917510810961?text=Hi%2C%20I'd%20like%20to%20enquire%20about%20a%20Hills%20Camp%20Kerala%20retreat."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2 hover:brightness-105 transition-all active:scale-[0.97] shadow-lg shadow-[#25D366]/20 font-body"
                    >
                      Start a Conversation <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                {/* Email & Hours */}
                <div className="bg-[#f5f3f3] rounded-3xl p-10">
                  <div className="mb-8">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#924a29] mb-2 flex items-center gap-2 font-body">
                      <Mail size={11} /> Email Enquiries
                    </h3>
                    <a
                      href="mailto:hillscampbypovaam@gmail.com"
                      className="font-headline text-[#17341e] text-lg hover:text-[#924a29] transition-colors break-words"
                    >
                      hillscampbypovaam@gmail.com
                    </a>
                  </div>
                  <div className="border-t border-[#c2c8bf]/30 pt-8">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#924a29] mb-2 flex items-center gap-2 font-body">
                      <Clock size={11} /> Response Hours
                    </h3>
                    <p className="text-[#17341e] font-semibold text-lg">Mon – Sat, 9AM – 7PM IST</p>
                    <p className="text-sm text-[#424842] mt-1">Weekend enquiries replied by Sunday</p>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-[#f5f3f3] rounded-3xl p-10">
                  <div className="flex items-start gap-6">
                    <MapPin size={22} className="text-[#924a29] mt-1 shrink-0" />
                    <div>
                       <h3 className="font-headline text-[#17341e] text-xl mb-3">Estate Office</h3>
                       <p className="text-[#424842] leading-relaxed mb-4 font-body whitespace-pre-line">
                         O.NO 87/2C, 7th Main Road{"\n"}
                         Tavrekere, Bangalore 560029
                       </p>
                      <a
                        href="https://www.openstreetmap.org/?mlat=10.09&mlon=77.06#map=12/10.09/77.06"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#924a29] font-bold text-sm underline decoration-[#924a29]/30 underline-offset-4 hover:decoration-[#924a29] transition-colors font-body"
                      >
                        View on Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column — Form */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-10 lg:p-14 h-full shadow-sm">
                  <div className="mb-8">
                    <h2 className="font-headline text-[#17341e] text-2xl">Send a Message</h2>
                    <p className="text-[#424842] text-sm mt-1 font-body">We respond to all enquiries within 24 hours.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-7" noValidate>

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>Name <span className="text-red-400 normal-case tracking-normal">*</span></label>
                        <input type="text" value={form.name} onChange={set('name')} placeholder="Your full name" className={inputCls('name')} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Email Address <span className="text-red-400 normal-case tracking-normal">*</span></label>
                        <input type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" className={inputCls('email')} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Phone + Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>Phone (optional)</label>
                        <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" className={inputCls('phone')} />
                      </div>
                      <div>
                        <label className={labelCls}>Proposed Dates</label>
                        <input type="text" value={form.dates} onChange={set('dates')} placeholder="e.g. Oct 12 – Oct 15" className={inputCls('dates')} />
                      </div>
                    </div>

                    {/* Property selector */}
                    {properties && properties.length > 0 && (
                      <div>
                        <label className={labelCls}>Property of Interest (optional)</label>
                        <select value={form.property_id} onChange={set('property_id')} className={`${inputCls('property_id')} cursor-pointer`}>
                          <option value="">— Any / Not sure yet —</option>
                          {properties.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Message */}
                    <div>
                      <label className={labelCls}>Your Message <span className="text-red-400 normal-case tracking-normal">*</span></label>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={set('message')}
                        placeholder="Tell us about your ideal retreat — number of guests, special requirements, or anything on your mind..."
                        className={`${inputCls('message')} resize-none`}
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#924a29] text-white px-12 py-5 rounded-xl font-bold flex items-center gap-3 hover:bg-[#753414] transition-colors active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed font-body"
                    >
                      {loading ? 'Sending…' : 'Send Enquiry'}
                      {!loading && <Send size={18} />}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </section>

          {/* ── Kerala Landscape Banner ── */}
          <section className="px-8 max-w-[1280px] mx-auto pb-20">
            <div className="relative rounded-3xl overflow-hidden h-[500px] md:h-[560px]">
              <img
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80"
                alt="Aerial view of Kerala tea plantations in the Western Ghats"
                className="w-full h-full object-cover"
              />
              {/* Gradient from bottom for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050a07]/80 via-[#050a07]/20 to-transparent" />
              {/* Info card */}
              <div className="absolute bottom-10 left-8 md:left-12 bg-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 max-w-sm border border-white/20">
                <h3 className="font-headline text-white text-xl mb-3">The Heart of Kerala</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4 font-body">
                  Our estates are nestled deep within the Western Ghats, accessible through scenic mountain roads.
                </p>
                <div className="bg-black/20 rounded-xl overflow-hidden h-32 border border-white/10">
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=76.6%2C10.0%2C77.2%2C10.5&layer=mapnik&marker=10.09%2C76.92"
                    className="w-full h-full"
                    style={{ border: 0 }}
                    title="Hills Camp Kerala location map"
                  />
                </div>
              </div>
            </div>
          </section>

        </main>
        <Footer />
      </PageTransition>
      <Toaster />
    </>
  );
};

export default Contact;
