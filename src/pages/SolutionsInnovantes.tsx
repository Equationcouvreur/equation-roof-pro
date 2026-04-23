import { Shield, Sun, Zap, Gem, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import PhotoGallery, { GalleryImage } from "@/components/PhotoGallery";
import bitumenImg from "@/assets/bitumen-work.jpg";
import greenRoofImg from "@/assets/green-roof.jpg";
import teamImg from "@/assets/team-construction.jpg";
import ipeImg from "@/assets/ipe-terrace.jpg";

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
      { src: U("1581094794329-c8112a89af12"), alt: "Pose FOAMGLAS", caption: "Pose des plaques de verre cellulaire FOAMGLAS — étanche à l'eau ET à la vapeur" },
      { src: U("1518780664697-55e3ad937233"), alt: "Bitume chaud", caption: "Collage au bitume à chaud (220°C) — adhérence parfaite et durabilité 30 ans garantie fabricant" },
      { src: bitumenImg, alt: "Étanchéité finale", caption: "Étanchéité bicouche de finition sur FOAMGLAS — complexe incombustible classement A1" },
      { src: U("1486325212027-8081e485255e"), alt: "Référence Glacière", caption: "Référence : Groupe La Glacière pour Auvergne Habitat — 1 200 m² réalisés" },
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
      { src: U("1497436072909-60f360e1d4b1"), alt: "Toiture Cool Roof blanche", caption: "Revêtement blanc hautement réflectif — albédo > 0,85 (réflexion solaire 85%)" },
      { src: U("1605276374104-dee2a0ed3cd6"), alt: "Application Cool Roof", caption: "Application au rouleau ou pulvérisation sur étanchéité existante — pas de dépose" },
      { src: greenRoofImg, alt: "Économies climatisation", caption: "Réduction température toiture de 30 à 40°C en été — économies clim 20 à 40%" },
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
      { src: U("1509391366360-2e959784a276"), alt: "Panneaux photovoltaïques", caption: "Intégration photovoltaïque sur toiture terrasse — système lesté sans perforation" },
      { src: U("1466611653911-95081537e5b7"), alt: "Étanchéité renforcée", caption: "Complexe d'étanchéité renforcé sous panneaux — résistance au poinçonnement" },
      { src: teamImg, alt: "Coordination installateurs", caption: "Coordination avec installateurs solaires — reprise étanchéité autour des pénétrations" },
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
      { src: U("1545324418-cc1a3fa10c00"), alt: "Revêtement quartz", caption: "Revêtement quartz coloré — finition décorative + étanchéité en un seul système" },
      { src: U("1493809842364-78817add7ffb"), alt: "Surface antidérapante", caption: "Surface antidérapante classée R11 — sécurité piétons et zones humides" },
      { src: ipeImg, alt: "Balcon fini", caption: "Balcon livré — entretien minimal, durabilité 20 ans+" },
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

const SolutionsInnovantesPage = () => (
  <>
    <PageHero title="Nos Solutions Innovantes" subtitle="EQUATION investit dans les technologies d'avenir pour des bâtiments plus performants et plus durables" />
    <Breadcrumbs items={[{ label: "Solutions Innovantes" }]} />

    <div className="space-y-0">
      {solutions.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className={`section-padding scroll-mt-32 ${i % 2 === 0 ? "bg-background" : "bg-warm"}`}
        >
          <div className="container-main">
            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <PhotoGallery images={s.images} />
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <s.icon className="w-10 h-10 text-primary mb-4" />
                  <h2 className="text-2xl md:text-3xl text-foreground">{s.title}</h2>
                  <p className="text-muted-foreground mt-4 font-body leading-relaxed">{s.text}</p>
                  <ul className="mt-6 space-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 font-body text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-green-success shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  {s.ref && (
                    <p className="mt-4 text-xs font-body italic text-muted-foreground border-l-2 border-primary pl-3">
                      {s.ref}
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
      ))}
    </div>
  </>
);

export default SolutionsInnovantesPage;
