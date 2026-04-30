# Team Inventory - Organization Management System

A comprehensive web application for managing organizational team structure, built with React, Vite, and Tailwind CSS.

## Features

### Core Functionality
- **Dashboard**: Overview with key metrics (pillars, teams, members, onboarding/offboarding counts)
- **Pillar Management**: Create, edit, view, and delete organizational pillars with leadership assignments
- **Team Management**: Manage teams within pillars, assign managers and leads
- **Member Management**: Complete CRUD operations for team members with advanced filtering
- **Onboarding Workflow**: Queue system for new hires with status tracking
- **Offboarding Workflow**: Automated process that creates open roles upon completion
- **Reporting & Analytics**: 6 different report types with CSV and JSON export capabilities
- **Team Member Movement**: Transfer members between teams while maintaining data integrity

### Technical Features
- **Google OAuth Authentication**: Secure sign-in with Google accounts
- **Mock Authentication**: Role-based access with 4 predefined user accounts (for testing)
- **LocalStorage Persistence**: All data persists in browser storage
- **Real-time Updates**: Instant UI updates on all CRUD operations
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Relationship Management**: Automatic cascade updates for team/pillar relationships
- **Cloud Ready**: Dockerized for easy deployment to Google Cloud Run

## Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- Google Cloud account (for OAuth and deployment)

### Installation

1. Navigate to the project directory:
   ```bash
   cd team-inventory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Configure Google OAuth** (optional, for Google sign-in):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Copy your Client ID
   - Create `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Add your Google Client ID to `.env`:
     ```
     VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Authentication

### Google OAuth (Recommended)
- Click "Sign in with Google" on the login page
- Authenticate with your Google account
- New users automatically get "viewer" role

### Demo Accounts
The application includes 4 mock user accounts for testing:

| Email | Password | Role |
|-------|----------|------|
| admin@company.com | admin123 | Admin |
| engmgr@company.com | eng123 | Engineering Manager |
| pm@company.com | pm123 | Product Manager |
| delivery@company.com | del123 | Delivery Lead |

## Usage Guide

### Managing Pillars
1. Click "Pillars" in the sidebar
2. Click "Add Pillar" to create a new pillar
3. Assign Engineering Lead, Product Lead, and Delivery Ops Lead
4. Click on a pillar to view details and associated teams

### Managing Teams
1. Click "Teams" in the sidebar
2. Click "Add Team" to create a new team
3. Select a pillar and assign managers
4. View team details to see all members

### Managing Members
1. Click "Members" in the sidebar
2. Use filters to search by team, pillar, role, or status
3. Click "Add Member" to create a new team member
4. Click on a member to view details and move between teams

### Onboarding Process
1. Click "Onboarding" in the sidebar
2. Click "Add New Member" to start onboarding
3. Fill in member details (status is automatically set to "onboarding")
4. Click "Complete Onboarding" when ready to activate the member

### Offboarding Process
1. Navigate to a member's detail page
2. Click "Initiate Offboarding" (changes status to "offboarding")
3. Go to "Offboarding" in the sidebar
4. Click "Complete Offboarding" to remove member and create an open role

### Generating Reports
1. Click "Reports" in the sidebar
2. Select a report type:
   - All Members
   - Active Members
   - Teams Overview
   - Pillars Overview
   - Open Roles
   - Members by Role
3. Click "Export CSV" or "Export JSON" to download data

## Mock Data

The application includes sample data:
- 3 Pillars: Platform Engineering, Customer Experience, Data & Analytics
- 5 Teams across the pillars
- 24+ team members (active, onboarding, and offboarding)
- 4 open roles

## Data Model

### Pillar
- Name
- Engineering Lead (reference to team member)
- Product Lead (reference to team member)
- Delivery Ops Lead (reference to team member)
- Teams (array of team IDs)

### Team
- Name
- Pillar ID (reference to pillar)
- Engineering Manager (reference to team member)
- Product Manager (reference to team member)
- Delivery Lead (reference to team member)
- Members (array of member IDs)

### Team Member
- Name
- Email
- Role (engineering, product, design, delivery, other)
- Location
- Team ID (reference to team)
- Pillar ID (reference to pillar)
- Start Date
- Status (active, onboarding, offboarding)

### Open Role
- Title
- Role
- Team ID (reference to team)
- Pillar ID (reference to pillar)
- Description
- Status (open, in-progress, filled)

## Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Authentication**: @react-oauth/google
- **State Management**: React Context API
- **Data Persistence**: Browser LocalStorage
- **Deployment**: Docker + Google Cloud Run

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Login component
│   ├── Common/         # Reusable components (Table, Modal)
│   ├── Dashboard/      # Dashboard with metrics
│   ├── Layout/         # Header, Sidebar, Layout
│   ├── Members/        # Member management
│   ├── Offboarding/    # Offboarding workflow
│   ├── Onboarding/     # Onboarding workflow
│   ├── Pillars/        # Pillar management
│   ├── Reports/        # Reporting and export
│   └── Teams/          # Team management
├── context/            # React contexts (Auth, Data)
├── hooks/              # Custom hooks (useLocalStorage)
├── services/           # Data service layer
├── utils/              # Utilities (export, mock data)
├── App.jsx             # Main app component with routing
└── main.jsx            # App entry point
```

## Deployment

### Google Cloud Run

Deploy to Google Cloud Run with automatic scaling:

```bash
gcloud builds submit --config cloudbuild.yaml
```

See [CLOUD_RUN_DEPLOYMENT.md](./CLOUD_RUN_DEPLOYMENT.md) for detailed instructions.

### Other Platforms

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel and Netlify options.

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Future Enhancements

- Monthly certification workflow
- Integration with Atlassian and Okta APIs
- Google Groups and Okta groups management
- OKR group integration
- Real backend with database
- Audit logging
- Team member history tracking
- Advanced analytics and visualizations

## License

This is a prototype application for demonstration purposes.
