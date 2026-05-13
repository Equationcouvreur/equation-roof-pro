import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, User } from "lucide-react";
import logoMain from "@/assets/logo-equation-main.png";

const coeurMetier = [
  { label: "Isolation Thermique", href: "/coeur-de-metier#isolation" },
  { label: "Étanchéité Bitumineuse", href: "/coeur-de-metier#bitumineuse" },
  { label: "Étanchéité Résine", href: "/coeur-de-metier#resine" },
  { label: "Terrasses Dalles sur Plots", href: "/coeur-de-metier#dalles" },
  { label: "Toitures Végétalisées", href: "/coeur-de-metier#vegetalisee" },
  { label: "Sécurité — Éclairage Zénithal — Désenfumage", href: "/coeur-de-metier#securite-desenfumage" },
  { label: "Recherche de Fuite", href: "/coeur-de-metier#fuite" },
];

const solutionsInnovantes = [
  { label: "Isolation FOAMGLAS — 30 Ans", href: "/solutions-innovantes#foamglas" },
  { label: "Toitures Froides / Cool Roof", href: "/solutions-innovantes#cool-roof" },
  { label: "Panneaux Photovoltaïques", href: "/solutions-innovantes#photovoltaique" },
  { label: "Revêtement Quartz", href: "/solutions-innovantes#quartz" },
];

const navLinks = [
  { label: "Qui sommes-nous", href: "/entreprise" },
  { label: "Notre Cœur de Métier", href: "/coeur-de-metier", submenu: coeurMetier },
  { label: "Solutions Innovantes", href: "/solutions-innovantes", submenu: solutionsInnovantes },
  { label: "Réalisations", href: "/realisations" },
  { label: "Blog", href: "/blog" },
  { label: "Avis Clients", href: "/avis-clients" },
  
  { label: "Recrutement", href: "/recrutement" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  const isHome = location.pathname === "/";
  const navBg = scrolled
    ? "bg-noir/95 backdrop-blur-md shadow-md"
    : isHome
    ? "bg-transparent"
    : "bg-popover/95 backdrop-blur-md shadow-md";

  const textColor = scrolled || isHome ? "text-primary-foreground" : "text-foreground";

  return (
    <>
      {/* Urgency bar */}
      <div className="bg-primary text-primary-foreground text-xs sm:text-sm py-1.5 fixed top-0 left-0 right-0 z-50 font-subtitle font-medium w-full max-w-[100vw] mx-auto overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-[400px]:flex-row items-center justify-center gap-1.5 min-[400px]:gap-3 text-center">
          <div className="text-center">
            <span className="hidden sm:inline">⚡ Urgence infiltration ? Appelez le </span>
            <a href="tel:0473875350" className="underline font-bold whitespace-nowrap">04 73 87 53 50</a>
            <span className="hidden md:inline"> — Intervention rapide en Auvergne</span>
          </div>
          <Link
            to="/contact"
            className="bg-primary-foreground text-primary text-[11px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded hover:bg-primary-foreground/90 transition-colors whitespace-nowrap"
          >
            <span className="sm:hidden">Prendre RDV</span>
            <span className="hidden sm:inline">Je prends rendez-vous</span>
          </Link>
        </div>
      </div>

      <nav className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 ${navBg}`}>
        <div className="container-main flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center">
            <img src={logoMain} alt="EQUATION Étanchéité Toitures Terrasses" className="h-10 md:h-12 w-auto" width={1920} height={566} loading="eager" {...({ fetchpriority: "high" } as Record<string, string>)} decoding="async" />
          </Link>

          <div className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative group"
                onMouseEnter={() => link.submenu && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={link.href}
                  className={`flex items-center gap-1 text-sm font-subtitle font-medium transition-colors hover:text-primary ${
                    location.pathname === link.href ? "text-primary" : textColor
                  }`}
                >
                  {link.label}
                  {link.submenu && <ChevronDown className="w-3 h-3" />}
                </Link>

                {link.submenu && openDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 bg-popover rounded-lg shadow-lg border border-border py-2 min-w-[260px] z-50">
                    {link.submenu.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.href}
                        className="block px-4 py-2 text-sm font-body text-foreground hover:bg-muted hover:text-primary transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              to="/espace-client"
              rel="nofollow"
              className={`flex items-center gap-1 text-sm font-subtitle font-medium transition-colors hover:text-primary ${
                location.pathname.startsWith("/espace-client") ? "text-primary" : textColor
              }`}
            >
              <User className="w-4 h-4" /> Espace Client
            </Link>

            <Link to="/contact" className="btn-bordeaux text-sm py-2 px-5 rounded-lg">
              Demander un Devis
            </Link>
          </div>

          <button
            className={`xl:hidden ${textColor}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-noir flex flex-col pt-20 px-6 xl:hidden overflow-y-auto">
          <button
            className="absolute top-12 right-6 text-primary-foreground"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="flex flex-col gap-4 pb-10">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  to={link.href}
                  className="text-primary-foreground text-lg font-heading font-semibold hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
                {link.submenu && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {link.submenu.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.href}
                        className="text-primary-foreground/85 text-sm font-body hover:text-primary transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              to="/espace-client"
              rel="nofollow"
              className="flex items-center gap-2 text-primary-foreground text-lg font-heading font-semibold hover:text-primary transition-colors"
            >
              <User className="w-5 h-5" /> Espace Client
            </Link>
            <Link to="/contact" className="btn-bordeaux text-center text-lg mt-4">
              Demander un Devis
            </Link>
            <a href="tel:0473875350" className="flex items-center gap-2 text-primary-foreground font-subtitle text-lg">
              <Phone className="w-5 h-5" /> 04 73 87 53 50
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
