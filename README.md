# rabi

A mobile-first web preview for Rabi, a navigation and mobility product being designed for Nigeria.

## Current stage

This repository contains the first interactive UI foundation, built with Next.js, React, and TypeScript. It is a **visual prototype**, not a live navigation service.

### Included
- Responsive home screen and Rabi brand direction
- Destination input with a small set of illustrative demo suggestions
- Interactive drive/walk presentation states
- Route preview artwork and clear demo-status messaging
- Accessible labels and reduced-motion support

### Not connected yet
- Device GPS and live location permissions
- Live map tiles, geocoding, routing, traffic, or turn-by-turn navigation
- Voice search
- Authentication, user profiles, ride booking, or backend APIs

No route times or map artwork should be treated as live navigation data.

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
