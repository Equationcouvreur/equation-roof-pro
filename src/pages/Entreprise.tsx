import { Award, Shield, PenTool, Clock, Building2, Landmark, Users, Briefcase, User, Leaf } from "lucide-react";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import SEO from "@/components/SEO";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PAGE_SEO } from "@/lib/seo-config";
import signatureImg from "@/assets/signature-efficacite.png";
import thierryImg from "@/assets/thierry-meylan.jpg";
import ThierryCarousel from "@/components/ThierryCarousel";
import certificationsImg from "@/assets/certifications.png";

// TODO: Remplacer par les vrais logos officiels fournis par Thibaut/Thierry
const partners = [
  { src: ffbLogo, name: "Fédération Française du Bâtiment", short: "FFB", url: "https://www.ffbatiment.fr", alt: "Logo Fédération Française du Bâtiment - EQUATION membre depuis plus de 20 ans" },
  { src: csfeLogo, name: "Chambre Syndicale Française de l'Étanchéité", short: "CSFE", url: "https://www.ffbatiment.fr/organisation-ffb/unions-syndicats-metier/csfe", alt: "Logo Chambre Syndicale Française de l'Étanchéité - EQUATION membre actif" },
  { src: nrcaLogo, name: "National Roofing Contractors Association", short: "NRCA", url: "https://www.nrca.net", alt: "Logo National Roofing Contractors Association - EQUATION membre international" },
  { src: qualibatLogo, name: "Qualibat - Certification Qualité Bâtiment", short: "Qualibat", url: "https://www.qualibat.com", alt: "Logo Qualibat - EQUATION certifié qualité bâtiment" },
  { src: rgeLogo, name: "Reconnu Garant de l'Environnement", short: "RGE", url: "https://www.faire.gouv.fr", alt: "Logo RGE Reconnu Garant de l'Environnement - EQUATION certifié rénovation énergétique" },
];

const reasons = [
  { icon: Clock, title: "25 Ans d'Expérience", desc: "Depuis 2001, plus de 2 000 chantiers réalisés sur tous types de bâtiments en Auvergne." },
  { icon: Award, title: "Certifications Reconnues", desc: "Qualibat RGE, CSFE, Reconnu Grenelle Environnement, membre actif FFB 63." },
  { icon: Shield, title: "Garantie Décennale", desc: "Tous nos ouvrages couverts. Travail dans le respect strict des DTU 43.1, 43.3, 43.4 et 43.5." },
  { icon: PenTool, title: "Bureau d'Études Intégré", desc: "Études techniques et croquis DAO 3D en interne pour des solutions sur mesure." },
];

const clients = [
  { icon: Building2, label: "Bailleurs sociaux", desc: "Auvergne Habitat, Niévre Habitat" },
  { icon: Landmark, label: "Collectivités publiques", desc: "Établissements et services publics" },
  { icon: Users, label: "Copropriétés et syndics", desc: "Gestion immobilière collective" },
  { icon: PenTool, label: "Architectes et BET", desc: "Bureaux d'études techniques" },
  { icon: Briefcase, label: "Entreprises et commerces", desc: "Bâtiments tertiaires" },
  { icon: User, label: "Particuliers", desc: "Maisons individuelles, copropriétaires" },
];

const EntreprisePage = () => (
  <>
    <SEO
      title={PAGE_SEO.entreprise.title}
      description={PAGE_SEO.entreprise.description}
      path="/entreprise"
      breadcrumbs={PAGE_SEO.entreprise.breadcrumbs}
    />
    <PageHero title="Qui Sommes-Nous et Pourquoi Nous Choisir" subtitle="EQUATION — 25 ans d'expertise en étanchéité et isolation en Auvergne" />
    <Breadcrumbs items={[{ label: "L'Entreprise" }]} />

    {/* Présentation */}
    <section className="container-main section-padding">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <ScrollReveal>
          <img src={thierryImg} alt="Thierry Meylan, gérant fondateur d'EQUATION Étanchéité, expert toitures terrasses Auvergne" className="rounded-xl w-full h-96 object-contain bg-warm" loading="lazy" decoding="async" />
          <ThierryCarousel />
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <div>
            <h2 className="text-foreground mb-4">EQUATION en bref</h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              <strong className="text-foreground">EQUATION</strong> est une entreprise fondée en 2001 par <strong className="text-foreground">Thierry Meylan</strong>, basée à Cournon-d'Auvergne (63), près de Clermont-Ferrand. SARL au capital de 50 000 €, nous sommes spécialisés dans l'étanchéité des toitures terrasses, l'isolation thermique et les revêtements spécifiques.
            </p>
            <p className="text-muted-foreground font-body leading-relaxed mt-4">
              Nous intervenons dans le Puy-de-Dôme (63), l'Allier (03), la Haute-Loire (43), le Cantal (15), la Nièvre (58) et au-delà sur demande pour les chantiers d'envergure.
            </p>
            <p className="text-muted-foreground font-body leading-relaxed mt-4">
              Thierry MEYLAN est membre de la Fédération Française du Bâtiment et de la Chambre Syndicale Française de l'Étanchéité depuis plus de vingt ans. Afin de connaître les techniques utilisées dans d'autres pays, il est également membre de la National Roofing Contractors Association.
            </p>
            <TooltipProvider delayDuration={150}>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 mt-8">
                {partners.map((p) => (
                  <Tooltip key={p.short}>
                    <TooltipTrigger asChild>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={p.name}
                        className="flex items-center justify-center bg-white border border-border/60 rounded-lg p-2 sm:p-3 h-16 sm:h-20 transition-shadow hover:shadow-md"
                      >
                        <img
                          src={p.src}
                          alt={p.alt}
                          className="h-10 sm:h-[60px] w-auto max-w-full object-contain"
                          loading="lazy"
                          decoding="async"
                          width={512}
                          height={512}
                        />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{p.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
            <img src={signatureImg} alt="Équation - L'efficacité en Action" className="h-14 w-auto mt-6 opacity-80" loading="lazy" decoding="async" width={312} height={159} />
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Pourquoi nous choisir */}
    <section className="bg-warm section-padding">
      <div className="container-main">
        <ScrollReveal>
          <h2 className="text-foreground text-center mb-12">Pourquoi Nous Choisir</h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 100}>
              <div className="card-equation p-6 h-full">
                <r.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-heading text-foreground">{r.title}</h3>
                <p className="text-muted-foreground font-body text-sm mt-2">{r.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Notre histoire — supprimée */}

    {/* Nos Valeurs */}
    <section className="bg-warm section-padding">
      <div className="container-main">
        <ScrollReveal>
          <h2 className="text-foreground text-center mb-12">Nos Valeurs</h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Award, title: "Excellence Technique", desc: "Chaque chantier est une signature. Nous appliquons les règles de l'art avec rigueur et exigence." },
            { icon: Leaf, title: "Engagement Environnemental", desc: "Toitures végétalisées, isolation performante, matériaux durables : nous construisons pour demain." },
            { icon: User, title: "Proximité Client", desc: "Du diagnostic au suivi post-travaux, un interlocuteur unique vous accompagne à chaque étape." },
          ].map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 100}>
              <div className="text-center">
                <v.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-foreground font-heading">{v.title}</h3>
                <p className="text-muted-foreground font-body text-sm mt-3">{v.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Clients */}
    <section className="bg-noir section-padding">
      <div className="container-main">
        <ScrollReveal>
          <h2 className="text-primary-foreground text-center mb-12">Nos Clients</h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((c, i) => (
            <ScrollReveal key={c.label} delay={i * 80}>
              <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-6">
                <c.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-primary-foreground font-heading text-lg">{c.label}</h3>
                <p className="text-primary-foreground/85 font-body text-sm mt-1">{c.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default EntreprisePage;
