import type { BreadcrumbCrumb } from "@/components/SEO";

export const SITE_URL = "https://www.etanche.com";

interface PageSEO {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbCrumb[];
}

export const PAGE_SEO: Record<string, PageSEO> = {
  home: {
    title: "EQUATION étanchéité Auvergne | Toitures terrasses 63",
    description:
      "Expert étanchéité toitures terrasses en Auvergne. 25 ans d'expérience, garantie décennale. Clermont-Ferrand, Puy-de-Dôme, Cantal, Allier.",
    breadcrumbs: [],
  },
  entreprise: {
    title: "L'entreprise EQUATION | Étanchéité Cournon-d'Auvergne",
    description:
      "Entreprise familiale d'étanchéité de toiture terrasse en Auvergne. Certifications, équipe, valeurs. Contact direct gérant.",
    breadcrumbs: [{ name: "Entreprise", path: "/entreprise" }],
  },
  coeurMetier: {
    title: "Cœur de métier | EQUATION étanchéité Auvergne",
    description:
      "Étanchéité bitumineuse, résine PMMA, dalles, végétalisation, recherche de fuite, isolation thermique. 25 ans d'expertise BTP.",
    breadcrumbs: [{ name: "Cœur de métier", path: "/coeur-de-metier" }],
  },
  solutionsInnovantes: {
    title: "Solutions innovantes | EQUATION étanchéité",
    description:
      "Verre cellulaire FOAMGLAS, cool roof, photovoltaïque, résine quartz : les solutions d'étanchéité les plus avancées en Auvergne.",
    breadcrumbs: [{ name: "Solutions innovantes", path: "/solutions-innovantes" }],
  },
  realisations: {
    title: "Réalisations | EQUATION étanchéité Auvergne",
    description:
      "Chantiers d'étanchéité réalisés : CPAM Nevers, Université Clermont, Assemblia, La Glacière. 12+ références maîtres d'ouvrage.",
    breadcrumbs: [{ name: "Réalisations", path: "/realisations" }],
  },
  blog: {
    title: "Blog actualités | EQUATION étanchéité",
    description:
      "Conseils, actualités, expertises métier en étanchéité toiture terrasse. Maintenance, normes DTU, RE 2020, isolation thermique.",
    breadcrumbs: [{ name: "Blog", path: "/blog" }],
  },
  avisClients: {
    title: "Avis clients | EQUATION étanchéité",
    description:
      "Retours d'expérience clients : maîtres d'ouvrage publics, bailleurs sociaux, particuliers. 25 ans de relations de confiance en Auvergne.",
    breadcrumbs: [{ name: "Avis clients", path: "/avis-clients" }],
  },
  aPropos: {
    title: "À propos | EQUATION étanchéité Auvergne",
    description:
      "EQUATION, expertise et savoir-faire en étanchéité depuis plus de 25 ans. Notre histoire, notre équipe, nos engagements qualité.",
    breadcrumbs: [{ name: "À propos", path: "/a-propos" }],
  },
  contact: {
    title: "Contact | EQUATION étanchéité Auvergne",
    description:
      "Devis gratuit étanchéité toiture terrasse. Tél 04 73 87 53 50, info@etanche.com. Cournon-d'Auvergne (63), interventions Auvergne.",
    breadcrumbs: [{ name: "Contact", path: "/contact" }],
  },
  recrutement: {
    title: "Recrutement | Rejoindre EQUATION",
    description:
      "EQUATION recrute des étancheurs qualifiés en Auvergne. CDI, CDD, alternance. Postulez en ligne, contact direct gérant.",
    breadcrumbs: [{ name: "Recrutement", path: "/recrutement" }],
  },
  mentionsLegales: {
    title: "Mentions légales | EQUATION SARL",
    description:
      "Informations légales EQUATION SARL : siège, SIRET, TVA, hébergement, propriété intellectuelle, conditions.",
    breadcrumbs: [{ name: "Mentions légales", path: "/mentions-legales" }],
  },
};
