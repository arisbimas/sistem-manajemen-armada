# Fleet Management System

A React and TypeScript frontend for monitoring the MBTA vehicle fleet. It fetches live vehicle
positions from the MBTA V3 API and presents them as a paginated card grid.

## Features

- Live vehicle data from the MBTA V3 API
- Vehicle cards with label, current status, latitude/longitude, and last update time
- Multi-select route and trip filters with infinite-scroll dropdowns
- Server-side pagination with range, page size, page count, and previous/next
- Loading skeletons, error state with retry, and empty state
- Responsive grid: one column on mobile, up to four on wide screens
- API key support through the `x-api-key` header
- Accessible labels, visible focus states, and reduced-motion support

## Stack

- React 19
- TypeScript (strict)
- Vite 8
- Tailwind CSS 4
- TanStack Query 5
- Radix Popover
- Lucide icons

## Requirements

- Node.js 20.19+ (or 22.12+)

## Getting started

```bash
npm install
npm run dev
```

## Environment

Create `.env.local` and add an MBTA API key:

```bash
VITE_MBTA_API_KEY=your_key_here
```

The key is sent as `x-api-key`. Without a key, the MBTA API allows 20 requests per minute; the app
still works but can hit rate limits.

## How data works

The MBTA API uses JSON:API and does not expose a total count (`meta.total`). The vehicle list is
paginated on the server:

```http
GET https://api-v3.mbta.com/vehicles
  ?filter[revenue]=REVENUE
  &include=route,trip,stop
  &page[limit]=12
  &page[offset]=0
```

- The page request uses `page[limit]` and `page[offset]`, with route, trip, and stop included.
- Total vehicles come from a second lightweight request with `page[limit]=1` and
  `fields[vehicle]=label`. The total is the `page[offset]` of `links.last` plus one. If `links.last`
  is missing, the total falls back to the response length.
- The total request runs once per filter set, not on page or page-size changes.
- Page sizes are 12, 24, 48, 96; the default is 12.
- TanStack Query handles fetching, caching, retries, and error state.
- 4xx and 429 responses are not retried; network and 5xx errors are retried once.
- Timestamps are displayed in the `America/New_York` timezone.

### Filters

- Routes come from `/routes` in pages of 50 with infinite scroll.
- Trips come from `/trips` in pages of 50 with infinite scroll. The dropdown is enabled only after
  at least one route is selected and uses `filter[route]` plus today's service date in
  `America/New_York`.
- Changing the selected routes clears the selected trips and resets the trip list.
- The vehicle query uses only one filter source: `filter[trip]` when trips are selected, otherwise
  `filter[route]`. The MBTA API silently ignores `filter[route]` when `filter[trip]` is present.
- Filter changes reset the page to 1 and are debounced by 300 ms before the vehicle queries run.
- Trips are scheduled runs, so a selected trip can have no active vehicles; the grid shows an empty
  state in that case.

The card displays the raw `current_status` value from the API (`IN_TRANSIT_TO`, `STOPPED_AT`,
`INCOMING_AT`), so the operational state is not translated or inferred.

## Project structure

```
src/
  api/
    client.ts       Fetch wrapper, API key, error normalization
    lists.ts        Route and trip infinite-list requests
    vehicles.ts     Vehicle page and total requests
  assets/
    fonts/          Overpass, latin subset
  components/
    filters/        Multi-select, route bullet, vehicle filters
    fleet/          Vehicle card, grid, skeleton, pagination
    ui/             Error state
  hooks/
    use-debounced-value.ts
    use-infinite-routes.ts
    use-infinite-trips.ts
    use-vehicles.ts
  lib/
    format.ts       Coordinate and date formatting
    query-client.ts TanStack Query defaults
  pages/
    fleet-page.tsx  Page state, filters, and server-side pagination
  types/
    filters.ts      Route, trip, and filter models
    mbta.ts         JSON:API response types
    vehicle.ts      UI model
  App.tsx           Application shell
  index.css         Design tokens and base styles
  main.tsx          Application entry point
```

## Design system

Transit Blue palette: blue carries the system chrome; vehicle data stays neutral. Tokens live in
`src/index.css`:

- **Palette:** primary, primary-dark, primary-soft, paper, surface, ink, muted, rule, rule-strong
- **Type:** Overpass
- **Shape:** cards use 8px, controls 6px, overlays 12px

Base styles cover focus visibility, selection, scrollbars, and reduced motion.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check without emitting |
