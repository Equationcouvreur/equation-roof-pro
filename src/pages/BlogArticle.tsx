import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import { Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type StaticArticle = { title: string; cat: string; date: string; content: string[] };

const articleContent: Record<string, StaticArticle> = {
  "signes-renovation-etancheite": {
    title: "Les 5 Signes qu'il Est Temps de Rénover l'Étanchéité de Votre Toiture Terrasse",
    cat: "Conseils", date: "12 mars 2026",
    content: [
      "La toiture terrasse est l'un des éléments les plus exposés de votre bâtiment. Soumise aux intempéries, aux variations de température et aux UV, elle se dégrade naturellement au fil du temps. Mais comment savoir quand il est temps d'intervenir ?",
      "1. Des flaques d'eau stagnantes après la pluie — Si l'eau ne s'évacue pas correctement et forme des flaques persistantes, c'est le signe que le système de pente ou les évacuations sont défaillants. L'eau stagnante accélère la dégradation de la membrane d'étanchéité.",
      "2. Des fissures visibles sur la membrane — Les membranes bitumineuses peuvent se fissurer sous l'effet du vieillissement et des chocs thermiques. Ces fissures sont autant de points d'entrée potentiels pour l'eau.",
      "3. Des taches d'humidité au plafond — C'est souvent le premier signe visible à l'intérieur du bâtiment. Les taches brunes ou les cloques de peinture au plafond trahissent une infiltration active.",
      "4. Une membrane de plus de 20 ans — La durée de vie moyenne d'une étanchéité bitumineuse est de 20 à 25 ans. Au-delà, même sans signe visible, un diagnostic s'impose pour évaluer l'état du complexe.",
      "5. Une hausse inexpliquée de votre facture de chauffage — Si votre isolation thermique est couplée à l'étanchéité (ce qui est souvent le cas en toiture terrasse), une dégradation de l'un entraîne l'autre. Une surconsommation peut indiquer une isolation humide et donc inefficace.",
      "En cas de doute, EQUATION réalise un diagnostic complet de votre toiture terrasse avec rapport détaillé et préconisations. N'attendez pas que les dégâts s'aggravent pour agir.",
    ],
  },
  "bitumineuse-vs-resine": {
    title: "Étanchéité Bitumineuse vs Résine : Quelle Solution Choisir ?",
    cat: "Guide Technique", date: "5 mars 2026",
    content: [
      "Le choix du système d'étanchéité est crucial pour la pérennité de votre toiture terrasse. Les deux solutions les plus courantes sont l'étanchéité bitumineuse et l'étanchéité résine (SEL). Chacune a ses avantages et ses cas d'usage privilégiés.",
      "L'étanchéité bitumineuse est le système historique et le plus répandu. Les membranes sont soudées au chalumeau et forment un complexe robuste et éprouvé. Elle est idéale pour les grandes surfaces planes et les toitures neuves. Son coût au m² est généralement plus compétitif.",
      "L'étanchéité résine (Système d'Étanchéité Liquide) est une solution plus récente qui s'applique à froid sous forme liquide. Elle forme une membrane continue sans joint, ce qui la rend idéale pour les surfaces complexes avec de nombreux points singuliers (relevés, pénétrations, angles).",
      "En rénovation, la résine présente un avantage majeur : elle peut s'appliquer directement sur l'ancien revêtement sans dépose, ce qui réduit considérablement le coût et la durée des travaux.",
      "Chez EQUATION, nous maîtrisons les deux techniques et nous vous conseillons la solution la plus adaptée à votre configuration. Contactez-nous pour un diagnostic gratuit.",
    ],
  },
};

const defaultContent: StaticArticle = {
  title: "Article", cat: "Blog", date: "2026",
  content: ["Contenu de l'article à venir. Contactez EQUATION pour plus d'informations sur nos services d'étanchéité."],
};

type DbArticle = { title: string; cat: string; date: string; html: string };

const BlogArticlePage = () => {
  const { slug } = useParams();
  const [dbArticle, setDbArticle] = useState<DbArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from("blog_articles")
        .select("title,category,content,published_at")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (data) {
        setDbArticle({
          title: data.title,
          cat: data.category,
          date: data.published_at ? new Date(data.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "",
          html: data.content || "",
        });
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading && !articleContent[slug || ""]) {
    return (
      <section className="container-main section-padding">
        <p className="text-muted-foreground">Chargement…</p>
      </section>
    );
  }

  if (dbArticle) {
    return (
      <>
        <PageHero title={dbArticle.title} />
        <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: dbArticle.title }]} />
        <section className="container-main section-padding">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-primary text-primary-foreground text-sm font-subtitle font-semibold px-2 py-0.5 rounded">{dbArticle.cat}</span>
              <span className="text-sm text-muted-foreground font-body">{dbArticle.date}</span>
            </div>
            <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-foreground prose-p:font-body prose-a:text-primary prose-img:rounded-lg" dangerouslySetInnerHTML={{ __html: dbArticle.html }} />

            <div className="mt-12 bg-primary rounded-xl p-8 text-center">
              <h3 className="text-xl font-heading text-primary-foreground mb-2">Besoin d'un diagnostic ?</h3>
              <p className="text-primary-foreground/80 font-body mb-4">Contactez EQUATION pour un devis gratuit</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="btn-noir">Contactez-nous</Link>
                <a href="tel:0473875350" className="flex items-center gap-2 text-primary-foreground font-subtitle font-semibold">
                  <Phone className="w-4 h-4" /> 04 73 87 53 50
                </a>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const article = articleContent[slug || ""] || defaultContent;
  return (
    <>
      <PageHero title={article.title} />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: article.title }]} />

      <section className="container-main section-padding">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-primary text-primary-foreground text-sm font-subtitle font-semibold px-2 py-0.5 rounded">{article.cat}</span>
            <span className="text-sm text-muted-foreground font-body">{article.date}</span>
          </div>
          <div className="prose prose-lg max-w-none">
            {article.content.map((p, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <p className="text-foreground font-body leading-relaxed mb-4">{p}</p>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-12 bg-primary rounded-xl p-8 text-center">
            <h3 className="text-xl font-heading text-primary-foreground mb-2">Besoin d'un diagnostic ?</h3>
            <p className="text-primary-foreground/80 font-body mb-4">Contactez EQUATION pour un devis gratuit</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-noir">Contactez-nous</Link>
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

export default BlogArticlePage;
