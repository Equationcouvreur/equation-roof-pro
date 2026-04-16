import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import bitumenImg from "@/assets/bitumen-work.jpg";
import greenRoofImg from "@/assets/green-roof.jpg";
import teamImg from "@/assets/team-construction.jpg";
import ipeImg from "@/assets/ipe-terrace.jpg";

const articles = [
  { slug: "signes-renovation-etancheite", cat: "Conseils", date: "12 mars 2026", img: bitumenImg, title: "Les 5 Signes qu'il Est Temps de Rénover l'Étanchéité de Votre Toiture Terrasse", excerpt: "Flaques stagnantes, fissures dans les membranes, taches d'humidité au plafond... Découvrez les signaux d'alerte à ne pas ignorer." },
  { slug: "bitumineuse-vs-resine", cat: "Guide Technique", date: "5 mars 2026", img: teamImg, title: "Étanchéité Bitumineuse vs Résine : Quelle Solution Choisir ?", excerpt: "Comparatif détaillé des deux systèmes d'étanchéité les plus courants : avantages, inconvénients, coûts et cas d'usage." },
  { slug: "toiture-vegetalisee-2026", cat: "Écologie", date: "20 février 2026", img: greenRoofImg, title: "Toiture Végétalisée : Avantages, Coûts et Réglementation en 2026", excerpt: "Avantages thermiques, rétention des eaux pluviales, conformité PLU et coût au m² : tout savoir sur la végétalisation." },
  { slug: "dtu-43-1", cat: "Réglementation", date: "10 février 2026", img: bitumenImg, title: "DTU 43.1 : Comprendre la Norme Étanchéité des Toitures Terrasses", excerpt: "Vulgarisation de la norme, obligations légales et pourquoi choisir un professionnel certifié." },
  { slug: "isolation-thermique-toiture", cat: "Économie d'énergie", date: "1 février 2026", img: teamImg, title: "Isolation Thermique par la Toiture : Poste N°1 d'Économie d'Énergie", excerpt: "30% des déperditions passent par le toit. Lien avec l'étanchéité et aides MaPrimeRénov." },
  { slug: "dalles-sur-plots", cat: "Aménagement", date: "20 janvier 2026", img: ipeImg, title: "Dalles sur Plots : Transformer sa Toiture Terrasse en Espace de Vie", excerpt: "Comment ça fonctionne, types de dalles, hauteur de plots et avantages du drainage intégré." },
  { slug: "bois-ipe-terrasses", cat: "Matériaux", date: "10 janvier 2026", img: ipeImg, title: "Le Bois IPE : L'Essence Reine des Terrasses Extérieures", excerpt: "Propriétés, durabilité, entretien et comparatif avec les autres essences de bois." },
  { slug: "recherche-fuite-toiture", cat: "Diagnostic", date: "2 janvier 2026", img: bitumenImg, title: "Recherche de Fuite en Toiture Terrasse : Technologies Modernes", excerpt: "Thermographie, tests fumigènes, détection électrique : quand et comment intervenir." },
];

const BlogPage = () => (
  <>
    <PageHero title="Notre Blog" subtitle="Conseils et expertise en étanchéité de toitures terrasses" />
    <Breadcrumbs items={[{ label: "Blog" }]} />

    <section className="container-main section-padding">
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <div className="grid sm:grid-cols-2 gap-6">
            {articles.map((a, i) => (
              <ScrollReveal key={a.slug} delay={i * 80}>
                <Link to={`/blog/${a.slug}`} className="card-equation overflow-hidden block h-full">
                  <img src={a.img} alt={a.title} className="w-full h-44 object-cover" loading="lazy" width={400} height={250} />
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-primary text-primary-foreground text-xs font-subtitle font-semibold px-2 py-0.5 rounded">{a.cat}</span>
                      <span className="text-xs text-muted-foreground font-body">{a.date}</span>
                    </div>
                    <h3 className="text-base font-heading text-foreground leading-snug">{a.title}</h3>
                    <p className="text-muted-foreground text-sm font-body mt-2 line-clamp-2">{a.excerpt}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="card-equation p-6">
            <h3 className="text-lg font-heading text-foreground mb-4">Catégories</h3>
            <div className="space-y-2">
              {["Conseils", "Guide Technique", "Écologie", "Réglementation", "Économie d'énergie", "Aménagement", "Matériaux", "Diagnostic"].map((c) => (
                <div key={c} className="text-sm font-body text-muted-foreground hover:text-primary cursor-pointer transition-colors">{c}</div>
              ))}
            </div>
          </div>
          <div className="card-equation p-6">
            <h3 className="text-lg font-heading text-foreground mb-4">Articles Populaires</h3>
            <div className="space-y-3">
              {articles.slice(0, 3).map((a) => (
                <Link key={a.slug} to={`/blog/${a.slug}`} className="block text-sm font-body text-muted-foreground hover:text-primary transition-colors">
                  {a.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-primary rounded-xl p-6 text-center">
            <h3 className="text-lg font-heading text-primary-foreground mb-2">Besoin d'un devis ?</h3>
            <p className="text-primary-foreground/80 text-sm font-body mb-4">Réponse sous 48h</p>
            <Link to="/contact" className="btn-noir text-sm">Contactez-nous</Link>
          </div>
        </aside>
      </div>
    </section>
  </>
);

export default BlogPage;
