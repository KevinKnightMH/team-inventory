import { generateId } from './exportUtils';

export function generateMockData() {
  // Generate team members first
  const teamMembers = [
    // Engineering members
    { id: generateId(), name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'engineering', location: 'San Francisco', country: 'USA', startDate: '2023-01-15', status: 'active' },
    { id: generateId(), name: 'Michael Rodriguez', email: 'michael.r@company.com', role: 'engineering', location: 'Austin', country: 'USA', startDate: '2023-03-20', status: 'active' },
    { id: generateId(), name: 'Priya Sharma', email: 'priya.sharma@company.com', role: 'engineering', location: 'Bangalore', country: 'India', startDate: '2023-05-10', status: 'active' },
    { id: generateId(), name: 'David Kim', email: 'david.kim@company.com', role: 'engineering', location: 'Seattle', country: 'USA', startDate: '2023-07-01', status: 'active' },
    { id: generateId(), name: 'Emma Thompson', email: 'emma.t@company.com', role: 'engineering', location: 'New York', country: 'USA', startDate: '2023-09-15', status: 'active' },
    { id: generateId(), name: 'James Wilson', email: 'james.w@company.com', role: 'engineering', location: 'Boston', country: 'USA', startDate: '2024-01-10', status: 'active' },
    { id: generateId(), name: 'Lisa Anderson', email: 'lisa.a@company.com', role: 'engineering', location: 'San Francisco', country: 'USA', startDate: '2024-03-01', status: 'active' },
    { id: generateId(), name: 'Alex Martinez', email: 'alex.m@company.com', role: 'engineering', location: 'Denver', country: 'USA', startDate: '2024-05-15', status: 'active' },

    // Product members
    { id: generateId(), name: 'Jennifer Lee', email: 'jennifer.lee@company.com', role: 'product', location: 'San Francisco', country: 'USA', startDate: '2023-02-01', status: 'active' },
    { id: generateId(), name: 'Robert Brown', email: 'robert.b@company.com', role: 'product', location: 'New York', country: 'USA', startDate: '2023-04-10', status: 'active' },
    { id: generateId(), name: 'Maria Garcia', email: 'maria.g@company.com', role: 'product', location: 'Austin', country: 'USA', startDate: '2023-08-20', status: 'active' },
    { id: generateId(), name: 'Kevin O\'Brien', email: 'kevin.o@company.com', role: 'product', location: 'Dublin', country: 'Ireland', startDate: '2024-02-15', status: 'active' },

    // Design members
    { id: generateId(), name: 'Sophie Taylor', email: 'sophie.t@company.com', role: 'design', location: 'Los Angeles', country: 'USA', startDate: '2023-03-15', status: 'active' },
    { id: generateId(), name: 'Daniel Park', email: 'daniel.p@company.com', role: 'design', location: 'Seattle', country: 'USA', startDate: '2023-06-01', status: 'active' },
    { id: generateId(), name: 'Olivia Johnson', email: 'olivia.j@company.com', role: 'design', location: 'San Francisco', country: 'USA', startDate: '2024-01-20', status: 'active' },

    // Delivery members
    { id: generateId(), name: 'Tom Harris', email: 'tom.h@company.com', role: 'delivery', location: 'New York', country: 'USA', startDate: '2023-02-15', status: 'active' },
    { id: generateId(), name: 'Rachel Green', email: 'rachel.g@company.com', role: 'delivery', location: 'Austin', country: 'USA', startDate: '2023-07-10', status: 'active' },
    { id: generateId(), name: 'Marcus Wright', email: 'marcus.w@company.com', role: 'delivery', location: 'London', country: 'UK', startDate: '2024-04-01', status: 'active' },

    // Engineering Managers
    { id: generateId(), name: 'Amanda Foster', email: 'amanda.f@company.com', role: 'engineering', location: 'San Francisco', country: 'USA', startDate: '2022-01-10', status: 'active' },
    { id: generateId(), name: 'Christopher Lee', email: 'chris.lee@company.com', role: 'engineering', location: 'Seattle', country: 'USA', startDate: '2022-03-15', status: 'active' },
    { id: generateId(), name: 'Diana Martinez', email: 'diana.m@company.com', role: 'engineering', location: 'Austin', country: 'USA', startDate: '2022-06-01', status: 'active' },

    // Product Managers
    { id: generateId(), name: 'Steven Parker', email: 'steven.p@company.com', role: 'product', location: 'New York', country: 'USA', startDate: '2022-02-20', status: 'active' },

    // Design Manager
    { id: generateId(), name: 'Nicole Zhang', email: 'nicole.z@company.com', role: 'design', location: 'Los Angeles', country: 'USA', startDate: '2022-04-15', status: 'active' },

    // Onboarding members
    { id: generateId(), name: 'New Hire 1', email: 'newhire1@company.com', role: 'engineering', location: 'San Francisco', country: 'USA', startDate: '2025-12-15', status: 'onboarding' },
    { id: generateId(), name: 'New Hire 2', email: 'newhire2@company.com', role: 'product', location: 'New York', country: 'USA', startDate: '2025-12-20', status: 'onboarding' },

    // Offboarding members
    { id: generateId(), name: 'Leaving Soon', email: 'leaving@company.com', role: 'engineering', location: 'Toronto', country: 'Canada', startDate: '2023-01-01', status: 'offboarding' },
  ];

  // Create pillars with leads
  const pillars = [
    {
      id: generateId(),
      name: 'Platform Engineering',
      engineeringLead: teamMembers[18].id, // Amanda Foster
      productLead: teamMembers[21].id, // Steven Parker
      deliveryOpsLead: teamMembers[15].id, // Tom Harris
      teams: [],
      slackChannel: 'https://app.slack.com/client/T01234ABC/C05PLATFORM',
      googleDrive: 'https://drive.google.com/drive/folders/1aBcDefGhIjKlMnOpQrStUvWxYz-Platform',
      confluenceSpace: 'https://yourcompany.atlassian.net/wiki/spaces/PLATFORM/overview',
      jiraSpace: 'https://yourcompany.atlassian.net/jira/software/c/projects/PLAT/boards/1'
    },
    {
      id: generateId(),
      name: 'Customer Experience',
      engineeringLead: teamMembers[19].id, // Christopher Lee
      productLead: teamMembers[21].id, // Steven Parker
      deliveryOpsLead: teamMembers[16].id, // Rachel Green
      teams: [],
      slackChannel: 'https://company.slack.com/archives/customer-exp',
      googleDrive: 'https://drive.google.com/drive/folders/customer-experience',
      confluenceSpace: 'https://company.atlassian.net/wiki/spaces/CX',
      jiraSpace: 'https://company.atlassian.net/browse/CX'
    },
    {
      id: generateId(),
      name: 'Data & Analytics',
      engineeringLead: teamMembers[20].id, // Diana Martinez
      productLead: teamMembers[21].id, // Steven Parker
      deliveryOpsLead: teamMembers[17].id, // Marcus Wright
      teams: [],
      slackChannel: 'https://company.slack.com/archives/data-analytics',
      googleDrive: 'https://drive.google.com/drive/folders/data-analytics',
      confluenceSpace: 'https://company.atlassian.net/wiki/spaces/DATA',
      jiraSpace: 'https://company.atlassian.net/browse/DATA'
    }
  ];

  // Create teams
  const teams = [
    // Platform Engineering teams
    {
      id: generateId(),
      name: 'Infrastructure',
      pillarId: pillars[0].id,
      engineeringManager: teamMembers[18].id, // Amanda Foster
      productManager: teamMembers[21].id, // Steven Parker
      deliveryLead: teamMembers[15].id, // Tom Harris
      members: [teamMembers[0].id, teamMembers[1].id, teamMembers[2].id],
      slackChannel: 'https://app.slack.com/client/T01234ABC/C06INFRASTRUCTURE',
      googleDrive: 'https://drive.google.com/drive/folders/1XyZ-Infrastructure-Docs-2024',
      confluenceSpace: 'https://yourcompany.atlassian.net/wiki/spaces/INFRA/pages/12345/Team+Home',
      jiraSpace: 'https://yourcompany.atlassian.net/jira/software/c/projects/INFRA/boards/5'
    },
    {
      id: generateId(),
      name: 'Developer Tools',
      pillarId: pillars[0].id,
      engineeringManager: teamMembers[18].id, // Amanda Foster
      productManager: teamMembers[21].id, // Steven Parker
      deliveryLead: teamMembers[15].id, // Tom Harris
      members: [teamMembers[3].id, teamMembers[4].id],
      slackChannel: 'https://company.slack.com/archives/team-devtools',
      googleDrive: 'https://drive.google.com/drive/folders/devtools-team',
      confluenceSpace: 'https://company.atlassian.net/wiki/spaces/DEVTOOLS',
      jiraSpace: 'https://company.atlassian.net/browse/DEVTOOLS'
    },
    // Customer Experience teams
    {
      id: generateId(),
      name: 'Frontend',
      pillarId: pillars[1].id,
      engineeringManager: teamMembers[19].id, // Christopher Lee
      productManager: teamMembers[21].id, // Steven Parker
      deliveryLead: teamMembers[16].id, // Rachel Green
      members: [teamMembers[5].id, teamMembers[6].id, teamMembers[12].id, teamMembers[13].id],
      slackChannel: 'https://company.slack.com/archives/team-frontend',
      googleDrive: 'https://drive.google.com/drive/folders/frontend-team',
      confluenceSpace: 'https://company.atlassian.net/wiki/spaces/FRONTEND',
      jiraSpace: 'https://company.atlassian.net/browse/FE'
    },
    {
      id: generateId(),
      name: 'Mobile',
      pillarId: pillars[1].id,
      engineeringManager: teamMembers[19].id, // Christopher Lee
      productManager: teamMembers[21].id, // Steven Parker
      deliveryLead: teamMembers[16].id, // Rachel Green
      members: [teamMembers[7].id, teamMembers[14].id],
      slackChannel: 'https://company.slack.com/archives/team-mobile',
      googleDrive: 'https://drive.google.com/drive/folders/mobile-team',
      confluenceSpace: 'https://company.atlassian.net/wiki/spaces/MOBILE',
      jiraSpace: 'https://company.atlassian.net/browse/MOBILE'
    },
    // Data & Analytics teams
    {
      id: generateId(),
      name: 'Data Platform',
      pillarId: pillars[2].id,
      engineeringManager: teamMembers[20].id, // Diana Martinez
      productManager: teamMembers[21].id, // Steven Parker
      deliveryLead: teamMembers[17].id, // Marcus Wright
      members: [],
      slackChannel: 'https://company.slack.com/archives/team-dataplatform',
      googleDrive: 'https://drive.google.com/drive/folders/dataplatform-team',
      confluenceSpace: 'https://company.atlassian.net/wiki/spaces/DATAPLATFORM',
      jiraSpace: 'https://company.atlassian.net/browse/DP'
    }
  ];

  // Update pillar team references
  pillars[0].teams = [teams[0].id, teams[1].id];
  pillars[1].teams = [teams[2].id, teams[3].id];
  pillars[2].teams = [teams[4].id];

  // Update team members with their team and pillar assignments
  // Infrastructure team - reports to Amanda Foster
  teamMembers[0].teamId = teams[0].id;
  teamMembers[0].pillarId = pillars[0].id;
  teamMembers[0].reportingManagerId = teamMembers[18].id; // Amanda Foster
  teamMembers[1].teamId = teams[0].id;
  teamMembers[1].pillarId = pillars[0].id;
  teamMembers[1].reportingManagerId = teamMembers[18].id; // Amanda Foster
  teamMembers[2].teamId = teams[0].id;
  teamMembers[2].pillarId = pillars[0].id;
  teamMembers[2].reportingManagerId = teamMembers[18].id; // Amanda Foster

  // Developer Tools team - reports to Amanda Foster
  teamMembers[3].teamId = teams[1].id;
  teamMembers[3].pillarId = pillars[0].id;
  teamMembers[3].reportingManagerId = teamMembers[18].id; // Amanda Foster
  teamMembers[4].teamId = teams[1].id;
  teamMembers[4].pillarId = pillars[0].id;
  teamMembers[4].reportingManagerId = teamMembers[18].id; // Amanda Foster

  // Frontend team - reports to Christopher Lee
  teamMembers[5].teamId = teams[2].id;
  teamMembers[5].pillarId = pillars[1].id;
  teamMembers[5].reportingManagerId = teamMembers[19].id; // Christopher Lee
  teamMembers[6].teamId = teams[2].id;
  teamMembers[6].pillarId = pillars[1].id;
  teamMembers[6].reportingManagerId = teamMembers[19].id; // Christopher Lee

  // Mobile team - reports to Christopher Lee
  teamMembers[7].teamId = teams[3].id;
  teamMembers[7].pillarId = pillars[1].id;
  teamMembers[7].reportingManagerId = teamMembers[19].id; // Christopher Lee

  // Design team members - report to Nicole Zhang
  teamMembers[12].teamId = teams[2].id;
  teamMembers[12].pillarId = pillars[1].id;
  teamMembers[12].reportingManagerId = teamMembers[22].id; // Nicole Zhang
  teamMembers[13].teamId = teams[2].id;
  teamMembers[13].pillarId = pillars[1].id;
  teamMembers[13].reportingManagerId = teamMembers[22].id; // Nicole Zhang
  teamMembers[14].teamId = teams[3].id;
  teamMembers[14].pillarId = pillars[1].id;
  teamMembers[14].reportingManagerId = teamMembers[22].id; // Nicole Zhang

  // Product members - report to Steven Parker
  teamMembers[8].reportingManagerId = teamMembers[21].id; // Steven Parker
  teamMembers[9].reportingManagerId = teamMembers[21].id; // Steven Parker
  teamMembers[10].reportingManagerId = teamMembers[21].id; // Steven Parker
  teamMembers[11].reportingManagerId = teamMembers[21].id; // Steven Parker

  // Delivery members - report to Tom Harris (senior delivery lead)
  teamMembers[16].reportingManagerId = teamMembers[15].id; // Tom Harris
  teamMembers[17].reportingManagerId = teamMembers[15].id; // Tom Harris

  // Create open roles
  const openRoles = [
    {
      id: generateId(),
      title: 'Senior Backend Engineer',
      role: 'engineering',
      teamId: teams[0].id,
      pillarId: pillars[0].id,
      description: 'Looking for an experienced backend engineer to work on infrastructure.',
      status: 'open'
    },
    {
      id: generateId(),
      title: 'Product Designer',
      role: 'design',
      teamId: teams[2].id,
      pillarId: pillars[1].id,
      description: 'Need a product designer for our frontend team.',
      status: 'in-progress'
    },
    {
      id: generateId(),
      title: 'Data Engineer',
      role: 'engineering',
      teamId: teams[4].id,
      pillarId: pillars[2].id,
      description: 'Data engineer to build our analytics platform.',
      status: 'open'
    },
    {
      id: generateId(),
      title: 'Product Manager',
      role: 'product',
      teamId: teams[3].id,
      pillarId: pillars[1].id,
      description: 'Product manager for mobile applications.',
      status: 'open'
    }
  ];

  // Create roles with permissions
  const roles = [
    {
      id: generateId(),
      name: 'admin',
      displayName: 'Admin',
      description: 'Full system access',
      permissions: {
        dashboard: { view: true },
        pillars: { view: true, create: true, edit: true, delete: true },
        teams: { view: true, create: true, edit: true, delete: true },
        members: { view: true, create: true, edit: true, delete: true, move: true },
        onboarding: { view: true, create: true, complete: true },
        offboarding: { view: true, create: true, complete: true },
        reports: { view: true, export: true },
        admin: { view: true, manageUsers: true, manageRoles: true }
      },
      isSystem: true
    },
    {
      id: generateId(),
      name: 'engineering_manager',
      displayName: 'Engineering Manager',
      description: 'Manage engineering teams and members',
      permissions: {
        dashboard: { view: true },
        pillars: { view: true, create: false, edit: true, delete: false },
        teams: { view: true, create: true, edit: true, delete: false },
        members: { view: true, create: true, edit: true, delete: false, move: true },
        onboarding: { view: true, create: true, complete: true },
        offboarding: { view: true, create: true, complete: false },
        reports: { view: true, export: true },
        admin: { view: false, manageUsers: false, manageRoles: false }
      },
      isSystem: true
    },
    {
      id: generateId(),
      name: 'product_manager',
      displayName: 'Product Manager',
      description: 'Manage product teams and roadmaps',
      permissions: {
        dashboard: { view: true },
        pillars: { view: true, create: false, edit: true, delete: false },
        teams: { view: true, create: false, edit: true, delete: false },
        members: { view: true, create: false, edit: true, delete: false, move: false },
        onboarding: { view: true, create: false, complete: false },
        offboarding: { view: true, create: false, complete: false },
        reports: { view: true, export: true },
        admin: { view: false, manageUsers: false, manageRoles: false }
      },
      isSystem: true
    },
    {
      id: generateId(),
      name: 'delivery_lead',
      displayName: 'Delivery Lead',
      description: 'Track team delivery and operations',
      permissions: {
        dashboard: { view: true },
        pillars: { view: true, create: false, edit: false, delete: false },
        teams: { view: true, create: false, edit: true, delete: false },
        members: { view: true, create: false, edit: false, delete: false, move: false },
        onboarding: { view: true, create: false, complete: false },
        offboarding: { view: true, create: false, complete: false },
        reports: { view: true, export: true },
        admin: { view: false, manageUsers: false, manageRoles: false }
      },
      isSystem: true
    },
    {
      id: generateId(),
      name: 'viewer',
      displayName: 'Viewer',
      description: 'Read-only access to all screens',
      permissions: {
        dashboard: { view: true },
        pillars: { view: true, create: false, edit: false, delete: false },
        teams: { view: true, create: false, edit: false, delete: false },
        members: { view: true, create: false, edit: false, delete: false, move: false },
        onboarding: { view: true, create: false, complete: false },
        offboarding: { view: true, create: false, complete: false },
        reports: { view: true, export: false },
        admin: { view: false, manageUsers: false, manageRoles: false }
      },
      isSystem: true
    }
  ];

  // Create users
  const users = [
    {
      id: generateId(),
      name: 'Admin User',
      email: 'admin@company.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      id: generateId(),
      name: 'Engineering Manager',
      email: 'engmgr@company.com',
      password: 'eng123',
      role: 'engineering_manager'
    },
    {
      id: generateId(),
      name: 'Product Manager',
      email: 'pm@company.com',
      password: 'pm123',
      role: 'product_manager'
    },
    {
      id: generateId(),
      name: 'Delivery Lead',
      email: 'delivery@company.com',
      password: 'del123',
      role: 'delivery_lead'
    }
  ];

  return {
    pillars,
    teams,
    teamMembers,
    openRoles,
    auditLogs: [],
    users,
    roles
  };
}
