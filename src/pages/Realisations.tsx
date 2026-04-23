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

const projects: Realisation[] = [
  {
    id: "cpam-nevers",
    title: "CPAM Nevers",
    category: "Étanchéité Bitumineuse",
    description: "6 toitures terrasses, grue GMA, isolation + étanchéité bicouche",
    surface: "2 500 m²",
    technique: "Bicouche soudée + isolation PU",
    year: "2022",
    location: "Nevers (58)",
    images: [
      { src: bitumenImg, alt: "CPAM Nevers — toiture principale" },
      { src: teamImg, alt: "CPAM Nevers — équipe en intervention" },
      { src: heroImg, alt: "CPAM Nevers — vue d'ensemble" },
    ],
  },
  {
    id: "nievre-habitat",
    title: "Nièvre Habitat Nevers",
    category: "Étanchéité Bitumineuse",
    description: "3 immeubles, isolation PU 100mm, garde-corps ODCO",
    surface: "1 800 m²",
    technique: "Isolation PU 100mm + bicouche",
    year: "2021",
    location: "Nevers (58)",
    images: [
      { src: teamImg, alt: "Nièvre Habitat — chantier" },
      { src: bitumenImg, alt: "Nièvre Habitat — étanchéité" },
    ],
  },
  {
    id: "glaciere",
    title: "Groupe La Glacière",
    category: "Étanchéité Bitumineuse",
    description: "Verre cellulaire au bitume chaud pour Auvergne Habitat",
    surface: "1 200 m²",
    technique: "FOAMGLAS collé bitume chaud",
    year: "2020",
    location: "Clermont-Ferrand (63)",
    images: [
      { src: heroImg, alt: "Groupe La Glacière — vue toiture" },
      { src: bitumenImg, alt: "Groupe La Glacière — pose verre cellulaire" },
    ],
  },
  {
    id: "assemblia",
    title: "Assemblia Clermont-Fd",
    category: "Toiture Végétalisée",
    description: "Végétalisation extensive toiture terrasse",
    surface: "800 m²",
    technique: "Végétalisation extensive sedum",
    year: "2023",
    location: "Clermont-Ferrand (63)",
    images: [{ src: greenRoofImg, alt: "Assemblia — toiture végétalisée" }],
  },
  {
    id: "universite-auvergne",
    title: "Université d'Auvergne",
    category: "Étanchéité Bitumineuse",
    description: "Bât. Paul Collomp — Réfection complète",
    surface: "800 m²",
    technique: "Réfection bicouche",
    year: "2022",
    location: "Clermont-Ferrand (63)",
    images: [{ src: bitumenImg, alt: "Université d'Auvergne — Bât. Paul Collomp" }],
  },
  {
    id: "arverne",
    title: "Résidence Arverne",
    category: "Résine",
    description: "Square Habitat — 2 000 m² balcons, résine + carrelage collé",
    surface: "2 000 m²",
    technique: "Résine PMMA + carrelage",
    year: "2021",
    location: "Clermont-Ferrand (63)",
    images: [{ src: ipeImg, alt: "Résidence Arverne — balcons" }],
  },
  {
    id: "terrasse-ipe",
    title: "Terrasse Privée IPE",
    category: "Terrasse IPE",
    description: "Dalles IPE rectangulaires sur plots réglables",
    surface: "120 m²",
    technique: "Dalles IPE sur plots",
    year: "2023",
    location: "Puy-de-Dôme (63)",
    images: [{ src: ipeImg, alt: "Terrasse IPE privée" }],
  },
  {
    id: "murol-sedum",
    title: "Toiture sedum Murol",
    category: "Toiture Végétalisée",
    description: "Végétalisation extensive avec sedum",
    surface: "400 m²",
    technique: "Végétalisation extensive",
    year: "2022",
    location: "Murol (63)",
    images: [{ src: greenRoofImg, alt: "Toiture sedum Murol" }],
  },
  {
    id: "jean-alix",
    title: "École Jean Alix",
    category: "Étanchéité Bitumineuse",
    description: "Extension groupe scolaire, étanchéité + zinguerie",
    surface: "600 m²",
    technique: "Bicouche + zinguerie",
    year: "2021",
    location: "Puy-de-Dôme (63)",
    images: [{ src: teamImg, alt: "École Jean Alix — chantier" }],
  },
  {
    id: "romagnat",
    title: "Romagnat",
    category: "Étanchéité Bitumineuse",
    description: "Réhabilitation 18 logements, étanchéité",
    surface: "1 500 m²",
    technique: "Réhabilitation étanchéité",
    year: "2020",
    location: "Romagnat (63)",
    images: [{ src: heroImg, alt: "Romagnat — réhabilitation" }],
  },
  {
    id: "vic-le-comte",
    title: "Centre Multi-Accueil Vic-le-Comte",
    category: "Étanchéité Bitumineuse",
    description: "Étanchéité neuf petite enfance",
    surface: "350 m²",
    technique: "Étanchéité neuf bicouche",
    year: "2022",
    location: "Vic-le-Comte (63)",
    images: [{ src: bitumenImg, alt: "Centre Multi-Accueil Vic-le-Comte" }],
  },
  {
    id: "le-cendre",
    title: "16 logements Le Cendre",
    category: "Étanchéité Bitumineuse",
    description: "Étanchéité en accession sociale",
    surface: "900 m²",
    technique: "Étanchéité bicouche",
    year: "2021",
    location: "Le Cendre (63)",
    images: [{ src: teamImg, alt: "Le Cendre — 16 logements" }],
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
