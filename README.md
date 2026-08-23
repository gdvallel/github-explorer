# GitHub Explorer — a TanStack Router deep dive

A small, real app — search GitHub users and repos, browse profiles, star favorites — built
incrementally as a structured, self-taught course in [TanStack Router](https://tanstack.com/router)
and [TanStack Query](https://tanstack.com/query). Every lesson adds one router concept to the
app and ends with a hands-on exercise; the commit history in this repo *is* the learning log.

## How this repo works

- [`docs/lessons/`](docs/lessons) holds one markdown lesson per concept, in order. Each lesson
  explains the concept, shows how it applies to this app, then poses **your task**: a concrete
  feature to build yourself in `src/`.
- The app is a single project that grows lesson by lesson — there's no separate "solutions"
  branch or throwaway sandbox. What's in `src/` at any point is exactly what the lessons so far
  have covered.
- Progress is tracked by commits, one per completed exercise, using conventional commit
  messages (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).

## Syllabus

| # | Lesson | Concepts |
|---|--------|----------|
| 00 | [Setup & project anatomy](docs/lessons/00-setup-and-project-anatomy.md) | file-based routing, route tree generation, project structure |
| 01 | [Layouts & static routes](docs/lessons/01-layouts-and-static-routes.md) | `Link`, pathless layouts, index routes |
| 02 | [Search params](docs/lessons/02-search-params.md) | `validateSearch`, `useSearch`, type-safe URL state |
| 03 | [Loaders & TanStack Query](docs/lessons/03-loaders-and-tanstack-query.md) | `loader`, `ensureQueryData`, `useSuspenseQuery`, pending states |
| 04 | [Dynamic routes & errors](docs/lessons/04-dynamic-routes-and-errors.md) | path params, `errorComponent`, `notFound()` |
| 05 | [Nested routes & pagination](docs/lessons/05-nested-routes-and-pagination.md) | nested route composition, hover preloading |
| 06 | [Protected routes & auth guards](docs/lessons/06-protected-routes-and-auth-guards.md) | router context, `beforeLoad`, `redirect()` |
| 07 | [Mutations & optimistic UI](docs/lessons/07-mutations-and-optimistic-ui.md) | Query mutations, cache invalidation |
| 08 | [Code splitting & performance](docs/lessons/08-code-splitting-and-performance.md) | `autoCodeSplitting`, bundle inspection |
| 09 | [Polish](docs/lessons/09-polish-not-found-scroll-devtools.md) | global 404, root error boundary, scroll restoration |
| 10 | [Testing routes](docs/lessons/10-testing-routes.md) *(bonus)* | Vitest + Testing Library |
| 11 | [Deploy](docs/lessons/11-deploy.md) *(bonus)* | GitHub remote, hosting |

## Stack

- [TanStack Router](https://tanstack.com/router) — file-based routing, loaders, search params
- [TanStack Query](https://tanstack.com/query) — server-state caching, wired into router loaders
- React 19 + TypeScript, Vite, Tailwind CSS
- Data source: the public [GitHub REST API](https://docs.github.com/en/rest) (no auth required for reads)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build     # production build
npm run lint       # eslint
npm run format     # prettier --write + eslint --fix
npm run check       # prettier --check
```

## Project structure

```
docs/lessons/     lesson-by-lesson course material
src/routes/       file-based routes (grows lesson by lesson)
src/router.tsx    createRouter() + TanStack Query client, injected into router context
```
