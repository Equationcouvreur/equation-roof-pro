import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import Index from "./pages/Index";
import Entreprise from "./pages/Entreprise";
import CoeurMetier from "./pages/CoeurMetier";
import SolutionsInnovantes from "./pages/SolutionsInnovantes";
import Realisations from "./pages/Realisations";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import AvisClients from "./pages/AvisClients";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MentionsLegales from "./pages/MentionsLegales";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/entreprise" element={<Entreprise />} />
            <Route path="/coeur-de-metier" element={<CoeurMetier />} />
            <Route path="/solutions-innovantes" element={<SolutionsInnovantes />} />
            <Route path="/realisations" element={<Realisations />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/avis-clients" element={<AvisClients />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            {/* Legacy redirects */}
            <Route path="/expertises" element={<Navigate to="/coeur-de-metier" replace />} />
            <Route path="/terrasses-ipe" element={<Navigate to="/coeur-de-metier#dalles" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
        <BackToTop />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
