# 03 — Search params

A quick note before this one: I noticed `/about` exists but `__root.tsx` still doesn't have
the nav bar from Lesson 02's task. No rush — finish that whenever, it won't block this
lesson, they don't depend on each other.

## Concept: what's a "search param," in plain terms?

Look at a URL like this: `github.com/search?q=torvalds&type=users`. Everything after the `?`
is called the **search string** (also "query string"). Each `key=value` pair separated by `&`
is a **search param**. It's a way of storing small bits of state — like "what did the user
search for" — directly in the URL, instead of hidden inside the app's memory.

Why bother? Because anything in the URL is shareable, bookmarkable, and survives a page
refresh. If your search term only lived in a React variable, refreshing the page would wipe
it out. Put it in the URL instead, and refreshing (or sending the link to someone else) keeps
the exact same search.

## Concept: `validateSearch` — trusting the URL, but checking first

Anyone can type anything into a URL by hand — `?q=hello`, `?q=` (empty), or no `q` at all.
Before your component uses `q`, TanStack Router lets you run it through a checker called
`validateSearch`, so your component only ever sees search params in the shape you promised
yourself in TypeScript (remember "labels that describe the shape of your data," Lesson 00).

We'll use a small library called **Zod** to write that checker — it's the standard tool for
this in the TanStack Router world. Install it:

```bash
npm install zod
```

Then, in a route file:

```tsx
import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'

const searchSchema = z.object({
  q: z.string().optional().default(''),
})

export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  component: SearchPage,
})
```

Read `z.object({ q: z.string().optional().default('') })` out loud almost like English: "the
search params are an object with a field `q`, which must be a string, is allowed to be
missing, and defaults to an empty string if it is." If someone visits `/search` with no `q` at
all, your component gets `q: ''` instead of `undefined` — one less case to check for by hand.

## Concept: reading the current search params — `Route.useSearch()`

Inside `SearchPage`, you read the validated params with a hook attached to the `Route` object
you just made:

```tsx
function SearchPage() {
  const { q } = Route.useSearch()
  // `q` is typed as `string` here — TypeScript knows it, because of the schema above
  return <div>You searched for: {q}</div>
}
```

## Concept: updating the URL when the user types — `Route.useNavigate()`

To change the URL (and therefore `q`) when the user types in a text box, you call `navigate`
with a `search` object:

```tsx
function SearchPage() {
  const { q } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <input
      value={q}
      onChange={(e) => navigate({ search: { q: e.target.value } })}
    />
  )
}
```

Every keystroke calls `navigate`, which changes the URL to `/search?q=whatever-you-typed`,
which re-runs `validateSearch`, which gives your component the new `q` back through
`Route.useSearch()`. The URL is the single source of truth for what's been searched — the
input box is just showing you what's currently in it.

## Your task

1. Create a `/search` route with:
   - A `validateSearch` schema (Zod) with one field, `q`, a string that defaults to `''`.
   - A text input, synced to `q` in the URL as shown above.
2. Add a "Search" link to the nav bar (the one from Lesson 02) pointing at `/search`.
3. Below the input, just render the current value back out — something like
   `<p>Searching for: {q}</p>`. We're not calling any API yet — that's next lesson.

**Acceptance criteria:**
- Typing in the input updates the URL bar live (`/search?q=abc` as you type `abc`).
- Manually editing the URL to `/search?q=hello` and hitting enter shows "hello" back in the
  input and in the text below it.
- Visiting `/search` with no `?q=` at all doesn't crash — the input just starts empty.
- `npm run build` and `npm run lint` both pass.

## Committing

```bash
git add package.json
git commit -m "chore: add zod"

git add src/routes/search.tsx
git commit -m "feat: add search route with URL-synced query param"
```

Then move on to Lesson 04 — Loaders & TanStack Query, where `/search` starts actually
fetching real GitHub users.
