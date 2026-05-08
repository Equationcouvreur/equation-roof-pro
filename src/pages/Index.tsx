import { Link } from "react-router-dom";
import { Flame, Droplets, Gem, Search, Grid3X3, Leaf, Award, Shield, PenTool, Clock, Building2, Landmark, Users, Briefcase, User, Phone, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SEO from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo-config";
import { getOrganizationJsonLd } from "@/lib/jsonld";
import { supabase } from "@/integrations/supabase/client";
import bannerImg from "@/assets/banner-equation-01.png";

const teamImg = "/realisations/cpam-1.jpg";

import certificationsImg from "@/assets/certifications.png";
import HomeCarousel from "@/components/HomeCarousel";
import { useEffect, useRef, useState } from "react";

// Counter: initialise à la valeur finale pour que le SSR rende la vraie
// valeur dans le HTML (SEO + no-JS). useEffect ne s'exécute pas en SSR,
// donc côté client on remet à 0 puis on anime jusqu'à la cible.
const Counter = ({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) => {
  const [count, setCount] = useState(target);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setCount(0);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const startTime = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 2);
          setCount(Math.floor(target * eased));
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(target);
          }
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-heading font-bold text-primary">
        {count.toLocaleString("fr-FR")}{suffix}
      </div>
      <p className="text-primary-foreground/70 mt-2 font-body text-sm">{label}</p>
    </div>
  );
};

const expertises = [
  { icon: Flame, title: "Étanchéité Bitumineuse", desc: "Membranes bitumineuses soudées au chalumeau, système mono ou bicouche, conforme DTU 43.1", hash: "/coeur-de-metier#bitumineuse" },
  { icon: Droplets, title: "Étanchéité Résine", desc: "Résine polyuréthane sans joint ni soudure, pour toitures complexes et surfaces irrégulières", hash: "/coeur-de-metier#resine" },
  { icon: Gem, title: "Revêtement Quartz", desc: "Finition esthétique et résistante pour terrasses accessibles et balcons", hash: "/solutions-innovantes#quartz" },
  { icon: Search, title: "Recherche de Fuite", desc: "Détection non destructive des infiltrations par technologies avancées", hash: "/coeur-de-metier#fuite" },
  { icon: Grid3X3, title: "Dalles sur Plots", desc: "Aménagement de terrasses accessibles avec dalles sur plots réglables", hash: "/coeur-de-metier#dalles" },
  { icon: Leaf, title: "Toiture Végétalisée", desc: "Végétalisation extensive et semi-intensive, biodiversité urbaine", hash: "/coeur-de-metier#vegetalisee" },
];

type HomeProject = { id: string; images: string[]; title: string; desc: string };

const ProjectCard = ({ images, title, desc }: { images: string[]; title: string; desc: string }) => {
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!hover || images.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 1200);
    return () => clearInterval(t);
  }, [hover, images.length]);

  useEffect(() => {
    if (!hover) setIdx(0);
  }, [hover]);

  return (
    <div
      className="card-equation overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative w-full h-56 overflow-hidden">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${title} étanchéité Auvergne ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            width={600}
            height={400}
          />
        ))}
        <div className="absolute bottom-2 right-2 bg-noir/70 text-primary-foreground text-xs font-body px-2 py-1 rounded-full backdrop-blur-sm">
          📷 {images.length} photos
        </div>
        <div className="absolute bottom-2 left-2 flex gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-4 bg-primary" : "w-1.5 bg-primary-foreground/50"}`}
            />
          ))}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-heading text-foreground">{title}</h3>
        <p className="text-muted-foreground mt-2 text-sm font-body">{desc}</p>
      </div>
    </div>
  );
};

const reasons = [
  { icon: Award, title: "Certifié Qualibat RGE", desc: "Gage de compétence reconnue et éligibilité aux aides à la rénovation énergétique" },
  { icon: Shield, title: "Garantie Décennale", desc: "Tous nos ouvrages sont couverts par notre assurance décennale pour votre tranquillité" },
  { icon: PenTool, title: "Bureau d'Études Intégré", desc: "Études techniques et croquis DAO en interne pour des solutions sur mesure" },
  { icon: Clock, title: "25 Ans d'Expérience", desc: "Depuis 2001, nous intervenons sur tous types de bâtiments en Auvergne et au-delà" },
];

const clients = [
  { icon: Building2, label: "Bailleurs sociaux" },
  { icon: Landmark, label: "Collectivités publiques" },
  { icon: Users, label: "Copropriétés et syndics" },
  { icon: PenTool, label: "Architectes et BET" },
  { icon: Briefcase, label: "Entreprises" },
  { icon: User, label: "Particuliers" },
];

const HomePage = () => {
  const [projects, setProjects] = useState<HomeProject[]>([]);

  useEffect(() => {
    (async () => {
      const { data: reals } = await supabase
        .from("realisations")
        .select("id,title,description")
        .eq("status", "published")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(4);
      if (!reals || reals.length === 0) {
        setProjects([]);
        return;
      }

      const ids = reals.map((r) => r.id);
      const { data: photos } = await supabase
        .from("realisation_photos")
        .select("realisation_id,url,display_order,is_favorite")
        .in("realisation_id", ids)
        .order("is_favorite", { ascending: false })
        .order("display_order", { ascending: true });

      const mapped: HomeProject[] = reals.map((r) => {
        const imgs = (photos || [])
          .filter((p) => p.realisation_id === r.id)
          .slice(0, 3)
          .map((p) => p.url);
        return {
          id: r.id,
          title: r.title,
          desc: r.description || "",
          images: imgs.length ? imgs : ["/placeholder.svg"],
        };
      });
      setProjects(mapped);
    })();
  }, []);

  return (
    <>
      <SEO
        title={PAGE_SEO.home.title}
        description={PAGE_SEO.home.description}
        path="/"
        breadcrumbs={PAGE_SEO.home.breadcrumbs}
        jsonLd={getOrganizationJsonLd()}
      />
      {/* Hero */}
      <section className="relative bg-noir flex flex-col">
        <div className="flex-1 flex items-center pt-32 pb-10 md:pb-16">
          <div className="container-main">
            <ScrollReveal>
              <h1 className="text-primary-foreground max-w-3xl">
                L'Excellence en Étanchéité depuis 2001
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <p className="text-primary-foreground/80 text-lg md:text-xl mt-6 max-w-2xl font-body">
                Expert Qualibat RGE en toitures terrasses — Clermont-Ferrand et Auvergne
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/coeur-de-metier" className="btn-bordeaux">Découvrir nos Expertises</Link>
                <Link to="/realisations" className="border-2 border-primary-foreground/50 text-primary-foreground font-subtitle font-semibold px-6 py-3 rounded-lg hover:bg-primary-foreground/10 transition-all">
                  Nos Réalisations
                </Link>
                <Link to="/espace-client" className="inline-flex items-center gap-2 text-primary-foreground/90 hover:text-primary font-subtitle font-semibold px-4 py-3 transition-colors">
                  <User className="w-4 h-4" /> Espace client
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
        <div className="w-full max-w-[100vw] mx-auto overflow-hidden">
          <img src={bannerImg} alt="EQUATION Étanchéité toitures terrasses Clermont-Ferrand — soudure bitume, toiture végétalisée, dalles IPE" className="block w-full h-auto" width={1920} height={181} loading="eager" {...({ fetchpriority: "high" } as Record<string, string>)} decoding="async" />
        </div>
      </section>

      {/* Bandeau note Google */}
      <section className="bg-warm border-b border-border">
        <div className="container-main py-4 flex justify-center">
          <a
            href="#"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-3 bg-card border border-border rounded-full px-5 py-2.5 shadow-sm hover:shadow-md transition-all group"
          >
            <span className="text-primary text-lg leading-none">★</span>
            <span className="font-subtitle font-semibold text-foreground text-sm">
              4,9/5
            </span>
            <span className="text-muted-foreground text-sm font-body">
              — 12 avis Google
            </span>
            <span className="text-primary text-xs font-subtitle font-semibold group-hover:underline">
              Voir →
            </span>
          </a>
        </div>
      </section>
      <section className="bg-noir section-padding">
        <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-8">
          <Counter target={25} suffix="+" label="Années d'expérience" />
          <Counter target={3000} suffix="+" label="Chantiers réalisés" />
          <Counter target={20000} suffix="+" label="m² traités par an" />
          <Counter target={100} suffix="%" label="Garantie décennale" />
        </div>
      </section>

      {/* Expertises */}
      <section className="bg-warm section-padding">
        <div className="container-main">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-foreground">Une Expertise Complète en Étanchéité</h2>
              <p className="text-muted-foreground mt-4 font-body">
                Des solutions techniques adaptées à chaque type de toiture et de support
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expertises.map((e, i) => (
              <ScrollReveal key={e.title} delay={i * 100}>
                <Link to={e.hash} className="card-equation block p-8 h-full">
                  <e.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-heading text-foreground">{e.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm font-body">{e.desc}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Réalisations */}
      <section className="section-padding">
        <div className="container-main">
          <ScrollReveal>
            <h2 className="text-foreground text-center mb-12">Nos Dernières Réalisations</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 100}>
                <ProjectCard images={p.images} title={p.title} desc={p.desc} />
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/realisations" className="inline-flex items-center gap-2 text-primary font-subtitle font-semibold hover:gap-3 transition-all">
              Voir toutes nos réalisations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pourquoi EQUATION */}
      <section className="bg-noir section-padding">
        <div className="container-main">
          <ScrollReveal>
            <h2 className="text-primary-foreground text-center mb-12">Pourquoi Nous Faire Confiance ?</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="rounded-xl overflow-hidden">
                <HomeCarousel />
              </div>
            </ScrollReveal>
            <div className="space-y-6">
              {reasons.map((r, i) => (
                <ScrollReveal key={r.title} delay={i * 100}>
                  <div className="flex gap-4">
                    <r.icon className="w-8 h-8 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-heading text-primary-foreground">{r.title}</h3>
                      <p className="text-primary-foreground/70 text-sm font-body mt-1">{r.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Types de clients */}
      <section className="bg-warm section-padding">
        <div className="container-main">
          <ScrollReveal>
            <h2 className="text-foreground text-center mb-10">Nous Intervenons pour Tous Types de Maîtres d'Ouvrage</h2>
          </ScrollReveal>
          <div className="flex flex-wrap justify-center gap-4">
            {clients.map((c, i) => (
              <ScrollReveal key={c.label} delay={i * 80}>
                <div className="flex items-center gap-2 bg-card px-5 py-3 rounded-full shadow-sm font-subtitle text-sm font-medium text-foreground">
                  <c.icon className="w-4 h-4 text-primary" />
                  {c.label}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-padding bg-background">
        <div className="container-main text-center">
          <ScrollReveal>
            <h2 className="text-foreground mb-6">Certifications et Labels</h2>
            <p className="text-muted-foreground text-sm font-body mb-8">Gages de compétence et de fiabilité</p>
            <img src={certificationsImg} alt="Certifications CSFE, Qualibat, Reconnu Grenelle Environnement" className="mx-auto max-w-lg w-full h-auto" loading="lazy" decoding="async" width={973} height={178} />
            <p className="text-muted-foreground text-sm mt-6 font-body">Membre actif de la FFB Puy-de-Dôme depuis 8 ans</p>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary section-padding">
        <div className="container-main text-center">
          <ScrollReveal>
            <h2 className="text-primary-foreground">Un Projet d'Étanchéité ? Parlons-en.</h2>
            <p className="text-primary-foreground/80 mt-4 font-body text-lg">
              Devis gratuit sous 48h — Intervention dans tout le Puy-de-Dôme et départements limitrophes
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link to="/contact" className="btn-noir">Contactez-nous</Link>
              <a href="tel:0473875350" className="flex items-center gap-2 text-primary-foreground font-subtitle font-semibold text-lg">
                <Phone className="w-5 h-5" /> 04 73 87 53 50
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default HomePage;
