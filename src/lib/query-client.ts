import { ApiError } from "@/api/client"
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
                if (error instanceof ApiError) {
                    if (error.status === 429) {
                        return false
                    }

                    if (error.status >= 400 && error.status < 500) {
                        return false
                    }
                }

                return failureCount < 1
            },
        },
    },
})

export default queryClient