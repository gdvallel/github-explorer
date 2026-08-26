# 01 — Project anatomy & file-based routing

No exercise in this one either — you're still getting oriented. By the end you should know
what every file in `src/` is for, and how this whole project came to exist in the first place.

## Before routing: how did this project even get created?

You didn't type any of this from scratch — I ran one command and it built the whole skeleton
you're looking at right now. "How do I even set this up myself" is a completely fair thing to
feel lost on, so let's slow down on that before going further.

### npm and packages

**npm** (Node Package Manager) is a tool that comes bundled with Node.js. Its job: download
code that other people already wrote — called a **package** — onto your computer, so you can
use it instead of writing it yourself. TanStack Router is a package: someone else wrote it,
tested it, and published it online; your project just downloads it.

Every project has a file called `package.json` — open it, right at the project root. Look
under `"dependencies"`:

```json
"dependencies": {
  "@tanstack/react-router": "...",
  "react": "...",
  ...
}
```

That's the project's shopping list — "these are the packages this app needs to run." When you
run `npm install`, npm reads that list and downloads every package on it into a folder called
`node_modules`. That folder is huge, fully auto-generated, and you never open or edit it by
hand (check `.gitignore` — it's already excluded from git, because it's rebuildable and would
be enormous to store). Every `import { ... } from '@tanstack/react-router'` line you write is
reaching into that folder.

### The actual command that built this project

I created this project by running one command inside an empty folder:

```bash
npx @tanstack/cli create github-explorer --framework react --router-only --toolchain eslint
```

Piece by piece:
- `npx @tanstack/cli create` — "run TanStack's own project-creator tool."
- `github-explorer` — the name of the project.
- `--framework react` — build it for React (the tool also supports other frameworks, we don't
  want those).
- `--router-only` — "I want TanStack Router by itself, not TanStack's full server framework
  (TanStack Start)." This flag matters a lot: leave it off, and the tool assumes you want a
  full backend server too, which isn't what this course is about.
- `--toolchain eslint` — also set up ESLint, a tool that flags common code mistakes as you
  type.

That one command downloaded every package, generated the starter files (`main.tsx`,
`router.tsx`, `vite.config.ts`, everything), and ran `npm install` automatically. You don't
need to repeat this — it already happened, once, for this repo. It's worth knowing, though,
because if you ever start a brand-new project of your own later, this is the real command
you'd reach for.

### `npm run generate-routes` — building the route list yourself

Still in `package.json`, look at `"scripts"`:

```json
"scripts": {
  "dev": "vite dev --port 3000",
  "generate-routes": "tsr generate",
  ...
}
```

Normally you'll never run `generate-routes` by hand — `npm run dev` already watches your
`src/routes/` folder and regenerates `routeTree.gen.ts` automatically every time you save a
new route file. But if that ever seems out of sync (you added a route and it's just not
showing up when you visit the URL), running `npm run generate-routes` forces it to happen
once, immediately, so you can rule that out.

## What is "routing", really?

When you visit `github.com/torvalds`, you're not loading a whole new app — you're telling
GitHub "show me the page for user torvalds." **Routing** is the system that looks at the
current URL (what's in the address bar) and decides which piece of UI to show. TanStack
Router is a library that does this for us in React apps.

## Two ways to define routes — and which one this app uses

You could write out every route by hand in one big JavaScript file. TanStack Router calls
that "code-based routing." Instead, this app uses **file-based routing**: you create a file
inside `src/routes/`, and the *file's name and location* automatically becomes a URL. No
manual wiring. This is the [officially recommended default](https://tanstack.com/router/latest/docs/routing/file-based-routing)
for most projects, and it's simpler to reason about once you know the naming rules below.

## The tool doing this automatically

A piece of the build setup called `@tanstack/router-plugin` watches your `src/routes/`
folder. Every time you add, rename, or delete a route file, it regenerates
`src/routeTree.gen.ts` — a file that lists every route your app has, in a format React
Router can read fast. You can see it wired into `vite.config.ts`:

```ts
tanstackRouter({ target: 'react', autoCodeSplitting: true })
```

**Never edit `src/routeTree.gen.ts` by hand.** It says so at the top of the file — it gets
regenerated automatically, so any manual edit just gets thrown away. (More on
`autoCodeSplitting` in a later lesson — for now, just know it's a performance feature, not
something you need to touch.)

## The naming rules (you'll use these starting next lesson)

| File name | What it becomes |
|---|---|
| `__root.tsx` | the outer wrapper for every single page — like a picture frame everything sits inside |
| `index.tsx` | matches the exact path `/` — your homepage |
| `$param.tsx` | a placeholder in the URL, e.g. `$username.tsx` matches `/anything-here` |
| `_layout.tsx` | a shared wrapper for *some* pages (not all), with no URL of its own |
| `posts.$postId.tsx` | dot-separated name = a nested route, e.g. `/posts/123` |

## Walking through the files you already have

```
src/
├── main.tsx           # the very first code that runs (see Lesson 00)
├── router.tsx          # builds the router object itself
├── routeTree.gen.ts     # auto-generated list of routes — never edit
├── styles.css
└── routes/
    ├── __root.tsx       # the outer frame: shows devtools, and <Outlet /> for the current page
    └── index.tsx         # the "/" homepage
```

`<Outlet />`, which you saw in `__root.tsx` in Lesson 00, is the actual "put the current page
here" placeholder — it's how the outer frame and the specific page you're viewing get
combined into one screen.

## `router.tsx`, piece by piece

```tsx
export interface RouterContext {
  queryClient: QueryClient
}

export function getRouter() {
  const queryClient = new QueryClient()
  const router = createTanStackRouter({
    routeTree,
    context: { queryClient } satisfies RouterContext,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })
  return router
}
```

- `createTanStackRouter({ routeTree, ... })` — this is the actual function that builds the
  router, using that auto-generated list of routes.
- `context: { queryClient }` — **context** here just means "a shared bag of stuff every page
  is allowed to reach into." We're putting one specific thing in that bag: a `queryClient`.
  That object (from TanStack Query, a different library working alongside the router) is
  where the app will store data it fetches from the internet, so it doesn't have to
  re-fetch the same thing over and over — think of it as the app's fridge. Because we put it
  in the shared bag, *any* page can reach in and use that same fridge instead of each page
  getting its own separate one. You'll actually use this starting in Lesson 03.
- `defaultPreloadStaleTime: 0` — a setting that says "let the fridge (TanStack Query) be the
  one deciding when data is stale, don't have the router *also* try to manage freshness" —
  needed because we're using both libraries together.

## Devtools

Run `npm run dev`, look at the bottom-right corner of the page: there's a small panel you can
open. That's `TanStackDevtools`, wired up in `__root.tsx`. It shows you, live, which route is
currently active and what's happening with data fetching. Open it now, just to see it exists
— you'll lean on it a lot once there's more than one page.

## Your task

None — just run `npm run dev`, open the devtools panel once, and look at the actual files in
your editor while you read this. When you're ready: [Lesson 02 — Navigation & a second page](02-navigation-and-a-second-page.md).
