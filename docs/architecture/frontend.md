# Frontend Architecture

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query (`@tanstack/react-query`)

## Monorepo Structure
The frontend is structured as a generic monorepo with multiple apps in `apps/`.
- **`apps/dashboard`**: The main dashboard application (Nexus V1).
- `apps/landingpage`, `apps/website`, etc.: Landing pages and marketing sites.

## Key Libraries (Dashboard)
- **Routing**: `react-router-dom`
- **Charts**: `recharts`
- **Virtualization**: `react-window`, `@tanstack/react-virtual`
- **Icons**: Lucide React, Tabler Icons
- **Monitoring**: Sentry
- **HTTP Client**: Axios

## Development
- **Dev Server**: `vite`
- **Build**: `tsc -b && vite build`
- **Linting**: ESLint + Prettier
