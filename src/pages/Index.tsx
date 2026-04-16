import { Link } from "react-router-dom";
import { Flame, Droplets, Gem, Search, Grid3X3, Leaf, Award, Shield, PenTool, Clock, Building2, Landmark, Users, Briefcase, Home, User, CheckCircle, Phone, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import bannerImg from "@/assets/banner-equation-01.png";
import teamImg from "@/assets/team-construction.jpg";
import greenRoofImg from "@/assets/green-roof.jpg";
import bitumenImg from "@/assets/bitumen-work.jpg";
import ipeImg from "@/assets/ipe-terrace.jpg";

import certificationsImg from "@/assets/certifications.png";
import { useEffect, useRef, useState } from "react";

const Counter = ({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1500;
        const steps = 40;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, duration / steps);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-heading font-bold text-primary">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-primary-foreground/70 mt-2 font-body text-sm">{label}</p>
    </div>
  );
};

const expertises = [
  { icon: Flame, title: "Étanchéité Bitumineuse", desc: "Membranes bitumineuses soudées au chalumeau, système mono ou bicouche, conforme DTU 43.1", hash: "#bitumineuse" },
  { icon: Droplets, title: "Étanchéité Résine", desc: "Résine polyuréthane sans joint ni soudure, pour toitures complexes et surfaces irrégulières", hash: "#resine" },
  { icon: Gem, title: "Revêtement Quartz", desc: "Finition esthétique et résistante pour terrasses accessibles et balcons", hash: "#quartz" },
  { icon: Search, title: "Recherche de Fuite", desc: "Détection non destructive des infiltrations par technologies avancées", hash: "#fuite" },
  { icon: Grid3X3, title: "Dalles sur Plots", desc: "Aménagement de terrasses accessibles avec dalles sur plots réglables", hash: "#dalles" },
  { icon: Leaf, title: "Toiture Végétalisée", desc: "Végétalisation extensive et semi-intensive, biodiversité urbaine", hash: "#vegetalisee" },
];

const projects = [
  { img: bitumenImg, title: "CPAM de Nevers", desc: "Rénovation complète étanchéité et isolation thermique de 6 toitures terrasses avec grue GMA" },
  { img: teamImg, title: "Nièvre Habitat", desc: "Rénovation de 3 immeubles, isolation polyuréthane 100mm et étanchéité bitumineuse" },
  { img: greenRoofImg, title: "Assemblia Clermont-Ferrand", desc: "Transformation en terrasse végétalisée extensive" },
  { img: ipeImg, title: "Groupe La Glacière", desc: "1 200 m² de toitures terrasses avec verre cellulaire collé au bitume à chaud" },
];

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
  return (
    <>
      {/* Hero */}
      <section className="relative bg-noir flex flex-col">
        <div className="flex-1 flex items-center pt-32 pb-10 md:pb-16">
          <div className="container-main">
            <ScrollReveal>
              <h1 className="text-primary-foreground max-w-3xl">
                [ L'Excellence en Étanchéité depuis 2001 ]
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <p className="text-primary-foreground/80 text-lg md:text-xl mt-6 max-w-2xl font-body">
                Expert Qualibat RGE en toitures terrasses — Clermont-Ferrand et Auvergne
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/expertises" className="btn-bordeaux">Découvrir nos Expertises</Link>
                <Link to="/realisations" className="border-2 border-primary-foreground/50 text-primary-foreground font-subtitle font-semibold px-6 py-3 rounded-lg hover:bg-primary-foreground/10 transition-all">
                  Nos Réalisations
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
        <div className="w-full">
          <img src={bannerImg} alt="EQUATION Étanchéité toitures terrasses Clermont-Ferrand — soudure bitume, toiture végétalisée, dalles IPE" className="w-full h-auto" />
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="bg-noir section-padding">
        <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-8">
          <Counter target={25} suffix="+" label="Années d'expérience" />
          <Counter target={2000} suffix="+" label="Chantiers réalisés" />
          <Counter target={50000} suffix="+" label="m² traités par an" />
          <Counter target={100} suffix="%" label="Garantie décennale" />
        </div>
      </section>

      {/* Expertises */}
      <section className="bg-warm section-padding">
        <div className="container-main">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-foreground">[ Une Expertise Complète en Étanchéité ]</h2>
              <p className="text-muted-foreground mt-4 font-body">
                Des solutions techniques adaptées à chaque type de toiture et de support
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expertises.map((e, i) => (
              <ScrollReveal key={e.title} delay={i * 100}>
                <Link to={`/expertises${e.hash}`} className="card-equation block p-8 h-full">
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
            <h2 className="text-foreground text-center mb-12">[ Nos Dernières Réalisations ]</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 100}>
                <div className="card-equation overflow-hidden">
                  <img src={p.img} alt={`${p.title} étanchéité Auvergne`} className="w-full h-56 object-cover" loading="lazy" width={600} height={400} />
                  <div className="p-6">
                    <h3 className="text-lg font-heading text-foreground">{p.title}</h3>
                    <p className="text-muted-foreground mt-2 text-sm font-body">{p.desc}</p>
                  </div>
                </div>
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
            <h2 className="text-primary-foreground text-center mb-12">[ Pourquoi Nous Faire Confiance ? ]</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <img src={teamImg} alt="Équipe EQUATION étanchéité professionnelle" className="rounded-xl w-full h-80 object-cover" loading="lazy" width={600} height={400} />
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
            <img src={certificationsImg} alt="Certifications CSFE, Qualibat, Reconnu Grenelle Environnement" className="mx-auto max-w-lg w-full h-auto" loading="lazy" />
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
