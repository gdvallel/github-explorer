# 01 — Layouts & static routes

First real exercise. You're building the pieces yourself from here on — this repo won't hand
you finished route files anymore.

## Concept: `Link`

`@tanstack/react-router` ships a typed `Link` component instead of a plain `<a>`. It knows
about every route in your route tree, so `to="/some-typo"` is a *type error*, not a 404 you
discover at runtime. It also handles SPA navigation (no full page reload) and exposes
`activeProps` / `activeOptions` for styling the currently-active link.

```tsx
import { Link } from '@tanstack/react-router'

<Link to="/about" activeProps={{ className: 'font-bold' }}>
  About
</Link>
```

Docs: [Navigation](https://tanstack.com/router/latest/docs/framework/react/guide/navigation)

## Concept: index routes

`src/routes/index.tsx` matches the exact path `/`. You already have this one — it's the
`Home` component you saw in Lesson 00.

## Concept: pathless layouts

Every route already shares the layout in `__root.tsx` — but that's *global*, it wraps
literally everything including future auth/error pages you don't want a public nav on. A
**pathless layout route** lets you share a layout (like a header + nav) across a *subset* of
routes without adding a URL segment. The file is prefixed with an underscore, e.g. `_layout.tsx`,
and routes that should be wrapped by it are nested under it in the file tree.

This is the one piece of file-naming syntax in this lesson worth double-checking against the
docs yourself rather than trusting a paraphrase — conventions here have a directory form and a
dot-notation form, and getting it right by reading the source once is worth more than me
telling you. Read: [Routing Concepts → Layouts](https://tanstack.com/router/latest/docs/routing/routing-concepts#layout-routes)
before you start (or run `npx @tanstack/intent@latest load @tanstack/router-core#router-core`
for the primary-source reference AGENTS.md points at).

## In this app

Right now `/` renders `Home` directly under the root, and there's no navigation at all. By the
end of this lesson, `/` and `/about` should both render inside a shared header with working
navigation links.

## Your task

1. Add a new `/about` route. Content is up to you — a couple of sentences about what this
   project is (you're building the README's pitch into the app itself, not a bad habit).
2. Add a pathless layout that both `/` and `/about` render inside, containing:
   - A `<nav>` with `Link`s to Home and About.
   - The active link visually distinguished from the inactive one (`activeProps`).
3. Keep the root (`__root.tsx`) as it is — devtools only, no nav — the nav belongs in the new
   layout, not the root.

**Acceptance criteria:**
- `npm run dev` — visiting `/` and `/about` both show the same header/nav, only the page
  content below it changes.
- The nav link for whichever page you're on looks visibly different from the other link.
- `npm run build` succeeds with no errors.
- `npm run lint` passes.

## Hints (optional)

<details>
<summary>If you're stuck on the file layout</summary>

One valid shape: a file `src/routes/_layout.tsx` defining the nav + an `<Outlet />`, plus a
directory `src/routes/_layout/` containing `index.tsx` and `about.tsx` (moved out of the flat
`src/routes/` root). Regenerate the route tree with `npm run generate-routes` after moving
files around if `npm run dev` doesn't pick it up automatically. Verify against the docs link
above if the file tree in your editor doesn't match what you expected — this is the detail
worth confirming yourself.

</details>

## Committing

Once the acceptance criteria pass, commit it yourself:

```bash
git add -A
git commit -m "feat: add shared nav layout and about route"
```

Then move on to [Lesson 02](02-search-params.md).
