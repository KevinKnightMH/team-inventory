# Data Sources & Storage

## Current Data Storage: localStorage

### Overview

All application data is stored in browser localStorage. This is a **client-side only** solution suitable for prototyping and demos.

**Storage Key:** `team-inventory-data`

### Data Structure

```javascript
{
  "pillars": [
    {
      "id": "string (uuid)",
      "name": "string",
      "engineeringLeadId": "string (member id)",
      "productLeadId": "string (member id)",
      "deliveryLeadId": "string (member id)",
      "teams": ["team-id-1", "team-id-2"]
    }
  ],
  "teams": [
    {
      "id": "string (uuid)",
      "name": "string",
      "pillarId": "string (pillar id)",
      "engineeringManagerId": "string (member id)",
      "productManagerId": "string (member id)",
      "deliveryLeadId": "string (member id)",
      "members": ["member-id-1", "member-id-2"]
    }
  ],
  "members": [
    {
      "id": "string (uuid)",
      "name": "string",
      "email": "string",
      "role": "engineering" | "product" | "design" | "delivery" | "other",
      "teamId": "string (team id)",
      "pillarId": "string (pillar id)",
      "location": "string",
      "startDate": "YYYY-MM-DD",
      "status": "active" | "onboarding" | "offboarding"
    }
  ],
  "openRoles": [
    {
      "id": "string (uuid)",
      "title": "string",
      "role": "engineering" | "product" | "design" | "delivery" | "other",
      "teamId": "string (team id)",
      "pillarId": "string (pillar id)",
      "description": "string",
      "status": "open" | "in-progress" | "filled"
    }
  ]
}
```

### Relationships

```
Pillar (1) ──< (M) Team
Team (1) ──< (M) Member
Member (M) >── (1) Team
Member (M) >── (1) Pillar  // denormalized for quick access
Team (1) ──< (M) OpenRole
Pillar (1) ──< (M) OpenRole
```

### CRUD Operations

Implemented in `src/services/dataService.js`:

**Create:**
- `addPillar(pillar)`
- `addTeam(team)`
- `addMember(member)`
- `addOpenRole(role)`

**Read:**
- `getAllPillars()`
- `getPillarById(id)`
- `getAllTeams()`
- `getTeamById(id)`
- `getTeamsByPillarId(pillarId)`
- `getAllMembers()`
- `getMemberById(id)`
- `getMembersByTeamId(teamId)`
- `getMembersByPillarId(pillarId)`
- `getAllOpenRoles()`
- `getOpenRoleById(id)`

**Update:**
- `updatePillar(id, updates)`
- `updateTeam(id, updates)`
- `updateMember(id, updates)`
- `updateOpenRole(id, updates)`

**Delete:**
- `deletePillar(id)`
- `deleteTeam(id)`
- `deleteMember(id)`
- `deleteOpenRole(id)`

### Initialization

On first load, `src/utils/mockData.js` provides sample data:
- 3 Pillars (Platform Engineering, Customer Experience, Data & Analytics)
- 5 Teams
- 24+ Members (various statuses)
- 4 Open Roles

### Data Persistence

**Hook:** `src/hooks/useLocalStorage.js`

```javascript
const [data, setData] = useLocalStorage('team-inventory-data', initialData);
```

Automatically:
- Loads from localStorage on mount
- Saves to localStorage on state change
- JSON serialization/deserialization

### Limitations

- **5-10MB storage limit** (browser dependent)
- **No sync across devices**
- **No concurrent user support**
- **Cleared when user clears browser data**
- **No backup/recovery**
- **No audit trail**
- **No access control**

### Browser Support

- Chrome/Edge: 10MB
- Firefox: 10MB
- Safari: 5MB
- Mobile browsers: varies

## Authentication Storage

**Key:** `auth-user`

```javascript
{
  "id": "string",
  "email": "string",
  "name": "string",
  "picture": "string (URL)", // Google OAuth only
  "role": "admin" | "engineering_manager" | "product_manager" | "delivery_lead" | "viewer",
  "authProvider": "google" | undefined  // undefined for demo accounts
}
```

## Data Export

Users can export data via Reports page:

**CSV Export:**
- Members list
- Teams list
- Pillars list
- Open roles

**JSON Export:**
- Complete data dump (all entities)
- Formatted for re-import (future feature)

## Future: Backend Integration

### Planned Architecture

```
React App
    ↓
REST/GraphQL API (Node.js/Python)
    ↓
PostgreSQL/Firestore Database
```

### Database Schema (Planned)

**PostgreSQL:**

```sql
-- Pillars
CREATE TABLE pillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  engineering_lead_id UUID REFERENCES members(id),
  product_lead_id UUID REFERENCES members(id),
  delivery_lead_id UUID REFERENCES members(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Teams
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  pillar_id UUID NOT NULL REFERENCES pillars(id) ON DELETE CASCADE,
  engineering_manager_id UUID REFERENCES members(id),
  product_manager_id UUID REFERENCES members(id),
  delivery_lead_id UUID REFERENCES members(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Members
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  pillar_id UUID REFERENCES pillars(id) ON DELETE SET NULL,
  location VARCHAR(255),
  start_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Open Roles
CREATE TABLE open_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  pillar_id UUID NOT NULL REFERENCES pillars(id) ON DELETE CASCADE,
  description TEXT,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users (for auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  picture VARCHAR(500),
  role VARCHAR(50) DEFAULT 'viewer',
  auth_provider VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  entity_type VARCHAR(50),
  entity_id UUID,
  action VARCHAR(50),
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints (Planned)

**Auth:**
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

**Pillars:**
- `GET /api/pillars` - List all
- `GET /api/pillars/:id` - Get one
- `POST /api/pillars` - Create
- `PUT /api/pillars/:id` - Update
- `DELETE /api/pillars/:id` - Delete

**Teams:**
- `GET /api/teams` - List all
- `GET /api/teams/:id` - Get one
- `GET /api/pillars/:pillarId/teams` - List by pillar
- `POST /api/teams` - Create
- `PUT /api/teams/:id` - Update
- `DELETE /api/teams/:id` - Delete

**Members:**
- `GET /api/members` - List all (with filtering)
- `GET /api/members/:id` - Get one
- `GET /api/teams/:teamId/members` - List by team
- `POST /api/members` - Create
- `PUT /api/members/:id` - Update
- `DELETE /api/members/:id` - Delete
- `POST /api/members/:id/move` - Move to different team

**Open Roles:**
- `GET /api/open-roles` - List all
- `GET /api/open-roles/:id` - Get one
- `POST /api/open-roles` - Create
- `PUT /api/open-roles/:id` - Update
- `DELETE /api/open-roles/:id` - Delete

**Reports:**
- `GET /api/reports/members` - Members report
- `GET /api/reports/teams` - Teams report
- `GET /api/reports/pillars` - Pillars report

### Migration Strategy (Future)

1. **Phase 1:** Set up backend API with database
2. **Phase 2:** Add backend CRUD endpoints
3. **Phase 3:** Update React app to call API instead of localStorage
4. **Phase 4:** Add migration tool to import localStorage data to database
5. **Phase 5:** Add real-time sync with WebSockets
6. **Phase 6:** Add audit logging
7. **Phase 7:** Add advanced features (notifications, permissions, etc.)

### Data Migration Tool (Planned)

```javascript
// Example migration utility
async function migrateLocalStorageToBackend() {
  const localData = JSON.parse(localStorage.getItem('team-inventory-data'));

  // Upload to API
  await fetch('/api/migrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(localData)
  });

  // Backup old data
  localStorage.setItem('team-inventory-data-backup', JSON.stringify(localData));

  // Clear local data
  localStorage.removeItem('team-inventory-data');
}
```

## Third-Party Integrations (Future)

### Planned Integrations

1. **Atlassian (Jira/Confluence)**
   - Import teams from Jira
   - Create onboarding tasks in Jira
   - Link to team Confluence pages

2. **Okta**
   - Sync user directory
   - Provision/deprovision accounts
   - Manage group memberships

3. **Google Workspace**
   - Create Google Groups for teams
   - Provision Gmail accounts
   - Calendar integration

4. **Slack**
   - Create team channels
   - Send notifications
   - Onboarding bot

5. **HR Systems (Workday, BambooHR)**
   - Import employee data
   - Sync org chart
   - Trigger workflows on hire/termination

### Integration Architecture

```
Team Inventory Backend
    ↓
Queue (Pub/Sub or SQS)
    ↓
Integration Workers
    ↓
Third-Party APIs
```

## Data Privacy & Compliance

### Current (localStorage)
- No PII collection beyond what user enters
- Data stays in browser
- No server-side logging
- No analytics tracking

### Future (Backend)
- GDPR compliance required
- Data retention policies
- Right to deletion
- Data export capability
- Privacy policy
- Terms of service

## Performance Considerations

### Current
- **Read:** O(n) array operations
- **Write:** Full data serialization to localStorage
- **Search:** Linear search through arrays
- **Max data size:** ~5-10MB

### Future Backend
- Indexed queries
- Pagination
- Caching (Redis)
- GraphQL for efficient data fetching
- Optimistic UI updates
