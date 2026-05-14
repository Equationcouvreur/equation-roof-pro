import { Navigate } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";
import RootLayout from "./RootLayout";
import PublicLayout from "./PublicLayout";
import Index from "./pages/Index";
import RouteErrorBoundary from "./components/ErrorFallback";
import { fetchPublishedRealisations, fetchPublishedBlogArticles } from "./lib/data-loaders";

// Wrap loaders so a transient backend failure can never bubble up as
// "Unexpected Application Error" — the page renders with empty data instead.
const safeLoader =
  <T,>(fn: () => Promise<T>, fallback: T) =>
  async () => {
    try {
      return await fn();
    } catch (err) {
      console.warn("[route-loader] failed, using fallback:", err);
      return fallback;
    }
  };

// Helper to convert default-exported pages into the named-exports
// shape that React Router's `lazy` expects.
const lazyDefault =
  (loader: () => Promise<{ default: React.ComponentType<unknown> }>) =>
  async () => {
    const m = await loader();
    return { Component: m.default };
  };

export const routes: RouteRecord[] = [
  {
    Component: RootLayout,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        path: "/",
        Component: PublicLayout,
        children: [
          { index: true, Component: Index },
          {
            path: "entreprise",
            lazy: lazyDefault(() => import("./pages/Entreprise")),
          },
          {
            path: "coeur-de-metier",
            lazy: lazyDefault(() => import("./pages/CoeurMetier")),
          },
          {
            path: "solutions-innovantes",
            lazy: lazyDefault(() => import("./pages/SolutionsInnovantes")),
          },
          {
            path: "realisations",
            lazy: lazyDefault(() => import("./pages/Realisations")),
            loader: safeLoader(
              async () => ({ realisations: await fetchPublishedRealisations() }),
              { realisations: [] },
            ),
          },
          {
            path: "realisations/:slug",
            lazy: lazyDefault(() => import("./pages/RealisationDetail")),
          },
          {
            path: "blog",
            lazy: lazyDefault(() => import("./pages/Blog")),
            loader: safeLoader(
              async () => ({ articles: await fetchPublishedBlogArticles() }),
              { articles: [] },
            ),
          },
          {
            path: "blog/:slug",
            lazy: lazyDefault(() => import("./pages/BlogArticle")),
          },
          {
            path: "avis-clients",
            lazy: lazyDefault(() => import("./pages/AvisClients")),
          },
          { path: "a-propos", element: <Navigate to="/entreprise" replace /> },
          {
            path: "contact",
            lazy: lazyDefault(() => import("./pages/Contact")),
          },
          {
            path: "recrutement",
            lazy: lazyDefault(() => import("./pages/Recrutement")),
          },
          {
            path: "recrutement/merci",
            lazy: lazyDefault(() => import("./pages/RecrutementMerci")),
          },
          {
            path: "mentions-legales",
            lazy: lazyDefault(() => import("./pages/MentionsLegales")),
          },
          {
            path: "espace-client",
            lazy: lazyDefault(() => import("./pages/EspaceClient")),
          },
          {
            path: "espace-client/reset-password",
            lazy: lazyDefault(() => import("./pages/EspaceClientReset")),
          },
          {
            path: "espace-client/update-password",
            lazy: lazyDefault(() => import("./pages/EspaceClientUpdatePassword")),
          },
          { path: "expertises", element: <Navigate to="/coeur-de-metier" replace /> },
          { path: "terrasses-ipe", element: <Navigate to="/coeur-de-metier#dalles" replace /> },
          {
            path: "*",
            lazy: lazyDefault(() => import("./pages/NotFound")),
          },
        ],
      },

      // Admin routes (no public chrome — no Navbar/Footer)
      {
        path: "/admin/login",
        lazy: lazyDefault(() => import("./pages/admin/Login")),
      },
      {
        path: "/admin/reset-password",
        lazy: lazyDefault(() => import("./pages/admin/ResetPassword")),
      },
      {
        path: "/admin/update-password",
        lazy: lazyDefault(() => import("./pages/admin/UpdatePassword")),
      },
      {
        path: "/admin",
        lazy: async () => {
          const [{ default: ProtectedRoute }, { default: AdminLayout }] = await Promise.all([
            import("./components/admin/ProtectedRoute"),
            import("./pages/admin/AdminLayout"),
          ]);
          return {
            element: (
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            ),
          };
        },
        children: [
          {
            index: true,
            lazy: lazyDefault(() => import("./pages/admin/Dashboard")),
          },
          {
            path: "sections",
            lazy: lazyDefault(() => import("./pages/admin/SectionsList")),
          },
          {
            path: "sections/:id",
            lazy: lazyDefault(() => import("./pages/admin/SectionEditor")),
          },
          {
            path: "articles",
            lazy: lazyDefault(() => import("./pages/admin/ArticlesList")),
          },
          {
            path: "articles/:id",
            lazy: lazyDefault(() => import("./pages/admin/ArticleEditor")),
          },
          {
            path: "realisations",
            lazy: lazyDefault(() => import("./pages/admin/RealisationsList")),
          },
          {
            path: "realisations/:id",
            lazy: lazyDefault(() => import("./pages/admin/RealisationEditor")),
          },
          {
            path: "recrutement",
            lazy: lazyDefault(() => import("./pages/admin/JobOffersList")),
          },
          {
            path: "recrutement/:id",
            lazy: lazyDefault(() => import("./pages/admin/JobOfferEditor")),
          },
          {
            path: "candidatures",
            lazy: lazyDefault(() => import("./pages/admin/ApplicationsList")),
          },
          {
            path: "clients",
            lazy: lazyDefault(() => import("./pages/admin/ClientsList")),
          },
          {
            path: "clients/:id",
            lazy: lazyDefault(() => import("./pages/admin/ClientDocuments")),
          },
          {
            path: "medias",
            lazy: lazyDefault(() => import("./pages/admin/AdminMedias")),
          },
          {
            path: "medias/mots-cles",
            lazy: lazyDefault(() => import("./pages/admin/AdminKeywords")),
          },
          {
            path: "securite",
            lazy: lazyDefault(() => import("./pages/admin/Security")),
          },
          {
            path: "users",
            lazy: async () => {
              const [{ default: ProtectedRoute }, { default: Users }] = await Promise.all([
                import("./components/admin/ProtectedRoute"),
                import("./pages/admin/Users"),
              ]);
              return {
                element: (
                  <ProtectedRoute requireAdmin>
                    <Users />
                  </ProtectedRoute>
                ),
              };
            },
          },
        ],
      },
    ],
  },
];
