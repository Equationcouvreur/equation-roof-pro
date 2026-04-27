import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
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
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ArticlesList from "./pages/admin/ArticlesList";
import ArticleEditor from "./pages/admin/ArticleEditor";
import RealisationsList from "./pages/admin/RealisationsList";
import RealisationEditor from "./pages/admin/RealisationEditor";
import Users from "./pages/admin/Users";
import ProtectedRoute from "./components/admin/ProtectedRoute";
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

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
    <WhatsAppButton />
    <BackToTop />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Admin routes (no public navbar/footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="articles" element={<ArticlesList />} />
              <Route path="articles/:id" element={<ArticleEditor />} />
              <Route path="realisations" element={<RealisationsList />} />
              <Route path="realisations/:id" element={<RealisationEditor />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute requireAdmin>
                    <Users />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Public routes */}
            <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
            <Route path="/entreprise" element={<PublicLayout><Entreprise /></PublicLayout>} />
            <Route path="/coeur-de-metier" element={<PublicLayout><CoeurMetier /></PublicLayout>} />
            <Route path="/solutions-innovantes" element={<PublicLayout><SolutionsInnovantes /></PublicLayout>} />
            <Route path="/realisations" element={<PublicLayout><Realisations /></PublicLayout>} />
            <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
            <Route path="/blog/:slug" element={<PublicLayout><BlogArticle /></PublicLayout>} />
            <Route path="/avis-clients" element={<PublicLayout><AvisClients /></PublicLayout>} />
            <Route path="/a-propos" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/mentions-legales" element={<PublicLayout><MentionsLegales /></PublicLayout>} />
            <Route path="/expertises" element={<Navigate to="/coeur-de-metier" replace />} />
            <Route path="/terrasses-ipe" element={<Navigate to="/coeur-de-metier#dalles" replace />} />
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
