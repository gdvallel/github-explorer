# 00 — JavaScript, React & TypeScript basics (using this app's own code)

Before touching TanStack Router, you need the vocabulary underneath it: JavaScript, React,
and TypeScript. This lesson doesn't use made-up examples — every snippet below is copy-pasted
from a real file already sitting in this repo, so you're learning the exact code you'll be
working with, not a generic tutorial.

There's no exercise here. Just read, and open the real files in your editor as you go.

## What even happens when you open this app?

`index.html` is the actual page the browser loads first. Open it — it's tiny:

```html
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

That's it. An empty box (`<div id="app">`) and one line saying "go run this JavaScript file."
Everything you see on screen — every button, every page — gets built by JavaScript code and
stuffed into that empty box. `main.tsx` is where that code starts running.

## Functions: the basic building block

A function is a named chunk of code you can run whenever you want, instead of retyping it.

```js
function sayHi() {
  console.log('hi')
}
```

You "call" it by writing `sayHi()`. There's also a shorter way to write functions, called an
**arrow function** — same thing, different spelling:

```js
const sayHi = () => {
  console.log('hi')
}
```

You'll see both styles in this codebase. They behave the same for our purposes.

## Imports: borrowing code from other files

Look at the top of `src/main.tsx`:

```tsx
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { getRouter } from './router'
```

`import` means "I want to use something that was written somewhere else." Three of these
lines pull in code from packages installed in `node_modules` (react-dom, TanStack Router,
TanStack Query — other people's code you didn't write). The last one, `import { getRouter } from
'./router'`, pulls in a function from `src/router.tsx` — a file *you* have in this repo. The
`./` means "look in this same folder."

On the flip side, a file has to explicitly say "this part is okay for other files to
import" using the word `export`. Open `src/router.tsx` — see `export function getRouter()`?
That word is what makes `import { getRouter } from './router'` work elsewhere.

## JSX: writing what-looks-like-HTML inside JavaScript

Look at `src/routes/index.tsx`:

```tsx
function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
    </div>
  )
}
```

That `<div>...</div>` block inside a JavaScript function is **not HTML** — it only looks like
it. It's called **JSX**, a special syntax React understands that lets you describe "what
should appear on screen" using HTML-like tags, directly inside your JS code. A build tool
converts it into real instructions before it reaches the browser. Two things that trip people
up coming from real HTML: `className` instead of `class`, and every tag must be closed
(`<img />`, not `<img>`).

## Components: functions that describe a piece of screen

`Home` above is a **component** — in React, a component is just a function whose job is to
return JSX (a description of some UI). Nothing more mystical than that. You give it a name
starting with a capital letter (`Home`, not `home`) so React can tell it apart from a regular
HTML tag.

You use a component by writing it like a tag: `<Home />`. Look at `src/routes/__root.tsx`:

```tsx
function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackDevtools ... />
    </>
  )
}
```

`RootComponent` is a component that renders two other components inside it: `<Outlet />`
(provided by TanStack Router — it means "put whichever page matches the current URL right
here," more on that in Lesson 01) and `<TanStackDevtools />` (the debugging panel). The
`<>...</>` wrapping them is called a **fragment** — React requires you to return one single
thing from a component, and a fragment is an invisible wrapper for when you have two sibling
elements with no real container element you want to add.

## Props: passing information into a component

A **prop** is an input to a component — same idea as a function argument. Look at this piece
of `__root.tsx`:

```tsx
<TanStackDevtools
  config={{ position: 'bottom-right' }}
  plugins={[{ name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> }]}
/>
```

`config` and `plugins` are props being handed to `TanStackDevtools` — they're telling that
component "put yourself in the bottom-right corner" and "here's what to show inside
yourself." Any word written like `someName={...}` inside a JSX tag is a prop.

## TypeScript: labels that describe the shape of your data

This project is written in **TypeScript**, not plain JavaScript — files end in `.tsx`
instead of `.jsx`/`.js`. TypeScript adds one thing on top of JavaScript: you can write down
what *shape* a piece of data is supposed to have, and your editor will yell at you (before
you even run the code) if you get it wrong. Look at `src/router.tsx`:

```tsx
export interface RouterContext {
  queryClient: QueryClient
}
```

This says: "anything of type `RouterContext` must have a field called `queryClient`, and it
must be a `QueryClient`." It's a promise you're writing down for your future self, and for
any tool reading your code, about what a piece of data will always look like. You'll see this
kind of type-writing constantly in TanStack Router code — it's a big part of why the library
feels so safe to use once you're used to it: mistakes get caught while you're typing, not
after you click a broken link in the browser.

## What you now know

- A **function** is reusable code; an **arrow function** is a shorter way to write one.
- `import`/`export` is how files share code with each other.
- **JSX** lets you write HTML-looking markup inside JavaScript; it compiles to real
  instructions before the browser sees it.
- A **component** is a function that returns JSX — a description of some UI.
- A **prop** is an input you pass into a component, same idea as a function argument.
- **TypeScript** lets you write down the expected shape of your data so mistakes are caught
  early.

That's enough to start reading TanStack Router code without every third word being a
mystery. Next: [Lesson 01 — Project anatomy & file-based routing](01-setup-and-project-anatomy.md).
