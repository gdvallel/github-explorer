# 04 — Loaders & TanStack Query

This is the biggest jump so far — `/search` goes from showing back whatever you typed, to
actually calling the real GitHub API and showing real users. A few new fundamentals first.

## Concept: code that has to wait

Fetching something from the internet isn't instant — your computer has to send a request,
and wait for a server somewhere else to answer. JavaScript calls this kind of "wait for it,
then continue" code **asynchronous** (async, for short), as opposed to normal code that runs
one line after another with no waiting.

## Concept: a Promise is an IOU

When you ask JavaScript to fetch something, it doesn't hand you the data immediately — it
hands you a **Promise**: an object that basically says "I don't have your value yet, but I
promise to either deliver it, or tell you it failed, later." You can attach an "and once
you're done" step to it.

## Concept: `async` / `await`

Writing code with raw Promises gets clunky, so JavaScript has a shorthand: mark a function
`async`, and inside it you can write `await somePromise` — which reads almost like plain,
one-line-after-another code, but secretly pauses that function at that line until the Promise
finishes:

```js
async function getGitHubUser(username) {
  const response = await fetch(`https://api.github.com/users/${username}`)
  const data = await response.json()
  return data
}
```

`fetch(url)` is a function built into every browser — give it a URL, it makes an HTTP request
and gives you back a Promise for the response. `response.json()` reads the body of that
response as JSON (a text format for structured data — objects and arrays, basically) — that's
also async, hence the second `await`.

## Concept: what's a `loader`?

Without a loader, you'd fetch data *inside* the component, after it's already on screen —
meaning the page flashes empty (or shows a spinner) for a moment, then pops in content once
the fetch finishes. A **loader** is a function you attach to a route that runs *before* the
route's component is shown, so the data is already there (or already being fetched) the
moment the page appears.

```tsx
export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  loader: async ({ deps }) => {
    // fetch here, before the component ever renders
  },
  component: SearchPage,
})
```

## Concept: why bring TanStack Query into this at all?

A bare loader re-fetches every single time you land on the route. Say you search "torvalds,"
navigate away, then come back — a bare loader fetches "torvalds" from GitHub *again*, even
though you already had that exact answer seconds ago.

Remember the fridge analogy from Lesson 01: `queryClient` is where the app stores answers
it's already fetched, so it doesn't have to go ask again. TanStack Query is that fridge.
Instead of the loader calling `fetch` directly, it asks the fridge for the data — and the
fridge decides whether to hand over what it already has, or actually go fetch fresh data.

### `queryOptions` — describing what you want, once

```tsx
import { queryOptions } from '@tanstack/react-query'

const githubUsersQuery = (q: string) =>
  queryOptions({
    queryKey: ['github-users', q],
    queryFn: async () => {
      const response = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(q)}`,
      )
      if (!response.ok) throw new Error('GitHub search failed')
      const data = await response.json()
      return data.items as Array<{ id: number; login: string; avatar_url: string }>
    },
  })
```

- `queryKey: ['github-users', q]` — the fridge's label for this exact answer. Search "torvalds"
  and it's stored under a different label than search "linus" — so different searches never
  get mixed up, and the *same* search twice reuses the same label.
- `queryFn` — the actual async function that goes and fetches, only run when the fridge
  doesn't already have this label, or decides what it has is too old.

### Using it in the loader — `ensureQueryData`

```tsx
export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(githubUsersQuery(deps.q))
  },
  component: SearchPage,
})
```

`context.queryClient` — this is that same fridge we put into the router's shared bag back in
Lesson 01, now finally being used. `ensureQueryData(...)` means "make sure this label's data
exists in the fridge before moving on — fetch it now if it doesn't, otherwise do nothing."

`loaderDeps: ({ search }) => ({ q: search.q })` tells the router "re-run the loader whenever
`q` changes" — without this, changing the search text wouldn't trigger a new fetch, since the
route itself (`/search`) never changes, only its search params do.

### Reading it back in the component — `useSuspenseQuery`

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'

function SearchPage() {
  const { q } = Route.useSearch()
  const { data: users } = useSuspenseQuery(githubUsersQuery(q))

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.login}</li>
      ))}
    </ul>
  )
}
```

`useSuspenseQuery` reads from the exact same fridge label the loader already filled — it's
guaranteed to have data by the time this line runs (that's what "suspense" means here: React
holds off rendering this component at all until it's ready, instead of showing you a
half-built screen).

## Concept: showing something while you wait — `pendingComponent`

The very first time someone searches something brand new, there's no way around an actual
wait for the network. Show something during that wait instead of a blank screen:

```tsx
export const Route = createFileRoute('/search')({
  // ...
  pendingComponent: () => <p>Loading...</p>,
})
```

## A real-world catch: GitHub's rate limit

The GitHub API allows about 60 unauthenticated requests per hour, per IP address. Fine for
building and testing, but don't hammer it in a loop — if you see errors after a lot of rapid
searching, that's why (we'll handle that gracefully in Lesson 05).

## Your task

1. Add a `queryOptions`-based query for GitHub's user search (`api.github.com/search/users?q=`)
   in a new file, e.g. `src/api/github.ts`.
2. Wire it into `/search`'s `loader` with `ensureQueryData`, including `loaderDeps` for `q`.
3. In `SearchPage`, read the results with `useSuspenseQuery` and render a list — username is
   enough, add the avatar image (`user.avatar_url`) if you want it to look nicer.
4. Add a `pendingComponent`.

**Acceptance criteria:**
- Searching a real GitHub username (try `torvalds`) shows a real list of matching users.
- Searching the same term twice in a row (e.g. clear the field, type it again) is visibly
  instant the second time — that's the fridge/cache working.
- Reloading the page on `/search?q=torvalds` directly shows loading, then results — no crash.
- `npm run build` and `npm run lint` both pass.

## Committing

```bash
git add src/api/github.ts
git commit -m "feat: add GitHub users search query"

git add src/routes/search.tsx
git commit -m "feat: wire search route to GitHub API via loader + query"
```

Then move on to Lesson 05 (dynamic routes & errors) — ask me when you're ready and I'll write
it.
