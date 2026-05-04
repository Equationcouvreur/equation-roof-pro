import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import PhotoGallery, { GalleryImage } from "@/components/PhotoGallery";
import YouTubePlayer from "@/components/YouTubePlayer";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Phone } from "lucide-react";

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
  videoUrl?: string | null;
  images: GalleryImage[];
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const RealisationDetailPage = () => {
  const { slug: param = "" } = useParams();
  const [data, setData] = useState<Realisation | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!param) return;
    (async () => {
      setLoading(true);
      const isUuid = UUID_RE.test(param);
      let query = supabase
        .from("realisations")
        .select("id,slug,title,category,description,surface,technique,year,location,video_url")
        .eq("status", "published");
      query = isUuid ? query.eq("id", param) : query.eq("slug", param);
      const { data: row } = await query.maybeSingle();

      if (!row) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // UUID compat → redirect to canonical slug URL.
      if (isUuid && row.slug && row.slug !== param) {
        setRedirectTo(`/realisations/${row.slug}`);
        return;
      }

      const { data: photos } = await supabase
        .from("realisation_photos")
        .select("url,alt_text,caption,display_order,is_favorite")
        .eq("realisation_id", row.id)
        .order("is_favorite", { ascending: false })
        .order("display_order", { ascending: true });

      const images: GalleryImage[] = (photos || []).map((p) => ({
        src: p.url,
        alt: p.alt_text || row.title,
        caption: p.caption || undefined,
      }));

      setData({
        id: row.id,
        slug: row.slug,
        title: row.title,
        category: row.category,
        description: row.description || "",
        surface: row.surface,
        technique: row.technique,
        year: row.year,
        location: row.location,
        videoUrl: (row as { video_url?: string | null }).video_url || null,
        images: images.length ? images : [{ src: "/placeholder.svg", alt: row.title }],
      });
      setLoading(false);
    })();
  }, [param]);

  if (redirectTo) return <Navigate to={redirectTo} replace />;

  if (notFound) {
    return (
      <section className="container-main section-padding">
        <h1 className="text-2xl font-heading mb-4">Réalisation introuvable</h1>
        <p className="font-body mb-6">Cette réalisation n'existe pas ou a été retirée.</p>
        <Link to="/realisations" className="btn-bordeaux text-sm">Retour aux réalisations</Link>
      </section>
    );
  }

  if (loading || !data) {
    return (
      <section className="container-main section-padding">
        <p className="text-muted-foreground font-body">Chargement…</p>
      </section>
    );
  }

  const seoTitle = `${data.title}${data.location ? " — Étanchéité " + data.location : ""} | EQUATION`;
  const seoDescription = (data.description || `Réalisation EQUATION : ${data.title}`).slice(0, 155);

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        path={`/realisations/${data.slug ?? data.id}`}
        ogType="article"
        image={data.images[0]?.src}
        breadcrumbs={[
          { name: "Réalisations", path: "/realisations" },
          { name: data.title, path: `/realisations/${data.slug ?? data.id}` },
        ]}
      />
      <PageHero title={data.title} subtitle={data.category} />
      <Breadcrumbs
        items={[
          { label: "Réalisations", href: "/realisations" },
          { label: data.title },
        ]}
      />

      <section className="container-main section-padding">
        <div className="max-w-4xl mx-auto">
          {data.videoUrl && (
            <div className="mb-8">
              <p className="text-xs font-subtitle font-semibold uppercase tracking-wide mb-2 text-center" style={{ color: "#96162B" }}>
                Vidéo du chantier
              </p>
              <YouTubePlayer url={data.videoUrl} title={data.title} />
            </div>
          )}

          <PhotoGallery images={data.images} mainHeightClass="h-64 md:h-[460px]" />

          <p className="text-foreground font-body mt-8 leading-relaxed">{data.description}</p>

          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-sm">
            {data.surface && (
              <div>
                <dt className="text-muted-foreground font-body">Surface</dt>
                <dd className="text-foreground font-subtitle font-semibold">{data.surface}</dd>
              </div>
            )}
            {data.technique && (
              <div>
                <dt className="text-muted-foreground font-body">Technique</dt>
                <dd className="text-foreground font-subtitle font-semibold">{data.technique}</dd>
              </div>
            )}
            {data.year && (
              <div>
                <dt className="text-muted-foreground font-body">Année</dt>
                <dd className="text-foreground font-subtitle font-semibold">{data.year}</dd>
              </div>
            )}
            {data.location && (
              <div>
                <dt className="text-muted-foreground font-body">Lieu</dt>
                <dd className="text-foreground font-subtitle font-semibold">{data.location}</dd>
              </div>
            )}
          </dl>

          <div className="mt-12 bg-primary rounded-xl p-8 text-center">
            <h2 className="text-xl font-heading text-primary-foreground mb-2">Un projet similaire ?</h2>
            <p className="text-primary-foreground/80 font-body mb-4">Demandez votre devis EQUATION en quelques minutes.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={`/contact?type=${encodeURIComponent(data.category)}`} className="btn-noir">
                Demander un devis
              </Link>
              <a href="tel:0473875350" className="flex items-center gap-2 text-primary-foreground font-subtitle font-semibold">
                <Phone className="w-4 h-4" /> 04 73 87 53 50
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RealisationDetailPage;
