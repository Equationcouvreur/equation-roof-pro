import { Flame, Droplets, Thermometer, Search, Grid3X3, Leaf, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import PhotoGallery, { GalleryImage } from "@/components/PhotoGallery";
import bitumenImg from "@/assets/bitumen-work.jpg";
import greenRoofImg from "@/assets/green-roof.jpg";
import teamImg from "@/assets/team-construction.jpg";
import ipeImg from "@/assets/ipe-terrace.jpg";

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
      { src: teamImg, alt: "Isolation thermique toiture terrasse" },
      { src: bitumenImg, alt: "Pose isolation polyuréthane" },
    ],
    text: "L'isolation thermique par la toiture est le poste n°1 d'économie d'énergie. Jusqu'à 30% des déperditions de chaleur passent par le toit. EQUATION réalise des complexes d'isolation thermique performants en toiture terrasse : mousse polyuréthane projetée, verre cellulaire FOAMGLAS, laine de roche, polystyrène extrudé (XPS). Nos solutions respectent les exigences de la RE 2020 et sont éligibles aux aides MaPrimeRénov.",
    points: ["Conforme RE 2020", "Éligible MaPrimeRénov", "Performances thermiques certifiées", "Couplage isolation + étanchéité"],
  },
  {
    id: "bitumineuse", icon: Flame,
    title: "Étanchéité Bitumineuse — La Solution Éprouvée",
    images: [
      { src: bitumenImg, alt: "Étanchéité bitumineuse soudée" },
      { src: teamImg, alt: "Équipe EQUATION en chantier bitumineuse" },
    ],
    text: "La membrane bitumineuse est le système d'étanchéité le plus répandu sur les toitures terrasses. Chez EQUATION, nous maîtrisons la mise en œuvre des systèmes monocouche et bicouche soudés au chalumeau, conformément au DTU 43.1. Nos équipes interviennent sur tous types de supports — béton, acier, bois — et réalisent des complexes complets incluant pare-vapeur, isolation thermique et revêtement d'étanchéité autoprotégé ou sous protection lourde.",
    points: ["Conforme NF DTU 43.1", "Compatible isolation polyuréthane et verre cellulaire", "Protection autoprotégée ou sous gravillons", "Garantie décennale"],
  },
  {
    id: "resine", icon: Droplets,
    title: "Étanchéité Résine — Sans Joint, Sans Limite",
    images: [{ src: teamImg, alt: "Application résine étanchéité" }],
    text: "Les systèmes d'étanchéité liquide (SEL) permettent de traiter les surfaces complexes, les angles, les relevés et les points singuliers avec une membrane continue sans joint ni soudure. Idéale en rénovation sur supports irréguliers, la résine polyuréthane ou PMMA forme un film étanche parfaitement adhérent au support.",
    points: ["Membrane continue sans raccord", "Idéale pour rénovation et géométries complexes", "Application à froid, sans flamme", "Résistance aux UV et au trafic léger"],
  },
  {
    id: "dalles", icon: Grid3X3,
    title: "Terrasses Dalles sur Plots — Aménagez Votre Toiture",
    images: [{ src: ipeImg, alt: "Terrasse dalles IPE sur plots" }],
    text: "Transformez votre toiture terrasse inaccessible en un véritable espace de vie. Le système de dalles sur plots réglables permet de créer une terrasse accessible et esthétique tout en protégeant le complexe d'étanchéité. EQUATION assure la pose sur plots de dalles béton, grès cérame, pierre naturelle, ainsi que de dalles et lames en bois IPE pour une finition haut de gamme.",
    points: ["Mise à niveau par plots réglables", "Protection de l'étanchéité", "Drainage naturel intégré", "Bois IPE, béton, grès cérame, pierre naturelle"],
  },
  {
    id: "vegetalisee", icon: Leaf,
    title: "Toitures Végétalisées — Performance Écologique",
    images: [{ src: greenRoofImg, alt: "Toiture végétalisée sedum" }],
    text: "La végétalisation des toitures terrasses est une solution écologique et performante qui combine isolation thermique et acoustique, gestion des eaux pluviales, amélioration de la biodiversité urbaine et valorisation esthétique du bâtiment. EQUATION réalise des toitures végétalisées extensives et semi-intensives avec complexe anti-racine certifié.",
    points: ["Complexe bicouche anti-racine certifié", "Végétalisation extensive (sedum, graminées)", "Rétention des eaux pluviales", "Amélioration du confort thermique été/hiver"],
  },
  {
    id: "fuite", icon: Search,
    title: "Recherche de Fuite — Diagnostic Précis et Non Destructif",
    images: [{ src: bitumenImg, alt: "Recherche de fuite toiture" }],
    text: "Les infiltrations en toiture terrasse peuvent être difficiles à localiser car l'eau chemine sous la membrane avant d'apparaître à l'intérieur du bâtiment. EQUATION dispose de technologies de détection avancées pour localiser précisément l'origine des fuites sans destruction du complexe d'étanchéité.",
    points: ["Détection non destructive", "Rapport d'intervention détaillé", "Intervention rapide", "Préconisations de réparation adaptées"],
  },
];

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
        <ScrollReveal key={e.id}>
          <section id={e.id} className="grid md:grid-cols-2 gap-12 items-center scroll-mt-32">
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <PhotoGallery images={e.images} />
            </div>
            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <e.icon className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-2xl md:text-3xl text-foreground">{e.title}</h2>
              <p className="text-muted-foreground mt-4 font-body leading-relaxed">{e.text}</p>
              <ul className="mt-6 space-y-2">
                {e.points.map((p) => (
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
      ))}
    </div>
  </>
);

export default CoeurMetierPage;
