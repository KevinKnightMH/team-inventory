# Team Inventory - Claude Project Context

## Project Overview

Team Inventory is a React-based web application for managing organizational structure, including pillars, teams, members, onboarding/offboarding workflows, and reporting.

**Live App:** https://team-inventory-603316736725.us-central1.run.app
**Repository:** https://github.com/KevinKnightMH/team-inventory
**GCP Project:** mad-hack
**Region:** us-central1

## Tech Stack

- **Frontend:** React 19 + Vite 7
- **Styling:** Tailwind CSS 3
- **Routing:** React Router v7
- **Auth:** Google OAuth 2.0 (@react-oauth/google)
- **Icons:** Lucide React
- **State:** React Context API
- **Storage:** Browser localStorage (mock data)
- **Deployment:** Docker + Google Cloud Run
- **CI/CD:** GitHub + Cloud Build (optional)

## Environment Variables

### Required for Development

```bash
# .env
VITE_GOOGLE_CLIENT_ID=629681983625-p6kqfjve8bfagkkardouvifgno7gc416.apps.googleusercontent.com
VITE_APP_NAME=Team Inventory
VITE_APP_URL=http://localhost:5173
```

### Required for Production

Environment variables are baked into the Docker build via `ARG`:
- `VITE_GOOGLE_CLIENT_ID` - Set during `docker build --build-arg`

### OAuth Configuration

- **Project:** madhive-testing (OAuth client)
- **Client ID:** 629681983625-p6kqfjve8bfagkkardouvifgno7gc416.apps.googleusercontent.com
- **Authorized Origins:**
  - http://localhost:5173 (dev)
  - https://team-inventory-603316736725.us-central1.run.app (prod)

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### File Structure

```
src/
├── components/
│   ├── Admin/          # User & role management
│   ├── Auth/           # Login, Google OAuth
│   ├── Common/         # Shared components (Table, Modal, SearchFilter)
│   ├── Dashboard/      # Metrics overview
│   ├── Layout/         # Header, Sidebar, Layout wrapper
│   ├── Members/        # Member CRUD, movement tracking
│   ├── Offboarding/    # Offboarding workflow
│   ├── Onboarding/     # Onboarding workflow
│   ├── Pillars/        # Pillar management
│   ├── Reports/        # Reporting & CSV/JSON export
│   └── Teams/          # Team management
├── context/
│   ├── AuthContext.jsx     # Authentication state & Google OAuth
│   └── DataContext.jsx     # Global data state (pillars, teams, members)
├── hooks/
│   └── useLocalStorage.js  # Persist state to localStorage
├── services/
│   └── dataService.js      # Data CRUD operations
├── utils/
│   ├── exportUtils.js      # CSV/JSON export utilities
│   └── mockData.js         # Sample data initialization
├── App.jsx                 # Main app with routing
└── main.jsx                # Entry point with GoogleOAuthProvider
```

## Deployment Workflow

### Manual Deploy to Cloud Run

```bash
# 1. Build Docker image
docker build --platform linux/amd64 \
  --build-arg VITE_GOOGLE_CLIENT_ID=629681983625-p6kqfjve8bfagkkardouvifgno7gc416.apps.googleusercontent.com \
  -t gcr.io/mad-hack/team-inventory:latest .

# 2. Push to Google Container Registry
docker push gcr.io/mad-hack/team-inventory:latest

# 3. Deploy to Cloud Run
gcloud run deploy team-inventory \
  --image gcr.io/mad-hack/team-inventory:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --project mad-hack
```

### Automated Deploy (Cloud Build)

Cloud Build triggers can be configured to auto-deploy on push to `main`:
- Trigger: Push to `main` branch
- Config: `cloudbuild.yaml`
- Substitutions: `_GOOGLE_CLIENT_ID`

## Data Sources

### Current: localStorage (Mock Data)

All data is stored in browser localStorage:
- **Key:** `team-inventory-data`
- **Includes:** pillars, teams, members, openRoles

**Data Model:**

```javascript
{
  pillars: [
    {
      id: string,
      name: string,
      engineeringLeadId: string,
      productLeadId: string,
      deliveryLeadId: string,
      teams: string[]
    }
  ],
  teams: [
    {
      id: string,
      name: string,
      pillarId: string,
      engineeringManagerId: string,
      productManagerId: string,
      deliveryLeadId: string,
      members: string[]
    }
  ],
  members: [
    {
      id: string,
      name: string,
      email: string,
      role: 'engineering' | 'product' | 'design' | 'delivery' | 'other',
      teamId: string,
      pillarId: string,
      location: string,
      startDate: string,
      status: 'active' | 'onboarding' | 'offboarding'
    }
  ],
  openRoles: [
    {
      id: string,
      title: string,
      role: string,
      teamId: string,
      pillarId: string,
      description: string,
      status: 'open' | 'in-progress' | 'filled'
    }
  ]
}
```

### Future: Backend Integration

Placeholder for future backend:
- PostgreSQL or Firestore database
- REST or GraphQL API
- JWT-based authentication
- Audit logging

## Authentication

### Demo Accounts (Mock Auth)

| Email | Password | Role |
|-------|----------|------|
| admin@company.com | admin123 | Admin |
| engmgr@company.com | eng123 | Engineering Manager |
| pm@company.com | pm123 | Product Manager |
| delivery@company.com | del123 | Delivery Lead |

### Google OAuth

- New users automatically assigned "viewer" role
- User profile includes: id, email, name, picture
- Token stored in localStorage as `auth-user`

## Important Commands

### Development
```bash
npm run dev                 # Start dev server
npm run build               # Production build
npm run preview             # Preview production build
```

### Git
```bash
git push origin main        # Push to GitHub
```

### Cloud Run
```bash
gcloud run logs read team-inventory --project mad-hack --region us-central1
gcloud run services describe team-inventory --project mad-hack --region us-central1
```

### Docker
```bash
docker build --platform linux/amd64 --build-arg VITE_GOOGLE_CLIENT_ID=<client-id> -t gcr.io/mad-hack/team-inventory:latest .
docker push gcr.io/mad-hack/team-inventory:latest
```

## Code Style Guidelines

- **No emojis** in code/comments
- **Functional components** with hooks
- **Tailwind utility classes** for styling
- **Named exports** for components
- **PropTypes or TypeScript** (currently using JSX)
- **Keep components focused** - single responsibility
- **Minimal abstractions** - avoid over-engineering

## Common Tasks

### Adding a new feature
1. Create component in appropriate `src/components/` directory
2. Add route in `src/App.jsx` if needed
3. Update `DataContext` if new data operations required
4. Update mock data in `src/utils/mockData.js` if needed
5. Test locally with `npm run dev`
6. Commit and push to GitHub

### Updating environment variables
1. Update `.env` for local development
2. Update `.env.example` as template
3. Rebuild Docker image with new `--build-arg`
4. Redeploy to Cloud Run

### Adding dependencies
```bash
npm install <package>
npm run build  # Test build works
git add package.json package-lock.json
git commit -m "Add <package> dependency"
```

## Known Issues & Limitations

- No real backend - all data in localStorage
- No user role management UI (roles are hardcoded)
- No real-time collaboration
- No data persistence across browsers
- No audit logging
- OAuth token not refreshed (session expires after Google timeout)

## Future Enhancements

- Backend API with PostgreSQL/Firestore
- Real-time updates with WebSockets
- Advanced reporting with charts
- Export to Excel
- Email notifications
- Role-based permissions
- Audit logging
- Team member history tracking
