import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, X } from "lucide-react";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import PhotoGallery, { GalleryImage } from "@/components/PhotoGallery";
import bitumenImg from "@/assets/bitumen-work.jpg";
import greenRoofImg from "@/assets/green-roof.jpg";
import teamImg from "@/assets/team-construction.jpg";
import ipeImg from "@/assets/ipe-terrace.jpg";
import heroImg from "@/assets/hero-home.jpg";

type Realisation = {
  id: string;
  title: string;
  category: string;
  description: string;
  surface?: string;
  technique?: string;
  year?: string;
  location?: string;
  images: GalleryImage[];
};

const categories = [
  "Tous",
  "Étanchéité Bitumineuse",
  "Toiture Végétalisée",
  "Dalles sur Plots",
  "Terrasse IPE",
  "Résine",
  "Recherche de Fuite",
];

// Photos Unsplash thématiques (toitures, étanchéité, bâtiments, IPE, végétalisation)
const U = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const PHOTOS = {
  // Bâtiments / immeubles modernes
  building1: U("1486325212027-8081e485255e"),
  building2: U("1448630360428-65456885c650"),
  building3: U("1487958449943-2429e8be8625"),
  building4: U("1473177104440-ffee2f376098"),
  building5: U("1496564203457-11bb12075d90"),
  // Toitures & étanchéité
  roof1: U("1518780664697-55e3ad937233"),
  roof2: U("1503387762-cf06e0e864cb"),
  roof3: U("1605276374104-dee2a0ed3cd6"),
  // Chantiers & ouvriers
  worker1: U("1581094794329-c8112a89af12"),
  worker2: U("1504307651254-35680f356dfd"),
  worker3: U("1541888946425-d81bb19240f5"),
  worker4: U("1521575107034-e0fa0b594529"),
  // Toitures végétalisées
  green1: U("1416879595882-3373a0480b5b"),
  green2: U("1518531933037-91b2f5f229cc"),
  green3: U("1572297982008-83beb1a23a89"),
  // IPE / terrasses bois
  ipe1: U("1600585154340-be6161a56a0c"),
  ipe2: U("1600566753190-17f0baa2a6c8"),
  ipe3: U("1600210492486-724fe5c67fb0"),
  // Balcons / résine
  balcony1: U("1545324418-cc1a3fa10c00"),
  balcony2: U("1493809842364-78817add7ffb"),
  // Écoles / institutions
  school1: U("1580582932707-520aed937b7b"),
  school2: U("1497486751825-1233686d5d80"),
  // Photovoltaïque
  solar1: U("1509391366360-2e959784a276"),
};

const projects: Realisation[] = [
  {
    id: "cpam-nevers",
    title: "CPAM Nevers",
    category: "Étanchéité Bitumineuse",
    description: "Réfection complète de 6 toitures terrasses du siège de la CPAM. Chantier complexe nécessitant une grue GMA pour acheminer matériaux et isolant. Pose d'un complexe isolant polyuréthane 100mm + étanchéité bicouche soudée selon DTU 43.1.",
    surface: "2 500 m²",
    technique: "Bicouche soudée + isolation PU 100mm",
    year: "2022",
    location: "Nevers (58)",
    images: [
      { src: PHOTOS.building1, alt: "CPAM Nevers - vue d'ensemble", caption: "Vue d'ensemble du bâtiment CPAM avant intervention — 6 toitures terrasses sur 2 500 m²" },
      { src: PHOTOS.worker1, alt: "Pose isolation PU", caption: "Pose de l'isolant polyuréthane 100mm sur pare-vapeur — coefficient λ = 0,022 W/m.K" },
      { src: PHOTOS.roof1, alt: "Étanchéité bicouche soudée", caption: "Soudure au chalumeau de la 1ère couche bitumineuse — élastomère SBS conforme DTU 43.1" },
      { src: PHOTOS.worker2, alt: "Finition autoprotégée", caption: "Pose de la couche de finition autoprotégée par paillettes d'ardoise grise" },
      { src: PHOTOS.roof2, alt: "Toiture terminée", caption: "Toiture livrée — garantie décennale + assurance dommages-ouvrage" },
    ],
  },
  {
    id: "nievre-habitat",
    title: "Nièvre Habitat Nevers",
    category: "Étanchéité Bitumineuse",
    description: "Réhabilitation thermique de 3 immeubles de logements sociaux. Pose d'isolation polyuréthane 100mm sur pare-vapeur, étanchéité bicouche soudée et installation de garde-corps ODCO conformes EN 13374 pour la sécurité des futurs interventions.",
    surface: "1 800 m²",
    technique: "Isolation PU 100mm + bicouche + garde-corps ODCO",
    year: "2021",
    location: "Nevers (58)",
    images: [
      { src: PHOTOS.building2, alt: "Immeubles Nièvre Habitat", caption: "3 immeubles de logements sociaux — 1 800 m² de toitures à rénover" },
      { src: PHOTOS.worker3, alt: "Dépose ancienne étanchéité", caption: "Dépose et tri sélectif de l'ancienne étanchéité — recyclage filière agréée" },
      { src: PHOTOS.worker4, alt: "Pose isolation thermique", caption: "Mise en œuvre isolation polyuréthane 100mm — résistance thermique R = 4,55 m².K/W" },
      { src: PHOTOS.roof3, alt: "Garde-corps ODCO", caption: "Installation des garde-corps ODCO conformes EN 13374 — sécurité permanente" },
    ],
  },
  {
    id: "glaciere",
    title: "Groupe La Glacière — Auvergne Habitat",
    category: "Étanchéité Bitumineuse",
    description: "Pose de verre cellulaire FOAMGLAS collé au bitume à chaud — solution premium garantie 30 ans par le fabricant. Étanche à l'eau et à la vapeur, incompressible, incombustible classement A1 et insensible aux rongeurs.",
    surface: "1 200 m²",
    technique: "FOAMGLAS verre cellulaire collé bitume chaud",
    year: "2020",
    location: "Clermont-Ferrand (63)",
    images: [
      { src: PHOTOS.building3, alt: "Groupe La Glacière", caption: "Bâtiment du Groupe La Glacière — 1 200 m² traités en verre cellulaire FOAMGLAS" },
      { src: PHOTOS.worker1, alt: "Pose verre cellulaire", caption: "Pose des plaques de FOAMGLAS — étanche à l'eau ET à la vapeur (pas de pare-vapeur séparé)" },
      { src: PHOTOS.roof1, alt: "Bitume chaud", caption: "Collage au bitume à chaud — adhérence parfaite et durabilité 30 ans garantie fabricant" },
      { src: PHOTOS.roof2, alt: "Étanchéité finale", caption: "Étanchéité bicouche de finition sur FOAMGLAS — complexe incombustible classement A1" },
    ],
  },
  {
    id: "assemblia",
    title: "Assemblia Clermont-Ferrand",
    category: "Toiture Végétalisée",
    description: "Création d'une toiture-terrasse végétalisée extensive avec complexe anti-racine certifié. Mélange de sedum et graminées résistants à la sécheresse. Substrat 8cm + couche drainante + filtre géotextile sur étanchéité bitumineuse.",
    surface: "800 m²",
    technique: "Végétalisation extensive sedum + complexe anti-racine",
    year: "2023",
    location: "Clermont-Ferrand (63)",
    images: [
      { src: PHOTOS.green1, alt: "Toiture végétalisée Assemblia", caption: "Toiture végétalisée extensive Assemblia — 800 m² de sedum et graminées" },
      { src: PHOTOS.green2, alt: "Complexe drainant", caption: "Mise en œuvre du complexe drainant sur membrane anti-racine certifiée FLL" },
      { src: PHOTOS.green3, alt: "Plantation sedum", caption: "Plantation du sedum en plaques pré-cultivées — couverture végétale immédiate à 95%" },
    ],
  },
  {
    id: "universite-auvergne",
    title: "Université d'Auvergne — Bât. Paul Collomp",
    category: "Étanchéité Bitumineuse",
    description: "Réfection complète de l'étanchéité du bâtiment Paul Collomp de l'Université Clermont Auvergne. Travaux réalisés en site occupé avec contraintes acoustiques et de circulation pour ne pas perturber les enseignements.",
    surface: "800 m²",
    technique: "Réfection bicouche soudée en site occupé",
    year: "2022",
    location: "Clermont-Ferrand (63)",
    images: [
      { src: PHOTOS.school1, alt: "Bâtiment Paul Collomp", caption: "Bâtiment Paul Collomp — Université Clermont Auvergne, intervention en site occupé" },
      { src: PHOTOS.worker2, alt: "Réfection étanchéité", caption: "Dépose des relevés bitumineux dégradés et préparation des supports béton" },
      { src: PHOTOS.roof3, alt: "Étanchéité neuve", caption: "Nouvelle étanchéité bicouche soudée — finition autoprotégée minérale" },
    ],
  },
  {
    id: "arverne",
    title: "Résidence Arverne — Square Habitat",
    category: "Résine",
    description: "Étanchéité liquide à base de résine PMMA sur 2 000 m² de balcons et coursives. Solution sans flamme appliquée à froid, idéale en site occupé. Finition par carrelage collé sur résine pour une durabilité maximale.",
    surface: "2 000 m²",
    technique: "Résine PMMA + carrelage collé",
    year: "2021",
    location: "Clermont-Ferrand (63)",
    images: [
      { src: PHOTOS.balcony1, alt: "Balcons Résidence Arverne", caption: "Résidence Arverne — 2 000 m² de balcons et coursives à étancher" },
      { src: PHOTOS.balcony2, alt: "Application résine PMMA", caption: "Application de la résine PMMA à froid — sans flamme, sans odeur, séchage 30 min" },
      { src: PHOTOS.worker3, alt: "Pose carrelage", caption: "Pose du carrelage collé sur résine armée — durabilité 25 ans+" },
    ],
  },
  {
    id: "terrasse-ipe",
    title: "Terrasse Privée IPE — Lames Premium",
    category: "Terrasse IPE",
    description: "Aménagement d'une toiture-terrasse en lames d'IPE massif posées sur lambourdes aluminium et plots réglables PVC. Bois exotique classe 4 imputrescible, garanti 25 ans sans traitement.",
    surface: "120 m²",
    technique: "Lames IPE 21mm sur plots réglables",
    year: "2023",
    location: "Puy-de-Dôme (63)",
    images: [
      { src: PHOTOS.ipe1, alt: "Terrasse IPE finie", caption: "Terrasse IPE 120 m² — lames 21mm × 145mm en bois exotique classe 4" },
      { src: PHOTOS.ipe2, alt: "Plots réglables", caption: "Plots PVC réglables 40-100mm — drainage naturel et protection de l'étanchéité" },
      { src: PHOTOS.ipe3, alt: "Détail finition IPE", caption: "Finition par clips invisibles inox A4 — aucune vis apparente, esthétique haut de gamme" },
    ],
  },
  {
    id: "murol-sedum",
    title: "Toiture Sedum Murol",
    category: "Toiture Végétalisée",
    description: "Végétalisation extensive d'une toiture-terrasse de 400 m² en zone montagne. Mélange de sedum résistant au gel et aux variations climatiques d'altitude. Rétention d'eau pluviale > 50% du volume annuel.",
    surface: "400 m²",
    technique: "Végétalisation extensive sedum altitude",
    year: "2022",
    location: "Murol (63)",
    images: [
      { src: PHOTOS.green2, alt: "Toiture sedum Murol", caption: "Toiture végétalisée Murol — 400 m² adaptés à l'altitude (850m)" },
      { src: PHOTOS.green3, alt: "Sedum en fleurs", caption: "Sedum en fleurs été — 8 variétés sélectionnées pour résistance gel/sécheresse" },
      { src: PHOTOS.green1, alt: "Vue d'ensemble", caption: "Rétention d'eau pluviale > 50% — gestion EP intégrée et biodiversité urbaine" },
    ],
  },
  {
    id: "jean-alix",
    title: "École Jean Alix — Extension",
    category: "Étanchéité Bitumineuse",
    description: "Étanchéité de l'extension du groupe scolaire Jean Alix. Complexe complet incluant pare-vapeur, isolation laine de roche 140mm (RE 2020), étanchéité bicouche et zinguerie cuivre pour les rives et descentes EP.",
    surface: "600 m²",
    technique: "Bicouche soudée + isolation laine de roche 140mm + zinguerie cuivre",
    year: "2021",
    location: "Puy-de-Dôme (63)",
    images: [
      { src: PHOTOS.school2, alt: "École Jean Alix extension", caption: "Extension du groupe scolaire Jean Alix — 600 m² de toiture neuve RE 2020" },
      { src: PHOTOS.worker4, alt: "Pose isolation laine de roche", caption: "Isolation laine de roche 140mm — performance acoustique + thermique pour ERP" },
      { src: PHOTOS.roof1, alt: "Étanchéité bicouche", caption: "Étanchéité bicouche soudée sur isolation — protection autoprotégée" },
      { src: PHOTOS.worker2, alt: "Zinguerie cuivre", caption: "Façonnage et pose des rives et chéneaux en cuivre 0,6mm — durabilité 80 ans+" },
    ],
  },
  {
    id: "romagnat",
    title: "Romagnat — 18 Logements",
    category: "Étanchéité Bitumineuse",
    description: "Réhabilitation thermique de 18 logements collectifs. Mise aux normes RE 2020 par renforcement de l'isolation existante (sur-isolation 80mm) et réfection complète de l'étanchéité bitumineuse.",
    surface: "1 500 m²",
    technique: "Sur-isolation PU 80mm + bicouche + garde-corps",
    year: "2020",
    location: "Romagnat (63)",
    images: [
      { src: PHOTOS.building4, alt: "Immeuble Romagnat", caption: "Résidence Romagnat — réhabilitation 18 logements collectifs (1 500 m²)" },
      { src: PHOTOS.worker1, alt: "Sur-isolation", caption: "Sur-isolation polyuréthane 80mm sur isolant existant conservé — économie circulaire" },
      { src: PHOTOS.roof2, alt: "Étanchéité finale", caption: "Étanchéité bicouche + relevés conformes DTU 43.1 — éligible MaPrimeRénov Copro" },
    ],
  },
  {
    id: "vic-le-comte",
    title: "Centre Multi-Accueil Vic-le-Comte",
    category: "Étanchéité Bitumineuse",
    description: "Étanchéité neuve d'un centre multi-accueil petite enfance. Cahier des charges renforcé pour un bâtiment recevant des enfants : isolation acoustique, sécurité incendie A1 et matériaux à faibles émissions COV.",
    surface: "350 m²",
    technique: "Étanchéité neuf bicouche + isolation laine de roche A1",
    year: "2022",
    location: "Vic-le-Comte (63)",
    images: [
      { src: PHOTOS.building5, alt: "Centre multi-accueil", caption: "Centre Multi-Accueil Vic-le-Comte — 350 m² pour bâtiment petite enfance" },
      { src: PHOTOS.worker3, alt: "Isolation A1", caption: "Isolation laine de roche classement A1 — sécurité incendie maximale ERP" },
      { src: PHOTOS.roof3, alt: "Finition", caption: "Finition autoprotégée — matériaux faibles émissions COV (label A+)" },
    ],
  },
  {
    id: "le-cendre",
    title: "16 Logements Le Cendre — Accession Sociale",
    category: "Étanchéité Bitumineuse",
    description: "Étanchéité neuve de 16 logements en accession sociale à la propriété. Construction conforme RE 2020 avec isolation thermique haute performance et étanchéité bicouche garantie décennale.",
    surface: "900 m²",
    technique: "Bicouche neuf + isolation PU 120mm RE 2020",
    year: "2021",
    location: "Le Cendre (63)",
    images: [
      { src: PHOTOS.building1, alt: "16 logements Le Cendre", caption: "Programme 16 logements Le Cendre — accession sociale à la propriété" },
      { src: PHOTOS.worker2, alt: "Isolation PU 120mm", caption: "Isolation polyuréthane 120mm — conformité RE 2020 (Up = 0,18 W/m².K)" },
      { src: PHOTOS.roof1, alt: "Étanchéité bicouche", caption: "Étanchéité bicouche soudée — garantie décennale + DO" },
    ],
  },
];

const RealisationsPage = () => {
  const [filter, setFilter] = useState("Tous");
  const [selected, setSelected] = useState<Realisation | null>(null);
  const filtered = filter === "Tous" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <PageHero title="Nos Réalisations" subtitle="25 ans de chantiers d'exception en Auvergne et au-delà" />
      <Breadcrumbs items={[{ label: "Réalisations" }]} />

      <section className="container-main section-padding">
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-subtitle font-medium transition-all ${
                filter === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 60}>
              <button
                type="button"
                onClick={() => setSelected(p)}
                className="card-equation overflow-hidden text-left w-full h-full group"
              >
                <div className="relative">
                  <img
                    src={p.images[0].src}
                    alt={p.images[0].alt}
                    className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    width={400}
                    height={300}
                  />
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-subtitle font-semibold px-3 py-1 rounded-full">
                    {p.category}
                  </span>
                  {p.images.length > 1 && (
                    <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-subtitle font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" />+{p.images.length - 1} photos
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-heading text-foreground">{p.title}</h3>
                  <p className="text-muted-foreground text-sm font-body mt-1">{p.description}</p>
                  {p.surface && (
                    <p className="text-primary font-subtitle font-semibold text-sm mt-2">{p.surface}</p>
                  )}
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </>
  );
};

const ProjectModal = ({ project, onClose }: { project: Realisation; onClose: () => void }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-xl max-w-4xl w-full my-8 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <span className="bg-primary text-primary-foreground text-xs font-subtitle font-semibold px-3 py-1 rounded-full">
              {project.category}
            </span>
            <h2 className="text-xl md:text-2xl font-heading text-foreground mt-2">{project.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="text-muted-foreground hover:text-foreground transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5">
          <PhotoGallery images={project.images} mainHeightClass="h-64 md:h-[400px]" />

          <p className="text-foreground font-body mt-6 leading-relaxed">{project.description}</p>

          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
            {project.surface && (
              <div>
                <dt className="text-muted-foreground font-body">Surface</dt>
                <dd className="text-foreground font-subtitle font-semibold">{project.surface}</dd>
              </div>
            )}
            {project.technique && (
              <div>
                <dt className="text-muted-foreground font-body">Technique</dt>
                <dd className="text-foreground font-subtitle font-semibold">{project.technique}</dd>
              </div>
            )}
            {project.year && (
              <div>
                <dt className="text-muted-foreground font-body">Année</dt>
                <dd className="text-foreground font-subtitle font-semibold">{project.year}</dd>
              </div>
            )}
            {project.location && (
              <div>
                <dt className="text-muted-foreground font-body">Lieu</dt>
                <dd className="text-foreground font-subtitle font-semibold">{project.location}</dd>
              </div>
            )}
          </dl>

          <Link
            to={`/contact?type=${encodeURIComponent(project.category)}`}
            className="btn-bordeaux inline-block mt-6 text-sm"
          >
            Demander un Devis Similaire
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RealisationsPage;
