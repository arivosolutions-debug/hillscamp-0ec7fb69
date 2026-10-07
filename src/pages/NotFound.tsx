import { Link, useLocation } from "@/lib/router-compat";
import { useEffect } from "react";
import { ArrowLeft, Leaf } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-hc-primary flex items-center justify-center overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1800&q=80"
          alt="Misty Western Ghats forest"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-hc-primary/60 via-hc-primary/40 to-hc-primary/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-2xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Leaf size={28} className="text-hc-accent" />
          </div>
        </div>

        <p className="font-label text-hc-accent text-xs tracking-[0.4em] mb-6">
          404 — Lost in the Wilderness
        </p>

        <h1 className="font-headline text-white text-5xl md:text-7xl leading-tight mb-6">
          You've wandered<br />
          <em className="text-hc-accent">off the trail.</em>
        </h1>

        <p className="font-body text-white/60 text-lg leading-relaxed mb-12 max-w-md mx-auto">
          The path you're looking for doesn't exist — but the wilderness is full of beautiful detours.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-white text-hc-primary-deep px-10 py-5 rounded-xl font-bold text-sm hover:bg-hc-accent-light transition-all active:scale-[0.97] group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return Home
        </Link>
      </div>

      {/* Decorative floating mist */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-hc-primary to-transparent pointer-events-none" />
    </div>
  );
};

export default NotFound;
