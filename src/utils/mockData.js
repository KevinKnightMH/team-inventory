import { generateId } from './exportUtils';

export function generateMockData() {
  // Generate team members first
  const teamMembers = [
    // Engineering members
    { id: generateId(), name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'engineering', location: 'San Francisco', startDate: '2023-01-15', status: 'active' },
    { id: generateId(), name: 'Michael Rodriguez', email: 'michael.r@company.com', role: 'engineering', location: 'Austin', startDate: '2023-03-20', status: 'active' },
    { id: generateId(), name: 'Priya Sharma', email: 'priya.sharma@company.com', role: 'engineering', location: 'Remote', startDate: '2023-05-10', status: 'active' },
    { id: generateId(), name: 'David Kim', email: 'david.kim@company.com', role: 'engineering', location: 'Seattle', startDate: '2023-07-01', status: 'active' },
    { id: generateId(), name: 'Emma Thompson', email: 'emma.t@company.com', role: 'engineering', location: 'New York', startDate: '2023-09-15', status: 'active' },
    { id: generateId(), name: 'James Wilson', email: 'james.w@company.com', role: 'engineering', location: 'Boston', startDate: '2024-01-10', status: 'active' },
    { id: generateId(), name: 'Lisa Anderson', email: 'lisa.a@company.com', role: 'engineering', location: 'San Francisco', startDate: '2024-03-01', status: 'active' },
    { id: generateId(), name: 'Alex Martinez', email: 'alex.m@company.com', role: 'engineering', location: 'Denver', startDate: '2024-05-15', status: 'active' },

    // Product members
    { id: generateId(), name: 'Jennifer Lee', email: 'jennifer.lee@company.com', role: 'product', location: 'San Francisco', startDate: '2023-02-01', status: 'active' },
    { id: generateId(), name: 'Robert Brown', email: 'robert.b@company.com', role: 'product', location: 'New York', startDate: '2023-04-10', status: 'active' },
    { id: generateId(), name: 'Maria Garcia', email: 'maria.g@company.com', role: 'product', location: 'Austin', startDate: '2023-08-20', status: 'active' },
    { id: generateId(), name: 'Kevin O\'Brien', email: 'kevin.o@company.com', role: 'product', location: 'Remote', startDate: '2024-02-15', status: 'active' },

    // Design members
    { id: generateId(), name: 'Sophie Taylor', email: 'sophie.t@company.com', role: 'design', location: 'Los Angeles', startDate: '2023-03-15', status: 'active' },
    { id: generateId(), name: 'Daniel Park', email: 'daniel.p@company.com', role: 'design', location: 'Seattle', startDate: '2023-06-01', status: 'active' },
    { id: generateId(), name: 'Olivia Johnson', email: 'olivia.j@company.com', role: 'design', location: 'San Francisco', startDate: '2024-01-20', status: 'active' },

    // Delivery members
    { id: generateId(), name: 'Tom Harris', email: 'tom.h@company.com', role: 'delivery', location: 'New York', startDate: '2023-02-15', status: 'active' },
    { id: generateId(), name: 'Rachel Green', email: 'rachel.g@company.com', role: 'delivery', location: 'Austin', startDate: '2023-07-10', status: 'active' },
    { id: generateId(), name: 'Marcus Wright', email: 'marcus.w@company.com', role: 'delivery', location: 'Remote', startDate: '2024-04-01', status: 'active' },

    // Engineering Managers
    { id: generateId(), name: 'Amanda Foster', email: 'amanda.f@company.com', role: 'engineering', location: 'San Francisco', startDate: '2022-01-10', status: 'active' },
    { id: generateId(), name: 'Christopher Lee', email: 'chris.lee@company.com', role: 'engineering', location: 'Seattle', startDate: '2022-03-15', status: 'active' },
    { id: generateId(), name: 'Diana Martinez', email: 'diana.m@company.com', role: 'engineering', location: 'Austin', startDate: '2022-06-01', status: 'active' },

    // Onboarding members
    { id: generateId(), name: 'New Hire 1', email: 'newhire1@company.com', role: 'engineering', location: 'San Francisco', startDate: '2025-12-15', status: 'onboarding' },
    { id: generateId(), name: 'New Hire 2', email: 'newhire2@company.com', role: 'product', location: 'New York', startDate: '2025-12-20', status: 'onboarding' },

    // Offboarding members
    { id: generateId(), name: 'Leaving Soon', email: 'leaving@company.com', role: 'engineering', location: 'Remote', startDate: '2023-01-01', status: 'offboarding' },
  ];

  // Create pillars with leads
  const pillars = [
    {
      id: generateId(),
      name: 'Platform Engineering',
      engineeringLead: teamMembers[18].id, // Amanda Foster
      productLead: teamMembers[8].id, // Jennifer Lee
      deliveryOpsLead: teamMembers[15].id, // Tom Harris
      teams: []
    },
    {
      id: generateId(),
      name: 'Customer Experience',
      engineeringLead: teamMembers[19].id, // Christopher Lee
      productLead: teamMembers[9].id, // Robert Brown
      deliveryOpsLead: teamMembers[16].id, // Rachel Green
      teams: []
    },
    {
      id: generateId(),
      name: 'Data & Analytics',
      engineeringLead: teamMembers[20].id, // Diana Martinez
      productLead: teamMembers[10].id, // Maria Garcia
      deliveryOpsLead: teamMembers[17].id, // Marcus Wright
      teams: []
    }
  ];

  // Create teams
  const teams = [
    // Platform Engineering teams
    {
      id: generateId(),
      name: 'Infrastructure',
      pillarId: pillars[0].id,
      engineeringManager: teamMembers[18].id,
      productManager: teamMembers[8].id,
      deliveryLead: teamMembers[15].id,
      members: [teamMembers[0].id, teamMembers[1].id, teamMembers[2].id]
    },
    {
      id: generateId(),
      name: 'Developer Tools',
      pillarId: pillars[0].id,
      engineeringManager: teamMembers[18].id,
      productManager: teamMembers[8].id,
      deliveryLead: teamMembers[15].id,
      members: [teamMembers[3].id, teamMembers[4].id]
    },
    // Customer Experience teams
    {
      id: generateId(),
      name: 'Frontend',
      pillarId: pillars[1].id,
      engineeringManager: teamMembers[19].id,
      productManager: teamMembers[9].id,
      deliveryLead: teamMembers[16].id,
      members: [teamMembers[5].id, teamMembers[6].id, teamMembers[12].id, teamMembers[13].id]
    },
    {
      id: generateId(),
      name: 'Mobile',
      pillarId: pillars[1].id,
      engineeringManager: teamMembers[19].id,
      productManager: teamMembers[9].id,
      deliveryLead: teamMembers[16].id,
      members: [teamMembers[7].id, teamMembers[14].id]
    },
    // Data & Analytics teams
    {
      id: generateId(),
      name: 'Data Platform',
      pillarId: pillars[2].id,
      engineeringManager: teamMembers[20].id,
      productManager: teamMembers[10].id,
      deliveryLead: teamMembers[17].id,
      members: []
    }
  ];

  // Update pillar team references
  pillars[0].teams = [teams[0].id, teams[1].id];
  pillars[1].teams = [teams[2].id, teams[3].id];
  pillars[2].teams = [teams[4].id];

  // Update team members with their team and pillar assignments
  teamMembers[0].teamId = teams[0].id;
  teamMembers[0].pillarId = pillars[0].id;
  teamMembers[1].teamId = teams[0].id;
  teamMembers[1].pillarId = pillars[0].id;
  teamMembers[2].teamId = teams[0].id;
  teamMembers[2].pillarId = pillars[0].id;
  teamMembers[3].teamId = teams[1].id;
  teamMembers[3].pillarId = pillars[0].id;
  teamMembers[4].teamId = teams[1].id;
  teamMembers[4].pillarId = pillars[0].id;
  teamMembers[5].teamId = teams[2].id;
  teamMembers[5].pillarId = pillars[1].id;
  teamMembers[6].teamId = teams[2].id;
  teamMembers[6].pillarId = pillars[1].id;
  teamMembers[7].teamId = teams[3].id;
  teamMembers[7].pillarId = pillars[1].id;
  teamMembers[12].teamId = teams[2].id;
  teamMembers[12].pillarId = pillars[1].id;
  teamMembers[13].teamId = teams[2].id;
  teamMembers[13].pillarId = pillars[1].id;
  teamMembers[14].teamId = teams[3].id;
  teamMembers[14].pillarId = pillars[1].id;

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

  return {
    pillars,
    teams,
    teamMembers,
    openRoles
  };
}
