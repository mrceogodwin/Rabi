# rabi

A mobile-first web preview for Rabi, a navigation and mobility product being designed for Nigeria.

## Current stage

This repository contains the first interactive UI foundation, built with Next.js, React, and TypeScript. It is a **visual prototype**, not a live navigation service.

### Included
- Responsive home screen and Rabi brand direction
- Interactive OpenStreetMap tiles powered by Leaflet
- Destination geocoding via OpenStreetMap Nominatim
- Optional browser GPS and driving route geometry via the public OSRM demo endpoint
- Drive/walk presentation states, saved places, and locally persisted journey previews
- Ride request preview with explicit demo-only messaging

### Not connected yet
- Turn-by-turn navigation, live traffic, guaranteed routing availability, or offline maps
- Voice search
- Authentication, account sync, verified drivers, live ride booking, payment, or a production ride backend

Map tiles, geocoding, and routing require an internet connection and use public community/demo services. Route estimates can be incomplete and must not be treated as safety-critical navigation instructions.

## Run locally

Requirements: Node.js 18.17 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

For a production build:

```bash
npm run build
npm start
```

## Next implementation steps
1. Confirm this UI builds and deploys through Vercel.
2. Evaluate map and routing providers for Nigerian coverage and pricing.
3. Add a real map, location permissions, geocoding, and route calculations.
4. Add backend services only after the navigation foundation is verified.
