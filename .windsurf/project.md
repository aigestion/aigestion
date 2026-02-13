# AIGestion.net - Windsurf Configuration

## Project Structure

- **Root**: c:\Users\Alejandro\AIGestion
- **Frontend**: c:\Users\Alejandro\AIGestion\frontend
- **Backend**: c:\Users\Alejandro\AIGestion\backend

## Development URLs

- **Main Website**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5175
- **Client Dashboard**: http://localhost:5174
- **Demo Dashboard**: http://localhost:5176
- **Backend API**: http://localhost:3000

## Environment Configuration

- **Project**: aigestion-net
- **Google Cloud Project**: aigestion-net
- **Region**: us-central1
- **Supabase URL**: https://jhvtjyfmgncrrbzqpbkt.supabase.co

## Git Configuration

- **Repository**: https://github.com/aigestion/aigestion-net.git
- **Main Branch**: main
- **Remote**: origin

## Build & Deploy Commands

```bash
# Start all services
cd frontend && npm run dev:all

# Start backend
cd backend && npm run dev

# Build all frontend
cd frontend && npm run build:all

# Deploy to production
npm run deploy:production
```

## Key Features

- TypeScript + React + Node.js
- Monorepo structure with workspaces
- Multiple dashboards (Admin, Client, Demo)
- Supabase integration
- Google Cloud deployment
- Audio effects with Web Audio API
- Real-time updates

## Development Notes

- All dashboards have audio wuaw effects enabled
- Mock components used to avoid @shared dependencies
- Each dashboard runs on different port
- Hot reload enabled for development
