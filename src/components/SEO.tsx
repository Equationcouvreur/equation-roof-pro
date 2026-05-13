import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.etanche.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export interface BreadcrumbCrumb {
  name: string;
  path: string;
}

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  image?: string;
  breadcrumbs?: BreadcrumbCrumb[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

const SEO = ({
  title,
  description,
  path,
  ogType = "website",
  image = DEFAULT_OG_IMAGE,
  breadcrumbs,
  jsonLd,
  noindex = false,
}: SEOProps) => {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;

  const breadcrumbSchema =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Accueil",
              item: SITE_URL,
            },
            ...breadcrumbs.map((c, i) => ({
              "@type": "ListItem",
              position: i + 2,
              name: c.name,
              item: `${SITE_URL}${c.path === "/" ? "" : c.path}`,
            })),
          ],
        }
      : null;

  const extraSchemas = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={url} />

      <meta name="theme-color" content="#96162B" />

      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:site_name" content="EQUATION étanchéité Auvergne" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      {extraSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
