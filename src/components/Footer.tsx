import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logoMain from "@/assets/logo-equation-main.png";
import signatureImg from "@/assets/signature-efficacite.png";
import bannerImg from "@/assets/banner-equation-02.png";

const Footer = () => (
  <footer className="bg-noir text-primary-foreground border-t-[3px] border-primary">
    {/* Banner */}
    <div className="w-full overflow-hidden max-w-[100vw]">
      <img src={bannerImg} alt="EQUATION Étanchéité toitures terrasses — réalisations chantiers" className="w-full object-cover object-center" style={{ height: "clamp(80px, 12vw, 140px)" }} loading="lazy" decoding="async" width={1920} height={181} />
    </div>

    <div className="container-main section-padding">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1 */}
        <div>
          <Link to="/">
            <img src={logoMain} alt="EQUATION Étanchéité" className="h-14 w-auto mb-4" loading="lazy" decoding="async" width={1920} height={566} />
          </Link>
          <div className="flex flex-col gap-3 text-sm font-body">
            <a href="https://maps.google.com/?q=74+avenue+du+Midi+63800+Cournon-d'Auvergne" target="_blank" rel="noopener" className="flex items-start gap-2 text-primary-foreground/80 hover:text-primary transition-colors">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              74 avenue du Midi, 63800 Cournon-d'Auvergne
            </a>
            <a href="tel:0473875350" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary transition-colors">
              <Phone className="w-4 h-4 shrink-0" /> 04 73 87 53 50
            </a>
            <a href="mailto:info@etanche.com" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary transition-colors">
              <Mail className="w-4 h-4 shrink-0" /> info@etanche.com
            </a>
            <Link to="/espace-client" className="text-xs text-primary-foreground/60 hover:text-primary transition-colors mt-2">
              Accès Espace Client →
            </Link>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="font-subtitle font-semibold text-sm uppercase tracking-wider mb-4 text-primary">Cœur de Métier</h4>
          <div className="flex flex-col gap-2 text-sm font-body">
            {[
              { l: "Isolation Thermique", h: "/coeur-de-metier#isolation" },
              { l: "Étanchéité Bitumineuse", h: "/coeur-de-metier#bitumineuse" },
              { l: "Étanchéité Résine", h: "/coeur-de-metier#resine" },
              { l: "Dalles sur Plots", h: "/coeur-de-metier#dalles" },
              { l: "Toitures Végétalisées", h: "/coeur-de-metier#vegetalisee" },
              { l: "Sécurité & Désenfumage", h: "/coeur-de-metier#securite-desenfumage" },
              { l: "Recherche de Fuite", h: "/coeur-de-metier#fuite" },
            ].map((e) => (
              <Link key={e.l} to={e.h} className="text-primary-foreground/70 hover:text-primary transition-colors">{e.l}</Link>
            ))}
          </div>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="font-subtitle font-semibold text-sm uppercase tracking-wider mb-4 text-primary">L'Entreprise</h4>
          <div className="flex flex-col gap-2 text-sm font-body">
            <Link to="/entreprise" className="text-primary-foreground/70 hover:text-primary transition-colors">Qui sommes-nous</Link>
            <Link to="/solutions-innovantes" className="text-primary-foreground/70 hover:text-primary transition-colors">Solutions Innovantes</Link>
            <Link to="/realisations" className="text-primary-foreground/70 hover:text-primary transition-colors">Réalisations</Link>
            <Link to="/blog" className="text-primary-foreground/70 hover:text-primary transition-colors">Blog</Link>
            <Link to="/avis-clients" className="text-primary-foreground/70 hover:text-primary transition-colors">Avis Clients</Link>
            <Link to="/recrutement" className="text-primary-foreground/70 hover:text-primary transition-colors">Recrutement / Nous rejoindre</Link>
            <Link to="/contact" className="text-primary-foreground/70 hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="font-subtitle font-semibold text-sm uppercase tracking-wider mb-4 text-primary">Informations</h4>
          <div className="flex flex-col gap-2 text-sm font-body">
            <Link to="/mentions-legales" className="text-primary-foreground/70 hover:text-primary transition-colors">Mentions légales</Link>
            <Link to="/mentions-legales" className="text-primary-foreground/70 hover:text-primary transition-colors">Politique de confidentialité</Link>
          </div>
          <div className="mt-6">
            <img src={signatureImg} alt="Équation - L'efficacité en Action" className="h-16 w-auto opacity-70" loading="lazy" decoding="async" width={312} height={159} />
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10 py-4">
      <div className="container-main text-center text-xs text-primary-foreground/50 font-body">
        © 2001–2026 EQUATION SARL — Tous droits réservés — SIRET 435 378 567 00042
      </div>
    </div>
  </footer>
);

export default Footer;
