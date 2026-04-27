import { Shield, Sun, Zap, Gem, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import PhotoGallery, { GalleryImage } from "@/components/PhotoGallery";

// Photos IA chantier réutilisées par solution (les + pertinentes thématiquement)
import foam1 from "@/assets/realisations/glaciere-2.jpg";
import foam2 from "@/assets/realisations/glaciere-3.jpg";
import foam3 from "@/assets/realisations/glaciere-4.jpg";
import foam4 from "@/assets/realisations/glaciere-1.jpg";
import cool1 from "@/assets/realisations/cpam-5.jpg";
import cool2 from "@/assets/realisations/cpam-1.jpg";
import cool3 from "@/assets/realisations/vic-3.jpg";
import pv1 from "@/assets/realisations/cendre-1.jpg";
import pv2 from "@/assets/realisations/cpam-3.jpg";
import pv3 from "@/assets/realisations/nievre-3.jpg";
import quartz1 from "@/assets/realisations/arverne-2.jpg";
import quartz2 from "@/assets/realisations/arverne-3.jpg";
import quartz3 from "@/assets/realisations/arverne-1.jpg";

type Solution = {
  id: string;
  icon: typeof Shield;
  title: string;
  images: GalleryImage[];
  text: string;
  points: string[];
  ref?: string;
};

const U = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const solutions: Solution[] = [
  {
    id: "foamglas", icon: Shield,
    title: "Isolation Thermique FOAMGLAS — Garantie 30 Ans",
    images: [
      { src: foam1, alt: "Pose FOAMGLAS", caption: "Pose des plaques de verre cellulaire FOAMGLAS — étanche à l'eau ET à la vapeur" },
      { src: foam2, alt: "Bitume chaud", caption: "Collage au bitume à chaud (220°C) — adhérence parfaite et durabilité 30 ans garantie fabricant" },
      { src: foam3, alt: "Étanchéité finale", caption: "Étanchéité bicouche de finition sur FOAMGLAS — complexe incombustible classement A1" },
      { src: foam4, alt: "Référence Glacière", caption: "Référence : Groupe La Glacière pour Auvergne Habitat — 1 200 m² réalisés" },
    ],
    text: "Le verre cellulaire FOAMGLAS est le matériau d'isolation le plus performant et le plus durable du marché pour les toitures terrasses. Étanche à l'eau et à la vapeur, incompressible, incombustible et résistant aux insectes et rongeurs, le FOAMGLAS offre une durée de vie exceptionnelle avec une garantie fabricant de 30 ans. EQUATION est qualifiée pour la mise en œuvre de ce procédé haut de gamme, collé au bitume à chaud sur les toitures terrasses.",
    points: [
      "Garantie fabricant 30 ans",
      "Étanche à l'eau ET à la vapeur (pas besoin de pare-vapeur séparé)",
      "Incompressible — supporte les charges lourdes sans tassement",
      "Incombustible classement A1 — sécurité incendie maximale",
      "Insensible aux rongeurs, insectes et moisissures",
    ],
    ref: "Référence chantier : Groupe La Glacière pour Auvergne Habitat — 1 200 m² de toitures terrasses avec verre cellulaire collé au bitume à chaud.",
  },
  {
    id: "cool-roof", icon: Sun,
    title: "Toitures Froides / Cool Roof",
    images: [
      { src: cool1, alt: "Toiture Cool Roof", caption: "Revêtement réflectif sur étanchéité — albédo > 0,85 (réflexion solaire 85%)" },
      { src: cool2, alt: "Bâtiment équipé", caption: "Application au rouleau ou pulvérisation sur étanchéité existante — pas de dépose" },
      { src: cool3, alt: "Économies climatisation", caption: "Réduction température toiture de 30 à 40°C en été — économies clim 20 à 40%" },
    ],
    text: "Le Cool Roof est une solution de toiture réfléchissante qui réduit la température intérieure des bâtiments en réfléchissant les rayons solaires au lieu de les absorber. En appliquant un revêtement blanc hautement réflectif sur la membrane d'étanchéité existante, la température en toiture peut baisser de 30 à 40°C en période estivale. Résultat : un confort thermique amélioré sans climatisation et une réduction significative de la facture énergétique.",
    points: [
      "Réduction température toiture de 30 à 40°C en été",
      "Baisse de la consommation de climatisation de 20 à 40%",
      "Application sur étanchéité existante (pas de dépose)",
      "Prolonge la durée de vie de la membrane d'étanchéité",
      "Contribue à la lutte contre les îlots de chaleur urbains",
    ],
  },
  {
    id: "photovoltaique", icon: Zap,
    title: "Toitures avec Panneaux Photovoltaïques",
    images: [
      { src: pv1, alt: "Bâtiment photovoltaïque", caption: "Intégration photovoltaïque sur toiture terrasse — système lesté sans perforation" },
      { src: pv2, alt: "Étanchéité renforcée", caption: "Complexe d'étanchéité renforcé sous panneaux — résistance au poinçonnement" },
      { src: pv3, alt: "Coordination chantier", caption: "Coordination avec installateurs solaires — reprise étanchéité autour des pénétrations" },
    ],
    text: "EQUATION réalise l'intégration de panneaux photovoltaïques sur les toitures terrasses en coordination avec les installateurs solaires. Notre rôle : garantir que l'étanchéité de la toiture reste parfaite malgré les fixations et le poids des modules. Nous concevons des complexes d'étanchéité renforcés compatibles avec les systèmes de fixation photovoltaïques (lestés, fixés mécaniquement ou collés) et assurons la reprise d'étanchéité autour de chaque pénétration.",
    points: [
      "Complexe d'étanchéité renforcé sous panneaux",
      "Compatible systèmes lestés et fixés mécaniquement",
      "Reprise étanchéité autour des pénétrations garantie",
      "Coordination avec les installateurs photovoltaïques",
      "Éligible aux aides à la rénovation énergétique",
    ],
  },
  {
    id: "quartz", icon: Gem,
    title: "Terrasses et Balcons avec Revêtement Quartz",
    images: [
      { src: quartz1, alt: "Application revêtement", caption: "Application multicouche résine + granulats de quartz — finition décorative + étanchéité" },
      { src: quartz2, alt: "Surface antidérapante", caption: "Surface antidérapante classée R11 — sécurité piétons et zones humides" },
      { src: quartz3, alt: "Balcon livré", caption: "Balcon livré — entretien minimal, durabilité 20 ans+" },
    ],
    text: "Le revêtement quartz combine étanchéité et finition décorative pour les terrasses accessibles, balcons et coursives. Ce système multicouche alliant résine et granulats de quartz colorés offre une surface antidérapante, résistante au trafic piétonnier et aux intempéries.",
    points: [
      "Finition décorative colorée",
      "Surface antidérapante classée",
      "Résistant au trafic piétonnier",
      "Entretien minimal",
    ],
  },
];

import { useSiteSection } from "@/hooks/useSiteSection";

const SolutionBlock = ({ s, i }: { s: Solution; i: number }) => {
  const content = useSiteSection(s.id, {
    title: s.title,
    text: s.text,
    points: s.points,
    ref: s.ref,
    images: s.images,
  });
  return (
    <section
      id={s.id}
      className={`section-padding scroll-mt-32 ${i % 2 === 0 ? "bg-background" : "bg-warm"}`}
    >
      <div className="container-main">
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <PhotoGallery images={content.images} />
            </div>
            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <s.icon className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-2xl md:text-3xl text-foreground">{content.title}</h2>
              <p className="text-muted-foreground mt-4 font-body leading-relaxed whitespace-pre-line">{content.intro}</p>
              <ul className="mt-6 space-y-2">
                {content.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 font-body text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-green-success shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
              {content.reference && (
                <p className="mt-4 text-xs font-body italic text-muted-foreground border-l-2 border-primary pl-3">
                  {content.reference}
                </p>
              )}
              <Link to="/contact" className="btn-bordeaux inline-block mt-6 text-sm">
                Demander un Devis pour cette Solution
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const SolutionsInnovantesPage = () => (
  <>
    <PageHero title="Nos Solutions Innovantes" subtitle="EQUATION investit dans les technologies d'avenir pour des bâtiments plus performants et plus durables" />
    <Breadcrumbs items={[{ label: "Solutions Innovantes" }]} />

    <div className="space-y-0">
      {solutions.map((s, i) => (
        <SolutionBlock key={s.id} s={s} i={i} />
      ))}
    </div>
  </>
);

export default SolutionsInnovantesPage;
