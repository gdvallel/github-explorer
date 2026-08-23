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
| 00 | [JavaScript, React & TypeScript basics](docs/lessons/00-javascript-react-typescript-basics.md) | functions, JSX, components, props, imports, types |
| 01 | [Project anatomy & file-based routing](docs/lessons/01-setup-and-project-anatomy.md) | file-based routing, route tree generation, router context |
| 02 | [Navigation & a second page](docs/lessons/02-navigation-and-a-second-page.md) | `Link`, index routes, adding a route |
| 03 | Search params | `validateSearch`, `useSearch`, type-safe URL state |
| 04 | Loaders & TanStack Query | `loader`, `ensureQueryData`, `useSuspenseQuery`, pending states |
| 05 | Dynamic routes & errors | path params, `errorComponent`, `notFound()` |
| 06 | Nested routes & pagination | nested route composition, hover preloading |
| 07 | Protected routes & auth guards | pathless layouts, router context, `beforeLoad`, `redirect()` |
| 08 | Mutations & optimistic UI | Query mutations, cache invalidation |
| 09 | Code splitting & performance | `autoCodeSplitting`, bundle inspection |
| 10 | Polish | global 404, root error boundary, scroll restoration |
| 11 | Testing routes *(bonus)* | Vitest + Testing Library |
| 12 | Deploy *(bonus)* | GitHub remote, hosting |

Lessons past 02 aren't written yet — they get added one at a time as you work through the
course.

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
