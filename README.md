# Fleet Management System

A React and TypeScript frontend for monitoring the MBTA vehicle fleet. It fetches live vehicle
positions from the MBTA V3 API and presents them as a paginated card grid.

## Features

- Live vehicle data from the MBTA V3 API
- Vehicle cards with label, current status, latitude/longitude, and last update time
- Client-side pagination with range, page size, page count, and previous/next controls
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

The MBTA API uses JSON:API and does not expose a total count (`meta.total`). To paginate in the
browser, the app fetches the current revenue fleet in one snapshot:

```http
GET https://api-v3.mbta.com/vehicles
  ?filter[revenue]=REVENUE
  &fields[vehicle]=label,current_status,latitude,longitude,updated_at
  &page[limit]=1000
  &page[offset]=0
```

- `page[limit]=1000` covers the current revenue fleet, so the snapshot contains up to 1000 vehicles.
- `totalItems` is the snapshot length. Changing page or page size only slices the local array.
- TanStack Query handles fetching, caching, retries, and error state.
- 4xx and 429 responses are not retried; network and 5xx errors are retried once.
- Timestamps are displayed in the `America/New_York` timezone.

The card displays the raw `current_status` value from the API (`IN_TRANSIT_TO`, `STOPPED_AT`,
`INCOMING_AT`), so the operational state is not translated or inferred.

## Project structure

```
src/
  api/
    client.ts       Fetch wrapper, API key, error normalization
    vehicles.ts     Fleet snapshot request and UI mapping
  assets/
    fonts/          Overpass, latin subset
  components/
    fleet/          Vehicle card, grid, skeleton, pagination
    ui/             Error state
  hooks/
    use-vehicles.ts TanStack Query hook
  lib/
    format.ts       Coordinate and date formatting
    query-client.ts TanStack Query defaults
  pages/
    fleet-page.tsx  Page state and client-side pagination
  types/
    mbta.ts         JSON:API response types
    vehicle.ts      UI model
  App.tsx           Application shell
  index.css         Design tokens and base styles
  main.tsx          Application entry point
```

## Design system

Transit Blue palette: blue carries the system chrome; vehicle data stays neutral. Tokens live in
`src/index.css`:

- **Palette:** primary, primary-dark, primary-soft, paper, surface, ink, muted, rule, rule-strong, danger
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
