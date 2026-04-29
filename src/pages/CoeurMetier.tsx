import { Flame, Droplets, Thermometer, Search, Grid3X3, Leaf, ShieldAlert, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import PhotoGallery, { GalleryImage } from "@/components/PhotoGallery";
import YouTubePlayer from "@/components/YouTubePlayer";

// Photos IA dédiées par expertise
import isolation1 from "@/assets/expertises/isolation-1.jpg";
import isolation2 from "@/assets/expertises/isolation-2.jpg";
import isolation3 from "@/assets/expertises/isolation-3.jpg";
import bitumineuse1 from "@/assets/expertises/bitumineuse-1.jpg";
// Réutilisation de photos chantier IA réalistes pour les autres expertises
import bitumineuseB from "@/assets/realisations/cpam-3.jpg";
import bitumineuseC from "@/assets/realisations/cpam-5.jpg";
import resineA from "@/assets/realisations/arverne-2.jpg";
import resineB from "@/assets/realisations/arverne-3.jpg";
import resineC from "@/assets/realisations/arverne-1.jpg";
import dallesA from "@/assets/realisations/ipe-1.jpg";
import dallesB from "@/assets/realisations/ipe-2.jpg";
import dallesC from "@/assets/realisations/ipe-3.jpg";
import vegA from "@/assets/realisations/assemblia-1.jpg";
import vegB from "@/assets/realisations/assemblia-2.jpg";
import vegC from "@/assets/realisations/murol-2.jpg";
import fuiteA from "@/assets/realisations/universite-2.jpg";
import fuiteB from "@/assets/realisations/glaciere-1.jpg";
import fuiteC from "@/assets/realisations/cpam-4.jpg";
import securite1 from "@/assets/expertises/securite-1.jpg";
import securite2 from "@/assets/expertises/securite-2.jpg";
import securite3 from "@/assets/expertises/securite-3.jpg";

type Expertise = {
  id: string;
  icon: typeof Flame;
  title: string;
  images: GalleryImage[];
  text: string;
  points: string[];
};

const expertises: Expertise[] = [
  {
    id: "isolation", icon: Thermometer,
    title: "Isolation Thermique — Le Poste N°1 d'Économie d'Énergie",
    images: [
      { src: isolation1, alt: "Pose isolant polyuréthane", caption: "Pose d'isolant polyuréthane 100mm — coefficient λ = 0,022 W/m.K, conforme RE 2020" },
      { src: isolation2, alt: "Pose laine de roche", caption: "Mise en œuvre laine de roche 140mm — performance acoustique + thermique pour ERP" },
      { src: isolation3, alt: "Complexe isolant", caption: "Couplage pare-vapeur + isolation + étanchéité bicouche — solution intégrée éligible MaPrimeRénov" },
    ],
    text: "L'isolation thermique par la toiture est le poste n°1 d'économie d'énergie. Jusqu'à 30% des déperditions de chaleur passent par le toit. EQUATION réalise des complexes d'isolation thermique performants en toiture terrasse : mousse polyuréthane projetée, verre cellulaire FOAMGLAS, laine de roche, polystyrène extrudé (XPS). Nos solutions respectent les exigences de la RE 2020 et sont éligibles aux aides MaPrimeRénov.",
    points: ["Conforme RE 2020", "Éligible MaPrimeRénov", "Performances thermiques certifiées", "Couplage isolation + étanchéité"],
  },
  {
    id: "bitumineuse", icon: Flame,
    title: "Étanchéité Bitumineuse — La Solution Éprouvée",
    images: [
      { src: bitumineuse1, alt: "Soudure bicouche", caption: "Soudure au chalumeau de la 1ère couche bitumineuse — élastomère SBS conforme DTU 43.1" },
      { src: bitumineuseB, alt: "Finition autoprotégée", caption: "Finition autoprotégée par paillettes d'ardoise — résistance UV + esthétique" },
      { src: bitumineuseC, alt: "Toiture terminée", caption: "Toiture livrée — garantie décennale + assurance dommages-ouvrage" },
    ],
    text: "La membrane bitumineuse est le système d'étanchéité le plus répandu sur les toitures terrasses. Chez EQUATION, nous maîtrisons la mise en œuvre des systèmes monocouche et bicouche soudés au chalumeau, conformément au DTU 43.1. Nos équipes interviennent sur tous types de supports — béton, acier, bois — et réalisent des complexes complets incluant pare-vapeur, isolation thermique et revêtement d'étanchéité autoprotégé ou sous protection lourde.",
    points: ["Conforme NF DTU 43.1", "Compatible isolation polyuréthane et verre cellulaire", "Protection autoprotégée ou sous gravillons", "Garantie décennale"],
  },
  {
    id: "resine", icon: Droplets,
    title: "Étanchéité Résine — Sans Joint, Sans Limite",
    images: [
      { src: resineA, alt: "Application résine PMMA", caption: "Application de résine PMMA à froid — sans flamme, idéale en site occupé" },
      { src: resineB, alt: "Carrelage sur résine", caption: "Membrane continue sans joint sur balcons et coursives — résistance UV et trafic" },
      { src: resineC, alt: "Préparation support", caption: "Préparation du support et primaire d'accrochage — adhérence parfaite garantie" },
    ],
    text: "Les systèmes d'étanchéité liquide (SEL) permettent de traiter les surfaces complexes, les angles, les relevés et les points singuliers avec une membrane continue sans joint ni soudure. Idéale en rénovation sur supports irréguliers, la résine polyuréthane ou PMMA forme un film étanche parfaitement adhérent au support.",
    points: ["Membrane continue sans raccord", "Idéale pour rénovation et géométries complexes", "Application à froid, sans flamme", "Résistance aux UV et au trafic léger"],
  },
  {
    id: "dalles", icon: Grid3X3,
    title: "Terrasses Dalles sur Plots — Aménagez Votre Toiture",
    images: [
      { src: dallesA, alt: "Terrasse IPE finie", caption: "Lames d'IPE 21mm sur plots réglables PVC — bois exotique classe 4 imputrescible" },
      { src: dallesB, alt: "Plots PVC", caption: "Plots PVC réglables 40-100mm — drainage naturel et protection de l'étanchéité" },
      { src: dallesC, alt: "Clips invisibles", caption: "Clips invisibles inox A4 — aucune vis apparente, esthétique premium" },
    ],
    text: "Transformez votre toiture terrasse inaccessible en un véritable espace de vie. Le système de dalles sur plots réglables permet de créer une terrasse accessible et esthétique tout en protégeant le complexe d'étanchéité. EQUATION assure la pose sur plots de dalles béton, grès cérame, pierre naturelle, ainsi que de dalles et lames en bois IPE pour une finition haut de gamme.",
    points: ["Mise à niveau par plots réglables", "Protection de l'étanchéité", "Drainage naturel intégré", "Bois IPE, béton, grès cérame, pierre naturelle"],
  },
  {
    id: "vegetalisee", icon: Leaf,
    title: "Toitures Végétalisées — Performance Écologique",
    images: [
      { src: vegA, alt: "Toiture végétalisée", caption: "Végétalisation extensive sedum — couverture végétale immédiate à 95%" },
      { src: vegB, alt: "Complexe drainant", caption: "Mise en œuvre du complexe drainant sur membrane anti-racine certifiée FLL" },
      { src: vegC, alt: "Sedum en fleurs", caption: "Rétention d'eau pluviale > 50% — gestion EP et biodiversité urbaine" },
    ],
    text: "La végétalisation des toitures terrasses est une solution écologique et performante qui combine isolation thermique et acoustique, gestion des eaux pluviales, amélioration de la biodiversité urbaine et valorisation esthétique du bâtiment. EQUATION réalise des toitures végétalisées extensives et semi-intensives avec complexe anti-racine certifié.",
    points: ["Complexe bicouche anti-racine certifié", "Végétalisation extensive (sedum, graminées)", "Rétention des eaux pluviales", "Amélioration du confort thermique été/hiver"],
  },
  {
    id: "fuite", icon: Search,
    title: "Recherche de Fuite — Diagnostic Précis et Non Destructif",
    images: [
      { src: fuiteA, alt: "Diagnostic toiture", caption: "Diagnostic visuel et technique sur étanchéité — localisation précise sans destruction" },
      { src: fuiteB, alt: "Inspection toiture", caption: "Inspection complète du complexe d'étanchéité — vérification de l'intégrité de la membrane" },
      { src: fuiteC, alt: "Réparation ciblée", caption: "Réparation ciblée et rapport d'intervention détaillé avec préconisations" },
    ],
    text: "Les infiltrations en toiture terrasse peuvent être difficiles à localiser car l'eau chemine sous la membrane avant d'apparaître à l'intérieur du bâtiment. EQUATION dispose de technologies de détection avancées pour localiser précisément l'origine des fuites sans destruction du complexe d'étanchéité.",
    points: ["Détection non destructive", "Rapport d'intervention détaillé", "Intervention rapide", "Préconisations de réparation adaptées"],
  },
];

import { useSiteSection } from "@/hooks/useSiteSection";

const ExpertiseBlock = ({ e, i }: { e: Expertise; i: number }) => {
  const content = useSiteSection(e.id, {
    title: e.title,
    text: e.text,
    points: e.points,
    images: e.images,
  });
  return (
    <ScrollReveal>
      <section id={e.id} className="grid md:grid-cols-2 gap-12 items-center scroll-mt-32">
        <div className={i % 2 === 1 ? "md:order-2" : ""}>
          <PhotoGallery images={content.images} />
        </div>
        <div className={i % 2 === 1 ? "md:order-1" : ""}>
          <e.icon className="w-10 h-10 text-primary mb-4" />
          <h2 className="text-2xl md:text-3xl text-foreground">{content.title}</h2>
          <p className="text-muted-foreground mt-4 font-body leading-relaxed whitespace-pre-line">{content.intro}</p>
          {content.videoUrl && (
            <div className="mt-6">
              <YouTubePlayer url={content.videoUrl} title={content.title} />
            </div>
          )}
          <ul className="mt-6 space-y-2">
            {content.points.map((p) => (
              <li key={p} className="flex items-center gap-2 font-body text-sm text-foreground">
                <CheckCircle className="w-4 h-4 text-green-success shrink-0" />
                {p}
              </li>
            ))}
          </ul>
          <Link to="/contact" className="btn-bordeaux inline-block mt-6 text-sm">
            Demander un Devis pour ce Service
          </Link>
        </div>
      </section>
    </ScrollReveal>
  );
};

const CoeurMetierPage = () => (
  <>
    <PageHero title="Notre Cœur de Métier" subtitle="6 expertises techniques au service de vos toitures terrasses" />
    <Breadcrumbs items={[{ label: "Notre Cœur de Métier" }]} />

    {/* Grille de cartes */}
    <section className="bg-warm section-padding">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertises.map((e, i) => (
            <ScrollReveal key={e.id} delay={i * 80}>
              <a href={`#${e.id}`} className="card-equation block p-6 h-full">
                <e.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-heading text-foreground">{e.title.split("—")[0].trim()}</h3>
                <p className="text-muted-foreground mt-2 text-sm font-body">{e.text.slice(0, 120)}…</p>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    <div className="container-main section-padding space-y-20">
      {expertises.map((e, i) => (
        <ExpertiseBlock key={e.id} e={e} i={i} />
      ))}
    </div>
  </>
);

export default CoeurMetierPage;
