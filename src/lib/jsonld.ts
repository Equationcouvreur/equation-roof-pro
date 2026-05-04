// Schema.org structured data builders for SEO.
// Inject the result on the relevant page via the <SEO jsonLd={...} /> prop.

export const ORGANIZATION_URL = "https://etanche.com";

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": `${ORGANIZATION_URL}/#organization`,
    name: "EQUATION SARL",
    url: ORGANIZATION_URL,
    telephone: "+33473875350",
    email: "info@etanche.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cournon-d'Auvergne",
      postalCode: "63800",
      addressRegion: "Auvergne-Rhône-Alpes",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 45.745,
      longitude: 3.193,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Puy-de-Dôme" },
      { "@type": "AdministrativeArea", name: "Cantal" },
      { "@type": "AdministrativeArea", name: "Haute-Loire" },
      { "@type": "AdministrativeArea", name: "Allier" },
    ],
    priceRange: "€€",
    knowsAbout: [
      "Étanchéité bitumineuse",
      "Étanchéité résine PMMA",
      "Toiture végétalisée",
      "Verre cellulaire FOAMGLAS",
      "Recherche de fuite",
      "Isolation thermique RE 2020",
    ],
    hasCredential: ["Garantie décennale", "Assurance dommages-ouvrage"],
  } as const;
}
