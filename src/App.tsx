import { QueryClientProvider } from '@tanstack/react-query'
import { FleetPage } from '@/pages/fleet-page'
import queryClient from '@/lib/query-client'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-dvh bg-paper">
        <div className="border-t-[3px] border-primary bg-surface">
          <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold tracking-[-0.02em]">Fleet Monitor</span>
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary">
                MBTA
              </span>
            </div>
          </header>
        </div>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <FleetPage />
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App
