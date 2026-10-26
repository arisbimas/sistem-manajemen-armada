const BASE_URL = 'https://api-v3.mbta.com'
const API_KEY = import.meta.env.VITE_MBTA_API_KEY

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function fetchJson<T>(
  path: string,
  params: URLSearchParams,
  signal?: AbortSignal,
): Promise<T> {
  const headers = new Headers({ Accept: 'application/vnd.api+json' })

  if (API_KEY) {
    headers.set('x-api-key', API_KEY)
  }

  let response: Response

  try {
    response = await fetch(`${BASE_URL}${path}?${params.toString()}`, { headers, signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }

    throw new ApiError('Could not reach the MBTA API. Check your connection and try again.', 0)
  }

  if (!response.ok) {
    let message = `The MBTA API returned HTTP ${response.status}.`

    if (response.status === 429) {
      message = 'Rate limit reached. Please wait a moment and try again.'
    } else {
      try {
        const body = (await response.json()) as { errors?: Array<{ detail?: string }> }
        const detail = body.errors?.[0]?.detail

        if (detail) {
          message = detail
        }
      } catch {
        // 
      }
    }

    throw new ApiError(message, response.status)
  }

  return (await response.json()) as T
}
