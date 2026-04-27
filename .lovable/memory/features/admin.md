---
name: Admin CMS
description: Full admin backoffice with auth, roles, blog and realisations management
type: feature
---

## Auth
- Email/password via Supabase Auth (`useAuth` hook in `src/hooks/useAuth.tsx`)
- `ProtectedRoute` component guards `/admin/*` routes
- First signup auto-promoted to admin via `bootstrap_first_admin` trigger
- Roles: `admin` (full access including user mgmt), `editor` (CRUD content), `user` (none)
- `has_role()` and `is_admin_or_editor()` security definer functions for RLS

## Routes
- `/admin/login` — Sign in / sign up
- `/admin` — Dashboard with stats
- `/admin/articles` + `/admin/articles/:id` — Blog CRUD with Tiptap WYSIWYG
- `/admin/realisations` + `/admin/realisations/:id` — Project CRUD with photo gallery
- `/admin/users` — Role management (admin only)

## Photo gallery
- Multi-upload to `media` bucket, organized in folders (`articles/`, `covers/`, `realisations/`)
- Star icon = favorite (single per realisation, enforced by `enforce_single_favorite` trigger)
- Drag handle = reorder via @dnd-kit, persists `display_order`
- Inline caption editing, saved on blur

## Public site integration
- Public Blog and Realisations pages should fetch from DB when records exist
- Status filter: `WHERE status = 'published'` (RLS enforces it for anon)

## Stack
- Tiptap editor: @tiptap/react, starter-kit, link, image
- Drag & drop: @dnd-kit/core, @dnd-kit/sortable
- Validation: zod schemas on every form
