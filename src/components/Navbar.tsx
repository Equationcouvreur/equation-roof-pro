import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import logoMain from "@/assets/logo-equation-main.png";

const expertises = [
  { label: "Étanchéité Bitumineuse", href: "/expertises#bitumineuse" },
  { label: "Étanchéité Résine", href: "/expertises#resine" },
  { label: "Revêtement Quartz", href: "/expertises#quartz" },
  { label: "Recherche de Fuite", href: "/expertises#fuite" },
  { label: "Dalles sur Plots", href: "/expertises#dalles" },
  { label: "Toiture Végétalisée", href: "/expertises#vegetalisee" },
];

const ipeItems = [
  { label: "Lames IPE", href: "/terrasses-ipe#lames" },
  { label: "Dalles IPE", href: "/terrasses-ipe#dalles" },
  { label: "Margelles Piscine", href: "/terrasses-ipe#margelles" },
  { label: "Bardage IPE", href: "/terrasses-ipe#bardage" },
];

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Nos Expertises", href: "/expertises", submenu: expertises },
  { label: "Réalisations", href: "/realisations" },
  { label: "Terrasses IPE", href: "/terrasses-ipe", submenu: ipeItems },
  { label: "Blog", href: "/blog" },
  { label: "À Propos", href: "/a-propos" },
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
      <div className="bg-primary text-primary-foreground text-sm py-1.5 text-center font-subtitle font-medium fixed top-0 left-0 right-0 z-50">
        <span className="hidden sm:inline">⚡ Urgence infiltration ? Appelez le </span>
        <a href="tel:0473875350" className="underline font-bold">04 73 87 53 50</a>
        <span className="hidden sm:inline"> — Intervention rapide en Auvergne</span>
      </div>

      <nav className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 ${navBg}`}>
        <div className="container-main flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logoMain} alt="EQUATION Étanchéité Toitures Terrasses" className="h-10 md:h-12 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
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
                  <div className="absolute top-full left-0 mt-1 bg-popover rounded-lg shadow-lg border border-border py-2 min-w-[220px] z-50">
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

            <Link to="/contact" className="btn-bordeaux text-sm py-2 px-5 rounded-lg">
              Demander un Devis
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className={`lg:hidden ${textColor}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-noir flex flex-col pt-20 px-6 lg:hidden">
          <button
            className="absolute top-12 right-6 text-primary-foreground"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  to={link.href}
                  className="text-primary-foreground text-xl font-heading font-semibold hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
                {link.submenu && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {link.submenu.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.href}
                        className="text-primary-foreground/70 text-base font-body hover:text-primary transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <Link to="/contact" className="btn-bordeaux text-center text-lg">
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
