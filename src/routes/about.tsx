import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About
});

function About() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">About</h1>
      <p className="mt-4 text-lg">
        This is a small project for learning TanStack Router.
      </p>
    </div>
  )
}
