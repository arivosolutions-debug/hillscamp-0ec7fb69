import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WhatsAppWidget } from "@/components/property/WhatsAppWidget";
import Index from "./pages/Index";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import WayanadResorts from "./pages/WayanadResorts";
import MunnarHomestays from "./pages/MunnarHomestays";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Experiences from "./pages/Packages";
import PackageDetail from "./pages/PackageDetail";
import { Blog, BlogPost } from "./pages/Blog";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/property/:slug" element={<PropertyDetail />} />
          <Route path="/wayanad-resorts" element={<WayanadResorts />} />
          <Route path="/munnar-homestays" element={<MunnarHomestays />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/packages" element={<Experiences />} />
          <Route path="/packages/:slug" element={<PackageDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/journal" element={<Blog />} />
          <Route path="/journal/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <WhatsAppWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
