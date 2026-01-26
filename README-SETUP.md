# AIGestion.net Development Environment Setup

## Quick Start

1. **Open VSCode Workspace**
   ```bash
   code aigestion-net.code-workspace
   ```

2. **Install Dependencies**
   ```bash
   npm run setup
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

## Project URLs

| Service | URL | Port |
|---------|-----|------|
| Main Website | http://localhost:5173 | 5173 |
| Admin Dashboard | http://localhost:5175 | 5175 |
| Client Dashboard | http://localhost:5174 | 5174 |
| Demo Dashboard | http://localhost:5176 | 5176 |
| Backend API | http://localhost:3000 | 3000 |

## IDE Configuration

### VSCode Extensions (Auto-installed)
- TypeScript & React Support
- Tailwind CSS
- ESLint & Prettier
- Google Cloud Tools
- Supabase Integration
- Docker Support
- Git Graph

### Windsurf Configuration
- Project configured for AIGestion.net
- All services mapped correctly
- Git integration ready
- Development environment optimized

## Git Configuration

```bash
git remote set-url origin https://github.com/aigestion/aigestion-net.git
git branch -M main
```

## Cloud Services

### Google Cloud
- Project: `aigestion-net`
- Region: `us-central1`
- Run: `gcloud app deploy`

### Supabase
- URL: `https://jhvtjyfmgncrrbzqpbkt.supabase.co`
- Auto-configured in all dashboards

## Audio Effects
All dashboards include wuaw audio effects:
- Hover sounds
- Click sounds
- Special wuaw effects
- Web Audio API implementation

## Development Scripts

```bash
# Start all services
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend

# Build for production
npm run build

# Deploy to cloud
npm run deploy

# Sync with GitHub
npm run git:sync

# Clean and reinstall
npm run clean
```

## File Structure

```
AIGestion.net/
├── frontend/
│   ├── apps/
│   │   ├── website-epic/     # Main site (5173)
│   │   ├── admindashboard/   # Admin (5175)
│   │   ├── clientdashboard/  # Client (5174)
│   │   └── demodashboard/    # Demo (5176)
│   └── shared/               # Shared components
├── backend/                  # Node.js API (3000)
├── .windsurf/               # Windsurf config
├── vscode/                  # VSCode extensions
└── aigestion-net.code-workspace  # Main workspace
```

## Environment Variables

All services are pre-configured with:
- Supabase credentials
- Google Cloud project settings
- Development URLs
- Audio effect configurations

## Next Steps

1. Open the workspace file in VSCode
2. Extensions will auto-install
3. Run `npm run dev` to start all services
4. Access dashboards at their respective URLs
5. All changes auto-sync to GitHub

The environment is fully configured for AIGestion.net development!
