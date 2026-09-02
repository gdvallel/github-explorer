import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod';

const schema = z.object({
  q: z.string().optional().default("")
})

export const Route = createFileRoute('/search')({
  component: RouteComponent,
  validateSearch: schema
})

function RouteComponent() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();

  return <div className='flex flex-col gap-2 mt-2.5'>
    <input type="text" value={q} className='border-2 border-green-950' onChange={(e) => navigate({
      search: {
        q: e.target.value
      }
    })} />

    <p>Searching for: {q}</p>
  </div>
}
