import { Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import SEO from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo-config";

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

const AvisClientsPage = () => (
  <>
    <SEO
      title={PAGE_SEO.avisClients.title}
      description={PAGE_SEO.avisClients.description}
      path="/avis-clients"
      breadcrumbs={PAGE_SEO.avisClients.breadcrumbs}
    />
    <PageHero title="Ce Que Disent Nos Clients" subtitle="La satisfaction de nos clients est notre meilleure carte de visite" />
    <Breadcrumbs items={[{ label: "Avis Clients" }]} />

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
          href="https://www.google.com/search?q=EQUATION+étanchéité+Cournon-d'Auvergne"
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

export default AvisClientsPage;
