import { Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import SEO from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo-config";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const stats = [
  { value: "25+", label: "Années de confiance" },
  { value: "2 000+", label: "Chantiers livrés" },
  { value: "100%", label: "Garantie décennale sur chaque ouvrage" },
];

const testimonials = [
  {
    initial: "AH", name: "Auvergne Habitat", project: "Maître d'ouvrage — Groupe La Glacière",
    quote: "EQUATION a rénové 1 200 m² de toitures terrasses sur le Groupe La Glacière avec un procédé verre cellulaire au bitume à chaud. Travail soigné et équipes professionnelles.",
  },
  {
    initial: "NH", name: "Niévre Habitat", project: "Rénovation 3 immeubles — Nevers",
    quote: "Rénovation de 3 immeubles d'habitation à Nevers. Isolation polyuréthane 100mm et étanchéité bitumineuse. Chantier livré dans les délais, interlocuteur unique appréciable.",
  },
  {
    initial: "CP", name: "CPAM de Nevers", project: "Réfection 6 toitures terrasses",
    quote: "Réfection complète de l'étanchéité et isolation thermique de 6 toitures terrasses. Montage grue GMA, coordination parfaite avec les occupants du bâtiment.",
  },
  {
    initial: "AS", name: "Assemblia", project: "Toiture végétalisée — Clermont-Ferrand",
    quote: "Transformation réussie d'une toiture terrasse en végétalisation extensive. Résultat à la hauteur de nos attentes, tant sur le plan esthétique que technique.",
  },
  {
    initial: "SH", name: "Square Habitat", project: "2 000 m² balcons — Résidence Arverne",
    quote: "Traitement de 2 000 m² de balcons sur la Résidence Arverne avec procédé résine et protection carrelage collé. Intervention propre et résultat impeccable.",
  },
  {
    initial: "UA", name: "Université d'Auvergne", project: "Bâtiment Paul Collomp — 800 m²",
    quote: "Réfection complète de l'étanchéité et de l'isolation thermique du bâtiment Paul Collomp. Surface de 800 m² traitée dans les règles de l'art.",
  },
];

const AvisClientsPage = () => {
  const [google, setGoogle] = useState<GoogleData | null>(null);

  useEffect(() => {
    supabase.functions.invoke("google-reviews").then(({ data, error }) => {
      if (!error && data) setGoogle(data as GoogleData);
    });
  }, []);

  const googleUrl = google?.googleMapsUri ?? "https://www.google.com/search?q=EQUATION+étanchéité+Cournon-d'Auvergne";

  return (
  <>
    <SEO
      title={PAGE_SEO.avisClients.title}
      description={PAGE_SEO.avisClients.description}
      path="/avis-clients"
      breadcrumbs={PAGE_SEO.avisClients.breadcrumbs}
    />
    <PageHero title="Ce Que Disent Nos Clients" subtitle="La satisfaction de nos clients est notre meilleure carte de visite" />
    <Breadcrumbs items={[{ label: "Avis Clients" }]} />

    {/* Bandeau Google Live */}
    {google && (
      <section className="bg-warm border-b border-border">
        <div className="container-main py-8 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="text-5xl font-heading font-bold text-primary">{google.rating?.toFixed(1)}</div>
            <div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(google.rating ?? 0) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-body mt-1">
                {google.userRatingCount} avis Google
              </p>
            </div>
          </div>
          <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="btn-bordeaux">
            Voir sur Google
          </a>
        </div>
      </section>
    )}

    {/* Stats */}
    <section className="bg-noir section-padding">
      <div className="container-main grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 100}>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-heading font-bold text-primary">{s.value}</div>
              <p className="text-primary-foreground/85 mt-3 font-body">{s.label}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>

    {/* Avis Google en direct */}
    {google && google.reviews.length > 0 && (
      <section className="bg-background section-padding">
        <div className="container-main">
          <ScrollReveal>
            <h2 className="text-foreground text-center mb-2">Avis Google en direct</h2>
            <p className="text-center text-muted-foreground font-body mb-12">
              Mis à jour automatiquement depuis notre fiche Google Business
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {google.reviews.map((r, i) => (
              <ScrollReveal key={`${r.author}-${i}`} delay={i * 80}>
                <div className="card-equation p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    {r.photo ? (
                      <img src={r.photo} alt={r.author} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold">
                        {r.author.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-heading font-semibold text-foreground text-sm">{r.author}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className={`w-3.5 h-3.5 ${idx < r.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground font-body text-sm italic flex-1 line-clamp-6">"{r.text}"</p>
                  <p className="text-muted-foreground font-body text-xs mt-4 pt-4 border-t border-border">{r.relativeTime}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    )}


    {/* Stats */}
    <section className="bg-noir section-padding">
      <div className="container-main grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 100}>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-heading font-bold text-primary">{s.value}</div>
              <p className="text-primary-foreground/85 mt-3 font-body">{s.label}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>

    {/* Témoignages */}
    <section className="bg-warm section-padding">
      <div className="container-main">
        <ScrollReveal>
          <h2 className="text-foreground text-center mb-12">Témoignages</h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 80}>
              <div className="card-equation p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold">
                    {t.initial}
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                <Quote className="w-6 h-6 text-primary/30 mb-2" />
                <p className="text-foreground font-body text-sm italic flex-1">"{t.quote}"</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="font-heading font-semibold text-foreground">{t.name}</p>
                  <p className="text-muted-foreground font-body text-xs mt-0.5">{t.project}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Laisser un avis */}
    <section className="container-main section-padding text-center">
      <ScrollReveal>
        <h2 className="text-foreground mb-4">Vous êtes un client EQUATION ?</h2>
        <p className="text-muted-foreground font-body max-w-2xl mx-auto mb-8">
          Votre retour compte. Laissez-nous un avis sur Google pour aider d'autres professionnels à faire le bon choix.
        </p>
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-bordeaux inline-block"
        >
          Laisser un avis Google
        </a>
      </ScrollReveal>
    </section>

    {/* CTA */}
    <section className="bg-primary section-padding">
      <div className="container-main text-center">
        <ScrollReveal>
          <h2 className="text-primary-foreground">Rejoignez nos clients satisfaits</h2>
          <p className="text-primary-foreground/80 mt-4 font-body text-lg">
            Demandez votre devis gratuit
          </p>
          <Link to="/contact" className="btn-noir inline-block mt-8">Contactez-nous</Link>
        </ScrollReveal>
      </div>
    </section>
  </>
  );
};

export default AvisClientsPage;
