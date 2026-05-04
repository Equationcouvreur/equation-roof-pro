# EQUATION — Site web

Site SSG (Vite + React + Supabase) déployé sur Vercel pour EQUATION SARL,
expert étanchéité toitures terrasses en Auvergne.

## Développement local

```bash
npm install
npm run dev   # http://localhost:8080
```

## Build et pré-rendu

```bash
npm run build           # vite-react-ssg → dist/ avec HTML pré-rendu
npx serve dist -p 3000  # servir dist/ en local pour vérification
```

Le `prebuild` régénère `public/sitemap.xml` à partir des slugs Supabase.

## Déploiement Vercel

### Variables d'environnement requises au build

Configurer dans **Vercel → Project Settings → Environment Variables**
(activées sur Production, Preview et Development) :

| Nom | Source |
|---|---|
| `VITE_SUPABASE_URL` | `.env` local |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env` local (anon key) |
| `VITE_SUPABASE_PROJECT_ID` | `.env` local |

> **⚠️ Sans ces variables au build, les pages détail réalisation et blog ne
> seront pas pré-rendues.** Le build Vercel échouera explicitement
> (`vite.config.ts` lance une erreur fatale en mode production si elles
> manquent), pour éviter de pousser un site sans pages détail.

### Routes pré-rendues au build

- 11 routes statiques (`/`, `/coeur-de-metier`, `/realisations`, ...)
- 13 pages détail réalisation (`/realisations/<slug>/`) fetched depuis Supabase
- N pages blog (`/blog/<slug>/`) fetched depuis `blog_articles`

### Routes en SPA (pas de pré-rendu)

`/admin/*` et `/espace-client/*` restent en client-side rendering.
`vercel.json` les réécrit explicitement vers `/index.html`.

`/realisations/<slug>` et `/blog/<slug>` ont aussi un fallback SPA :
si un nouveau contenu est ajouté en BDD entre deux builds, la page reste
accessible (rendue côté client) avant que le rebuild ne génère le HTML.

## Maintenance

- **Auto-rebuild quand le contenu change** :
  voir [docs/AUTO-REBUILD-SETUP.md](docs/AUTO-REBUILD-SETUP.md) — webhook
  Supabase → Vercel Deploy Hook pour que le site soit régénéré dès que
  Thierry ajoute / modifie / supprime une réalisation ou un article.

- **Migrations Supabase** : `supabase/migrations/*.sql`. Appliquer via
  le SQL Editor du dashboard Supabase. Après application d'une migration
  qui touche le schéma, **recharger le cache PostgREST** :
  `Database → API → "Restart Server"` (ou `NOTIFY pgrst, 'reload schema';`).

- **Compression d'images** : `node scripts/compress-images.mjs` — backup
  dans `scripts/backup-images-original/`.
