import { Flame, Droplets, Gem, Search, Grid3X3, Leaf, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import bitumenImg from "@/assets/bitumen-work.jpg";
import greenRoofImg from "@/assets/green-roof.jpg";
import teamImg from "@/assets/team-construction.jpg";
import ipeImg from "@/assets/ipe-terrace.jpg";

const expertises = [
  {
    id: "bitumineuse", icon: Flame,
    title: "Étanchéité Bitumineuse — La Solution Éprouvée", img: bitumenImg,
    text: "La membrane bitumineuse est le système d'étanchéité le plus répandu sur les toitures terrasses. Chez EQUATION, nous maîtrisons la mise en œuvre des systèmes monocouche et bicouche soudés au chalumeau, conformément au DTU 43.1. Nos équipes interviennent sur tous types de supports — béton, acier, bois — et réalisent des complexes complets incluant pare-vapeur, isolation thermique et revêtement d'étanchéité autoprotégé ou sous protection lourde.",
    points: ["Conforme NF DTU 43.1", "Compatible isolation polyuréthane et verre cellulaire", "Protection autoprotégée ou sous gravillons", "Garantie décennale"],
  },
  {
    id: "resine", icon: Droplets,
    title: "Étanchéité Résine — Sans Joint, Sans Limite", img: teamImg,
    text: "Les systèmes d'étanchéité liquide (SEL) permettent de traiter les surfaces complexes, les angles, les relevés et les points singuliers avec une membrane continue sans joint ni soudure. Idéale en rénovation sur supports irréguliers, la résine polyuréthane ou PMMA forme un film étanche parfaitement adhérent au support.",
    points: ["Membrane continue sans raccord", "Idéale pour rénovation et géométries complexes", "Application à froid, sans flamme", "Résistance aux UV et au trafic léger"],
  },
  {
    id: "quartz", icon: Gem,
    title: "Revêtement Quartz — Esthétique et Performance", img: ipeImg,
    text: "Le revêtement quartz combine étanchéité et finition décorative pour les terrasses accessibles, balcons et coursives. Ce système multicouche alliant résine et granulats de quartz colorés offre une surface antidérapante, résistante au trafic piétonnier et aux intempéries.",
    points: ["Finition décorative colorée", "Surface antidérapante classée", "Résistant au trafic piétonnier", "Entretien minimal"],
  },
  {
    id: "fuite", icon: Search,
    title: "Recherche de Fuite — Diagnostic Précis et Non Destructif", img: bitumenImg,
    text: "Les infiltrations en toiture terrasse peuvent être difficiles à localiser car l'eau chemine sous la membrane avant d'apparaître à l'intérieur du bâtiment. EQUATION dispose de technologies de détection avancées pour localiser précisément l'origine des fuites sans destruction du complexe d'étanchéité.",
    points: ["Détection non destructive", "Rapport d'intervention détaillé", "Intervention rapide", "Préconisations de réparation adaptées"],
  },
  {
    id: "dalles", icon: Grid3X3,
    title: "Dalles sur Plots — Aménagez Votre Toiture Terrasse", img: ipeImg,
    text: "Transformez votre toiture terrasse inaccessible en un véritable espace de vie. Le système de dalles sur plots réglables permet de créer une terrasse accessible et esthétique tout en protégeant le complexe d'étanchéité. EQUATION assure la pose sur plots de dalles béton, grès cérame, pierre naturelle ou bois reconstitué.",
    points: ["Mise à niveau par plots réglables", "Protection de l'étanchéité", "Drainage naturel intégré", "Large choix de matériaux et formats"],
  },
  {
    id: "vegetalisee", icon: Leaf,
    title: "Toiture Végétalisée — Performance Écologique", img: greenRoofImg,
    text: "La végétalisation des toitures terrasses est une solution écologique et performante qui combine isolation thermique et acoustique, gestion des eaux pluviales, amélioration de la biodiversité urbaine et valorisation esthétique du bâtiment. EQUATION réalise des toitures végétalisées extensives et semi-intensives avec complexe anti-racine certifié.",
    points: ["Complexe bicouche anti-racine certifié", "Végétalisation extensive (sedum, graminées)", "Rétention des eaux pluviales", "Amélioration du confort thermique été/hiver"],
  },
];

const ExpertisesPage = () => (
  <>
    <PageHero title="Nos Expertises en Étanchéité" subtitle="Des solutions techniques éprouvées pour chaque configuration de toiture" />
    <Breadcrumbs items={[{ label: "Nos Expertises" }]} />

    <div className="container-main section-padding space-y-20">
      {expertises.map((e, i) => (
        <ScrollReveal key={e.id}>
          <section id={e.id} className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <img src={e.img} alt={`${e.title} Clermont-Ferrand`} className="rounded-xl w-full h-72 md:h-96 object-cover" loading="lazy" width={600} height={400} />
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

export default ExpertisesPage;
