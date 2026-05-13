import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import SEO from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo-config";
import { fetchPublishedBlogArticles, type BlogArticleData } from "@/lib/data-loaders";
import bitumenImg from "@/assets/bitumen-work.jpg";

type Article = {
  slug: string;
  cat: string;
  date: string;
  img: string;
  title: string;
  excerpt: string;
  alt: string;
  keywords: string[];
};

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};

const toArticles = (db: BlogArticleData[]): Article[] =>
  db.map((a) => ({
    slug: a.slug,
    cat: a.category,
    date: formatDate(a.publishedAt),
    img: a.coverImageUrl || bitumenImg,
    title: a.title,
    excerpt: a.excerpt,
    alt: a.coverAltText || a.title,
    keywords: a.coverKeywords || [],
  }));

type LoaderData = { articles?: BlogArticleData[] };

const BlogPage = () => {
  const loaded = useLoaderData() as LoaderData | undefined;
  const initial = loaded?.articles?.length ? toArticles(loaded.articles) : [];
  const [articles, setArticles] = useState<Article[]>(initial);
  const hasDbArticles = (loaded?.articles?.length ?? 0) > 0;

  useEffect(() => {
    if (hasDbArticles) return;
    (async () => {
      const data = await fetchPublishedBlogArticles();
      if (data.length) setArticles(toArticles(data));
    })();
  }, [hasDbArticles]);

  return (
    <>
      <SEO
        title={PAGE_SEO.blog.title}
        description={PAGE_SEO.blog.description}
        path="/blog"
        breadcrumbs={PAGE_SEO.blog.breadcrumbs}
      />
      <PageHero title="Notre Blog" subtitle="Conseils et expertise en étanchéité de toitures terrasses" />
      <Breadcrumbs items={[{ label: "Blog" }]} />

      <section className="container-main section-padding">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            {articles.length === 0 ? (
              <p className="text-muted-foreground font-body">Aucun article pour le moment.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {articles.map((a, i) => (
                  <ScrollReveal key={a.slug} delay={i * 80}>
                    <Link to={`/blog/${a.slug}`} className="card-equation overflow-hidden block h-full">
                      <img
                        src={a.img}
                        alt={a.alt}
                        data-keywords={a.keywords.length ? a.keywords.join(",") : undefined}
                        className="w-full h-44 object-cover"
                        loading="lazy"
                        decoding="async"
                        width={400}
                        height={250}
                      />
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
            )}
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
};

export default BlogPage;
