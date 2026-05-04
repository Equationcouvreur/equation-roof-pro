import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Camera, X } from "lucide-react";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import PhotoGallery, { GalleryImage } from "@/components/PhotoGallery";
import YouTubePlayer from "@/components/YouTubePlayer";
import SEO from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo-config";
import { fetchPublishedRealisations, type RealisationCardData } from "@/lib/data-loaders";

type Realisation = {
  id: string;
  slug: string | null;
  title: string;
  category: string;
  description: string;
  surface?: string | null;
  technique?: string | null;
  year?: string | null;
  location?: string | null;
  images: GalleryImage[];
  videoUrl?: string | null;
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

type LoaderData = { realisations?: RealisationCardData[] };

const RealisationsPage = () => {
  // Loader runs at SSG build-time AND on client navigation, so the initial
  // HTML already contains the full list of cards (good for crawlers and AI bots).
  const loaded = useLoaderData() as LoaderData | undefined;
  const initial = loaded?.realisations ?? [];

  const [filter, setFilter] = useState("Tous");
  const [selected, setSelected] = useState<Realisation | null>(null);
  const [allProjects, setAllProjects] = useState<Realisation[]>(initial);

  useEffect(() => {
    // Fallback: if the loader returned nothing (e.g. Supabase unreachable at
    // build time), fetch on the client instead.
    if (allProjects.length > 0) return;
    (async () => {
      const data = await fetchPublishedRealisations();
      setAllProjects(data);
    })();
  }, [allProjects.length]);

  const filtered = filter === "Tous" ? allProjects : allProjects.filter((p) => p.category === filter);

  return (
    <>
      <SEO
        title={PAGE_SEO.realisations.title}
        description={PAGE_SEO.realisations.description}
        path="/realisations"
        breadcrumbs={PAGE_SEO.realisations.breadcrumbs}
      />
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
          {project.videoUrl && (
            <div className="mb-6">
              <p className="text-xs font-subtitle font-semibold uppercase tracking-wide mb-2 text-center" style={{ color: "#96162B" }}>
                Vidéo du chantier
              </p>
              <YouTubePlayer url={project.videoUrl} title={project.title} />
            </div>
          )}
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
