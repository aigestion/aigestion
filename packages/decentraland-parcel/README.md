# AIGestion Virtual Office (Decentraland)

This package contains the source code for the AIGestion Virtual Office in Decentraland.

## Features
- **Architecture**: Modern glass and neon office design.
- **Interactive**: Real-time stats dashboard connected to simulated backend.
- **Tech**: Built with Decentraland SDK 7 (TypeScript).

## Getting Started

### Prerequisites
- Node.js (v16+)
- Decentraland CLI (installed via `npm install -g decentraland`)

### Development
Run the local preview server:
```bash
npm start
```

### Build
Compile the project for production:
```bash
npm run build
```

### Deployment
To deploy to the Decentraland Catalyst servers (requires signing with a wallet):
```bash
npm run deploy
```

## Structure
- `src/architecture.ts`: Building 3D models.
- `src/interactables.ts`: Dashboard and interaction logic.
- `src/network.ts`: Data fetching service.
