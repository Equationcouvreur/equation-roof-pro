# Auto-rebuild quand le contenu change

Quand Thierry ajoute, modifie ou supprime une réalisation depuis l'admin
(ou un article de blog), la BDD est immédiatement à jour mais le HTML
pré-rendu reste figé jusqu'au prochain build. Un **filet de sécurité SPA**
est déjà en place côté Vercel (cf. `vercel.json` — rewrites pour
`/realisations/:slug` et `/blog/:slug`), donc la nouvelle page reste
accessible sans 404. Mais pour avoir aussi l'avantage SEO du HTML
pré-rendu, il faut déclencher un rebuild automatique.

Cette page documente la mise en place : **un Deploy Hook Vercel + deux
Database Webhooks Supabase** (un pour `realisations`, un pour `blog_articles`).

## 1. Créer le Deploy Hook côté Vercel

1. Aller sur **Vercel → ton projet → Settings → Git → Deploy Hooks**.
2. Cliquer **Create Hook**.
3. Champs :
   - **Hook Name** : `supabase-content-update`
   - **Git Branch Name** : `main`
4. **Copier l'URL générée** — elle ressemble à
   `https://api.vercel.com/v1/integrations/deploy/prj_xxxxx/yyyyyyyy`.
   Garde-la sous la main pour les étapes suivantes (elle ne sera plus
   affichée en clair après).

## 2. Créer le Webhook Supabase pour `realisations`

1. Aller sur **Supabase Dashboard → Database → Webhooks**.
2. Cliquer **Create a new webhook**.
3. Champs :
   - **Name** : `rebuild-on-realisation-change`
   - **Table** : `realisations`
   - **Events** : cocher **Insert**, **Update**, **Delete**
   - **Type** : `HTTP Request`
   - **Method** : `POST`
   - **URL** : coller l'URL du Deploy Hook copiée à l'étape 1
   - **HTTP Headers** : laisser vide (Vercel n'exige rien)
   - **HTTP Params** : laisser vide
4. **Save**.

## 3. Créer le second Webhook pour `blog_articles`

Même procédure que l'étape 2, avec :
- **Name** : `rebuild-on-blog-article-change`
- **Table** : `blog_articles`
- Tout le reste identique (même URL Deploy Hook).

## 4. Tester

1. Insérer une ligne factice dans `realisations` via le SQL Editor :
   ```sql
   INSERT INTO realisations (title, category, description, status, slug, display_order)
   VALUES ('Test webhook', 'Étanchéité Bitumineuse', 'Test', 'draft', 'test-webhook', 999);
   ```
2. Aller sur **Vercel → Deployments** : un nouveau build doit apparaître
   dans les 30 secondes.
3. Une fois le build terminé (~2-3 min), supprimer la ligne factice :
   ```sql
   DELETE FROM realisations WHERE slug = 'test-webhook';
   ```
   Un nouveau build se lance également → confirme que le webhook réagit
   aussi au DELETE.

## Notes importantes

- **Latence** : le rebuild prend environ **2 à 3 minutes**. La nouvelle
  réalisation n'apparaît donc pas instantanément en HTML pré-rendu.
- **Filet SPA** : entre la modification et la fin du rebuild, la page est
  servie en client-side rendering (CSR) grâce aux rewrites `vercel.json`.
  Zéro 404 visible côté utilisateur.
- **Quota Vercel** : un plan **Hobby** autorise 100 builds par jour. Pour
  un site de PME avec quelques mises à jour par semaine, c'est largement
  suffisant.
- **Modifications en rafale** : si Thierry modifie 5 réalisations en
  quelques minutes, 5 builds vont se chaîner. Ce n'est pas un problème
  technique mais cela consomme du quota Vercel (et de l'énergie côté
  Supabase). Si ça devient problématique, deux pistes :
  1. Désactiver temporairement le webhook pendant une session de
     mise à jour intensive, puis le réactiver à la fin.
  2. Mettre un **cooldown de 5 min** via une **Edge Function Supabase**
     intermédiaire (le webhook tape l'Edge Function, qui debounce les
     appels avant de tirer le Deploy Hook). C'est plus propre mais
     overkill pour le besoin actuel.

## Variables d'env Vercel — rappel

Le rebuild ne fonctionnera correctement que si les variables suivantes
sont configurées sur Vercel (Production + Preview) :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Sans elles, `vite.config.ts` fait échouer le build avec un message
explicite (`[ssg] FATAL: Missing VITE_SUPABASE_URL...`).
