# Team Inventory - Project Context

## Quick Reference

- **App URL:** https://team-inventory-603316736725.us-central1.run.app
- **GitHub:** https://github.com/KevinKnightMH/team-inventory
- **Stack:** React 19 + Vite + Tailwind + Cloud Run
- **Project:** mad-hack (GCP)
- **Region:** us-central1

## What This App Does

Team Inventory is an organizational management system that allows teams to:

1. **Manage Organizational Structure**
   - Pillars (strategic organizational units)
   - Teams within pillars
   - Team members with roles

2. **Track Personnel Workflows**
   - Onboarding queue for new hires
   - Offboarding process with role tracking
   - Member movement between teams

3. **Generate Reports**
   - Export data to CSV/JSON
   - View metrics and dashboards
   - Track open roles

4. **Authentication**
   - Google OAuth (primary)
   - Demo accounts (for testing)

## Key Features

- **Dashboard:** Overview metrics (pillar/team/member counts)
- **Pillar Management:** Create pillars, assign leadership
- **Team Management:** Organize teams under pillars
- **Member Directory:** Full CRUD with filtering
- **Onboarding/Offboarding:** Workflow management
- **Reports:** 6 different report types with CSV/JSON export
- **Admin:** User and role management (future)

## Tech Stack

### Frontend
- React 19 (functional components + hooks)
- React Router 7 (routing)
- Tailwind CSS 3 (styling)
- Lucide React (icons)
- @react-oauth/google (Google Sign-In)

### Build & Deploy
- Vite 7 (build tool)
- Docker (multi-stage build: Node + Nginx)
- Google Cloud Run (serverless containers)
- GitHub (version control)
- Cloud Build (optional CI/CD)

### State Management
- React Context API (global state)
- localStorage (data persistence)

## Data Architecture

### Current: Client-Side Storage

All data lives in browser localStorage:
```javascript
localStorage['team-inventory-data'] = {
  pillars: [...],
  teams: [...],
  members: [...],
  openRoles: [...]
}
```

**Relationships:**
- Pillar → Teams (one-to-many)
- Team → Members (one-to-many)
- Member → Team (many-to-one)
- Member → Pillar (denormalized for quick access)

### Future: Backend API

Planned migration to:
- PostgreSQL or Cloud Firestore
- REST/GraphQL API
- Server-side authentication
- Audit logging

## Environment Setup

### Local Development

```bash
# Required
VITE_GOOGLE_CLIENT_ID=629681983625-p6kqfjve8bfagkkardouvifgno7gc416.apps.googleusercontent.com

# Optional
VITE_APP_NAME=Team Inventory
VITE_APP_URL=http://localhost:5173
```

### Production (Cloud Run)

Environment variables baked into Docker image at build time via `--build-arg`.

## Authentication Flow

### Google OAuth
1. User clicks "Sign in with Google"
2. Google OAuth popup appears
3. User authorizes app
4. Callback receives JWT credential
5. JWT decoded to extract user profile
6. User object saved to localStorage
7. Redirect to dashboard

### Demo Accounts
- Hardcoded in `AuthContext.jsx`
- Password check (insecure, for demo only)
- 4 roles: admin, engineering_manager, product_manager, delivery_lead

## File Organization

```
src/
├── components/        # React components (organized by feature)
├── context/          # React Context providers
├── hooks/            # Custom hooks
├── services/         # Data layer (CRUD operations)
├── utils/            # Utilities (export, mock data)
├── App.jsx           # Routes & layout
└── main.jsx          # Entry point
```

**Component Structure:**
- Each feature has its own directory
- List view, Detail view, Form components
- Shared components in `Common/`

## Development Workflow

1. **Make changes locally** - `npm run dev`
2. **Test in browser** - http://localhost:5173
3. **Commit to git** - `git add . && git commit -m "..."`
4. **Push to GitHub** - `git push origin main`
5. **Build Docker image** - See deployment.md
6. **Deploy to Cloud Run** - See deployment.md

## Key Dependencies

```json
{
  "react": "^19.2.0",
  "react-router-dom": "^7.12.0",
  "@react-oauth/google": "^0.562.0",
  "lucide-react": "^0.562.0",
  "tailwindcss": "^3.4.19",
  "vite": "^7.2.4"
}
```

## Common Patterns

### Context Usage
```javascript
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';

const { user, logout } = useAuth();
const { members, addMember } = useData();
```

### Data Operations
```javascript
import * as dataService from './services/dataService';

const members = dataService.getAllMembers();
const member = dataService.getMemberById(id);
dataService.addMember(newMember);
dataService.updateMember(id, updates);
dataService.deleteMember(id);
```

### Routing
```javascript
// App.jsx
<Route path="/members" element={<MemberList />} />
<Route path="/members/:id" element={<MemberDetail />} />

// Navigation
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/members');
```

## Testing

- No automated tests currently
- Manual testing in browser
- Use demo accounts for different roles

## Browser Support

- Chrome/Edge (primary)
- Firefox
- Safari
- Requires JavaScript enabled
- Requires localStorage enabled

## Accessibility

- Semantic HTML
- Keyboard navigation
- ARIA labels (partial)
- Color contrast (Tailwind defaults)
- Screen reader support (basic)

## Performance

- Bundle size: ~350KB (gzipped: ~98KB)
- Build time: ~4 seconds
- Docker image: ~50MB
- Cloud Run cold start: ~2 seconds
- Warm response: <100ms

## Security Considerations

- OAuth tokens in localStorage (XSS risk)
- No CSRF protection (client-only app)
- Demo passwords in plaintext (demo only!)
- No input sanitization (trusted users only)
- HTTPS enforced on Cloud Run
- No rate limiting

## Monitoring & Debugging

### Cloud Run Logs
```bash
gcloud run logs read team-inventory --project mad-hack --region us-central1
```

### Browser Console
- Check localStorage: `localStorage['team-inventory-data']`
- Check auth: `localStorage['auth-user']`
- React DevTools for component inspection

### Common Issues
- "Permission denied" → Check GCP IAM roles
- OAuth not working → Check authorized origins
- Data not persisting → Check localStorage quota
- Build fails → Check Node version (20+)
