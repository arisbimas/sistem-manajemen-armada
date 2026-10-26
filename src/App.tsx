import { QueryClientProvider } from '@tanstack/react-query'
import { FleetPage } from '@/pages/fleet-page'
import queryClient from '@/lib/query-client'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FleetPage />
    </QueryClientProvider>
  )
}

export default App
