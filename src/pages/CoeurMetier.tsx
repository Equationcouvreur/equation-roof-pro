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

const U = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const expertises: Expertise[] = [
  {
    id: "isolation", icon: Thermometer,
    title: "Isolation Thermique — Le Poste N°1 d'Économie d'Énergie",
    images: [
      { src: U("1581094794329-c8112a89af12"), alt: "Isolation thermique toiture", caption: "Pose d'isolant polyuréthane 100mm — coefficient λ = 0,022 W/m.K, conforme RE 2020" },
      { src: U("1504307651254-35680f356dfd"), alt: "Pose laine de roche", caption: "Mise en œuvre laine de roche 140mm — performance acoustique + thermique pour ERP" },
      { src: teamImg, alt: "Complexe isolant", caption: "Couplage pare-vapeur + isolation + étanchéité bicouche — solution intégrée éligible MaPrimeRénov" },
    ],
    text: "L'isolation thermique par la toiture est le poste n°1 d'économie d'énergie. Jusqu'à 30% des déperditions de chaleur passent par le toit. EQUATION réalise des complexes d'isolation thermique performants en toiture terrasse : mousse polyuréthane projetée, verre cellulaire FOAMGLAS, laine de roche, polystyrène extrudé (XPS). Nos solutions respectent les exigences de la RE 2020 et sont éligibles aux aides MaPrimeRénov.",
    points: ["Conforme RE 2020", "Éligible MaPrimeRénov", "Performances thermiques certifiées", "Couplage isolation + étanchéité"],
  },
  {
    id: "bitumineuse", icon: Flame,
    title: "Étanchéité Bitumineuse — La Solution Éprouvée",
    images: [
      { src: U("1518780664697-55e3ad937233"), alt: "Étanchéité bicouche soudée", caption: "Soudure au chalumeau de la 1ère couche bitumineuse — élastomère SBS conforme DTU 43.1" },
      { src: bitumenImg, alt: "Finition autoprotégée", caption: "Finition autoprotégée par paillettes d'ardoise — résistance UV + esthétique" },
      { src: U("1605276374104-dee2a0ed3cd6"), alt: "Toiture bitumineuse terminée", caption: "Toiture livrée — garantie décennale + assurance dommages-ouvrage" },
    ],
    text: "La membrane bitumineuse est le système d'étanchéité le plus répandu sur les toitures terrasses. Chez EQUATION, nous maîtrisons la mise en œuvre des systèmes monocouche et bicouche soudés au chalumeau, conformément au DTU 43.1. Nos équipes interviennent sur tous types de supports — béton, acier, bois — et réalisent des complexes complets incluant pare-vapeur, isolation thermique et revêtement d'étanchéité autoprotégé ou sous protection lourde.",
    points: ["Conforme NF DTU 43.1", "Compatible isolation polyuréthane et verre cellulaire", "Protection autoprotégée ou sous gravillons", "Garantie décennale"],
  },
  {
    id: "resine", icon: Droplets,
    title: "Étanchéité Résine — Sans Joint, Sans Limite",
    images: [
      { src: U("1545324418-cc1a3fa10c00"), alt: "Application résine", caption: "Application de résine PMMA à froid — sans flamme, idéale en site occupé" },
      { src: U("1493809842364-78817add7ffb"), alt: "Résine sur balcon", caption: "Membrane continue sans joint sur balcons et coursives — résistance UV et trafic" },
      { src: teamImg, alt: "Préparation support", caption: "Préparation du support et primaire d'accrochage — adhérence parfaite garantie" },
    ],
    text: "Les systèmes d'étanchéité liquide (SEL) permettent de traiter les surfaces complexes, les angles, les relevés et les points singuliers avec une membrane continue sans joint ni soudure. Idéale en rénovation sur supports irréguliers, la résine polyuréthane ou PMMA forme un film étanche parfaitement adhérent au support.",
    points: ["Membrane continue sans raccord", "Idéale pour rénovation et géométries complexes", "Application à froid, sans flamme", "Résistance aux UV et au trafic léger"],
  },
  {
    id: "dalles", icon: Grid3X3,
    title: "Terrasses Dalles sur Plots — Aménagez Votre Toiture",
    images: [
      { src: U("1600585154340-be6161a56a0c"), alt: "Terrasse dalles IPE", caption: "Lames d'IPE 21mm sur plots réglables PVC — bois exotique classe 4 imputrescible" },
      { src: U("1600566753190-17f0baa2a6c8"), alt: "Plots réglables", caption: "Plots PVC réglables 40-100mm — drainage naturel et protection de l'étanchéité" },
      { src: ipeImg, alt: "Finition haut de gamme", caption: "Clips invisibles inox A4 — aucune vis apparente, esthétique premium" },
    ],
    text: "Transformez votre toiture terrasse inaccessible en un véritable espace de vie. Le système de dalles sur plots réglables permet de créer une terrasse accessible et esthétique tout en protégeant le complexe d'étanchéité. EQUATION assure la pose sur plots de dalles béton, grès cérame, pierre naturelle, ainsi que de dalles et lames en bois IPE pour une finition haut de gamme.",
    points: ["Mise à niveau par plots réglables", "Protection de l'étanchéité", "Drainage naturel intégré", "Bois IPE, béton, grès cérame, pierre naturelle"],
  },
  {
    id: "vegetalisee", icon: Leaf,
    title: "Toitures Végétalisées — Performance Écologique",
    images: [
      { src: U("1416879595882-3373a0480b5b"), alt: "Toiture végétalisée sedum", caption: "Végétalisation extensive sedum — couverture végétale immédiate à 95%" },
      { src: U("1518531933037-91b2f5f229cc"), alt: "Complexe drainant", caption: "Mise en œuvre du complexe drainant sur membrane anti-racine certifiée FLL" },
      { src: U("1572297982008-83beb1a23a89"), alt: "Sedum en fleurs", caption: "Rétention d'eau pluviale > 50% — gestion EP et biodiversité urbaine" },
    ],
    text: "La végétalisation des toitures terrasses est une solution écologique et performante qui combine isolation thermique et acoustique, gestion des eaux pluviales, amélioration de la biodiversité urbaine et valorisation esthétique du bâtiment. EQUATION réalise des toitures végétalisées extensives et semi-intensives avec complexe anti-racine certifié.",
    points: ["Complexe bicouche anti-racine certifié", "Végétalisation extensive (sedum, graminées)", "Rétention des eaux pluviales", "Amélioration du confort thermique été/hiver"],
  },
  {
    id: "fuite", icon: Search,
    title: "Recherche de Fuite — Diagnostic Précis et Non Destructif",
    images: [
      { src: U("1581092918056-0c4c3acd3789"), alt: "Caméra thermique", caption: "Détection par caméra thermique infrarouge — localisation précise sans destruction" },
      { src: bitumenImg, alt: "Test fumigène", caption: "Test fumigène sur étanchéité — vérification de l'intégrité de la membrane" },
      { src: U("1504917595217-d4dc5ebe6122"), alt: "Rapport d'intervention", caption: "Rapport d'intervention détaillé avec photos et préconisations de réparation" },
    ],
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
