# 00 — Setup & project anatomy

This lesson is different from the rest: there's no exercise. It documents what's already been
scaffolded for you, so you understand every file before you start changing them in Lesson 01.

## Concept: file-based routing

TanStack Router can be configured two ways: **code-based** (you call `createRoute()` and wire
a tree together by hand) or **file-based** (you drop files in `src/routes/`, and a build-time
plugin generates the route tree for you). File-based is the [officially recommended default](https://tanstack.com/router/latest/docs/routing/file-based-routing)
for most projects, and it's what this app uses.

The plugin doing the work is `@tanstack/router-plugin`, wired into `vite.config.ts`:

```ts
tanstackRouter({ target: 'react', autoCodeSplitting: true })
```

Every time you add, rename, or delete a file in `src/routes/`, this plugin regenerates
`src/routeTree.gen.ts` — **never edit that file by hand**, it's a build artifact (that's why
it's fine to commit it, but you should never touch it directly). `autoCodeSplitting: true`
means each route's component is automatically split into its own JS chunk without you writing
any `.lazy.tsx` files — more on that in Lesson 08.

## File-naming conventions (reference — you'll use these starting Lesson 01)

| Pattern | Meaning |
|---|---|
| `__root.tsx` | the root layout, wraps every route |
| `index.tsx` | exact match, e.g. `routes/index.tsx` → `/` |
| `$param.tsx` | dynamic segment, e.g. `$username.tsx` → `/:username` |
| `_layout.tsx` | pathless layout — wraps children, adds no URL segment |
| `(group)/` | pathless route *group* — organizational only, invisible in the URL |
| `posts.$postId.tsx` | dot notation — flat file that nests under `/posts/:postId` |

## In this app: what's already here

```
src/
├── main.tsx           # entry point: creates the router + QueryClient, mounts React
├── router.tsx          # getRouter(): createRouter() wired with a TanStack Query client
├── routeTree.gen.ts     # generated — do not edit
├── styles.css
└── routes/
    ├── __root.tsx       # root layout: renders <Outlet /> + Router/Query devtools
    └── index.tsx         # the "/" route
```

Two things worth noticing in `router.tsx`:

```tsx
export interface RouterContext {
  queryClient: QueryClient
}

export function getRouter() {
  const queryClient = new QueryClient()
  const router = createTanStackRouter({
    routeTree,
    context: { queryClient } satisfies RouterContext,
    // ...
  })
  return router
}
```

This is the standard pattern for combining TanStack Router with TanStack Query: a
`QueryClient` is created once and injected into the router's **context**. Every route's
`loader` gets access to it (`({ context }) => context.queryClient`), which is how Lesson 03
will fetch data through Query's cache instead of a bare `fetch()`. `__root.tsx` declares the
context's type via `createRootRouteWithContext<RouterContext>()` so that access is fully
typed everywhere, with no casting.

`defaultPreloadStaleTime: 0` on the router tells Router to delegate all caching decisions to
Query instead of using its own preload cache — necessary when the two are combined, otherwise
they'd fight over staleness.

## Devtools

Run `npm run dev` and look at the bottom-right corner: a `TanStackDevtools` shell hosts both
the Router devtools panel and the Query devtools panel side by side (wired in `__root.tsx`).
Open it now and click around — you'll use it constantly once loaders and queries show up.

## AGENTS.md

The scaffolder also generated `AGENTS.md` at the repo root. It's not a lesson file, but it's a
genuinely useful index: it lists TanStack's own topic-by-topic reference skills (search params,
auth guards, code splitting, etc.), each loadable on demand with
`npx @tanstack/intent@latest load <id>`. Worth knowing it's there if you want the primary-source
detail behind any lesson topic.

## Your task

None — just read through the files above and open the devtools once with `npm run dev`. When
you're ready, move on to [Lesson 01](01-layouts-and-static-routes.md).
