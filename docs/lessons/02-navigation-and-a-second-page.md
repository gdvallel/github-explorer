# 02 — Navigation & a second page

Your first hands-on exercise. Small on purpose: one new page, one working link. You're
building the file yourself from here on — this repo won't hand you finished route files
anymore.

## Concept: adding a route is just... adding a file

You already know `src/routes/index.tsx` matches `/` (Lesson 01). To create a new page at
`/about`, you don't need to register it anywhere or configure a list of routes — you just
create a new file: `src/routes/about.tsx`. The `@tanstack/router-plugin` we talked about in
Lesson 01 notices the new file and automatically adds `/about` to the generated route list.
That's the whole trick behind file-based routing.

Every route file needs to export something called `Route`, built with `createFileRoute`.
Copy the shape from `index.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return <div>...</div>
}
```

`createFileRoute('/')` — the string here has to match the file's own path. For a new file at
`src/routes/about.tsx`, the matching call is `createFileRoute('/about')`.

## Concept: `Link`, a smarter `<a>` tag

To navigate between pages without a full page reload, TanStack Router gives you a `Link`
component instead of a plain HTML `<a>`:

```tsx
import { Link } from '@tanstack/react-router'

<Link to="/about">About</Link>
```

It behaves like a normal link visually, but two things are different under the hood:
1. Clicking it swaps the page instantly, without the browser doing a full reload.
2. `to="/about"` is checked against your *actual* routes. If you typo it as `to="/abuot"`,
   your editor flags it as an error immediately — you find out while typing, not by clicking
   a broken link later.

You can also make the link *look* different when you're currently on that page, using
`activeProps` — a prop that says "extra styling to apply only while this link's page is the
current one":

```tsx
<Link to="/about" activeProps={{ className: 'font-bold' }}>
  About
</Link>
```

Docs: [Navigation](https://tanstack.com/router/latest/docs/framework/react/guide/navigation)

## In this app

Right now there's exactly one page (`/`) and nothing links anywhere. By the end of this
lesson there'll be two pages, and a small nav bar in the root layout (`__root.tsx`) letting
you click between them.

*(Later, once we add pages that need a different look — like a login screen — we'll learn how
to give only *some* pages a shared layout instead of putting everything in the root. Not yet;
right now everything sharing one simple layout is exactly right.)*

## Your task

1. Create `src/routes/about.tsx` — a new page with a couple of sentences about what this
   project is (you're basically typing the README's pitch into the app itself).
2. In `src/routes/__root.tsx`, add a small `<nav>` above `<Outlet />` with two `Link`s: Home
   and About.
3. Make the active page's link look visually different from the inactive one, using
   `activeProps`.

**Acceptance criteria:**
- `npm run dev` — visiting `/` and `/about` both show the same nav bar, only the content
  below it changes.
- Clicking a nav link changes the page without the browser doing a full reload (you can tell
  because there's no white-flash reload).
- The link for whichever page you're currently on looks visibly different from the other one.
- `npm run build` succeeds with no errors.
- `npm run lint` passes.

## Committing

Once the acceptance criteria pass, commit it yourself. Since it's really two small changes,
feel free to split it into two commits instead of one big one:

```bash
git add src/routes/about.tsx
git commit -m "feat: add about page"

git add src/routes/__root.tsx
git commit -m "feat: add nav bar with home/about links"
```

Then move on to [Lesson 03 — Search params](03-search-params.md).
