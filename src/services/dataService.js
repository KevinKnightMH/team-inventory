import { generateId } from '../utils/exportUtils';

class DataService {
  constructor() {
    this.storageKey = 'team-inventory-data';
  }

  // Log audit entry
  logAudit(data, action, entityType, entityId, entityName, user, oldValue = null, newValue = null, details = {}) {
    if (!data.auditLogs) {
      data.auditLogs = [];
    }

    const auditEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      action, // 'create', 'update', 'delete', 'move', 'offboard', 'onboard'
      entityType, // 'pillar', 'team', 'member', 'openRole'
      entityId,
      entityName,
      userId: user?.id || 'system',
      userName: user?.name || 'System',
      userEmail: user?.email || 'system@company.com',
      changedFrom: oldValue,
      changedTo: newValue,
      details
    };

    data.auditLogs.push(auditEntry);
    this.saveData(data);
    return auditEntry;
  }

  // Load all data from localStorage
  loadData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }

  // Save all data to localStorage
  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  // Generic CRUD operations
  create(data, entity, entityType) {
    const newEntity = {
      ...entity,
      id: generateId()
    };

    data[entityType] = [...data[entityType], newEntity];
    this.saveData(data);
    return newEntity;
  }

  update(data, entityId, updates, entityType) {
    const index = data[entityType].findIndex(e => e.id === entityId);
    if (index === -1) return null;

    data[entityType][index] = {
      ...data[entityType][index],
      ...updates
    };
    this.saveData(data);
    return data[entityType][index];
  }

  delete(data, entityId, entityType) {
    const index = data[entityType].findIndex(e => e.id === entityId);
    if (index === -1) return false;

    data[entityType].splice(index, 1);
    this.saveData(data);
    return true;
  }

  // Pillar operations
  createPillar(data, pillar) {
    return this.create(data, { ...pillar, teams: [] }, 'pillars');
  }

  updatePillar(data, pillarId, updates) {
    return this.update(data, pillarId, updates, 'pillars');
  }

  deletePillar(data, pillarId) {
    // Check if pillar has teams
    const pillar = data.pillars.find(p => p.id === pillarId);
    if (pillar && pillar.teams.length > 0) {
      throw new Error('Cannot delete pillar with teams. Remove teams first.');
    }
    return this.delete(data, pillarId, 'pillars');
  }

  // Team operations
  createTeam(data, team) {
    const newTeam = this.create(data, { ...team, members: [] }, 'teams');

    // Add team to pillar
    const pillar = data.pillars.find(p => p.id === team.pillarId);
    if (pillar) {
      pillar.teams.push(newTeam.id);
      this.saveData(data);
    }

    return newTeam;
  }

  updateTeam(data, teamId, updates) {
    const team = data.teams.find(t => t.id === teamId);
    const oldPillarId = team?.pillarId;
    const newPillarId = updates.pillarId;

    const updatedTeam = this.update(data, teamId, updates, 'teams');

    // If pillar changed, update pillar references
    if (oldPillarId !== newPillarId && updatedTeam) {
      if (oldPillarId) {
        const oldPillar = data.pillars.find(p => p.id === oldPillarId);
        if (oldPillar) {
          oldPillar.teams = oldPillar.teams.filter(id => id !== teamId);
        }
      }

      if (newPillarId) {
        const newPillar = data.pillars.find(p => p.id === newPillarId);
        if (newPillar && !newPillar.teams.includes(teamId)) {
          newPillar.teams.push(teamId);
        }
      }

      this.saveData(data);
    }

    return updatedTeam;
  }

  deleteTeam(data, teamId) {
    const team = data.teams.find(t => t.id === teamId);
    if (team && team.members.length > 0) {
      throw new Error('Cannot delete team with members. Remove members first.');
    }

    // Remove team from pillar
    if (team && team.pillarId) {
      const pillar = data.pillars.find(p => p.id === team.pillarId);
      if (pillar) {
        pillar.teams = pillar.teams.filter(id => id !== teamId);
      }
    }

    const result = this.delete(data, teamId, 'teams');
    this.saveData(data);
    return result;
  }

  // Team Member operations
  createMember(data, member) {
    const newMember = this.create(data, member, 'teamMembers');

    // Add member to team
    if (member.teamId) {
      const team = data.teams.find(t => t.id === member.teamId);
      if (team && !team.members.includes(newMember.id)) {
        team.members.push(newMember.id);
        this.saveData(data);
      }
    }

    return newMember;
  }

  updateMember(data, memberId, updates) {
    const member = data.teamMembers.find(m => m.id === memberId);
    const oldTeamId = member?.teamId;
    const newTeamId = updates.teamId;

    const updatedMember = this.update(data, memberId, updates, 'teamMembers');

    // If team changed, update team references
    if (oldTeamId !== newTeamId && updatedMember) {
      if (oldTeamId) {
        const oldTeam = data.teams.find(t => t.id === oldTeamId);
        if (oldTeam) {
          oldTeam.members = oldTeam.members.filter(id => id !== memberId);
        }
      }

      if (newTeamId) {
        const newTeam = data.teams.find(t => t.id === newTeamId);
        if (newTeam && !newTeam.members.includes(memberId)) {
          newTeam.members.push(memberId);
        }
      }

      this.saveData(data);
    }

    return updatedMember;
  }

  deleteMember(data, memberId) {
    const member = data.teamMembers.find(m => m.id === memberId);

    // Remove member from team
    if (member && member.teamId) {
      const team = data.teams.find(t => t.id === member.teamId);
      if (team) {
        team.members = team.members.filter(id => id !== memberId);
      }
    }

    const result = this.delete(data, memberId, 'teamMembers');
    this.saveData(data);
    return result;
  }

  // Offboard member (soft delete - change status to offboarding, then create open role)
  offboardMember(data, memberId) {
    const member = data.teamMembers.find(m => m.id === memberId);
    if (!member) return null;

    // Change status to offboarding
    this.updateMember(data, memberId, { status: 'offboarding' });

    return member;
  }

  // Complete offboarding (remove member and create open role)
  completeOffboarding(data, memberId) {
    const member = data.teamMembers.find(m => m.id === memberId);
    if (!member) return null;

    const teamId = member.teamId;
    const pillarId = member.pillarId;
    const role = member.role;

    // Create open role
    if (teamId && pillarId) {
      this.createOpenRole(data, {
        title: `${member.role.charAt(0).toUpperCase() + member.role.slice(1)} - ${member.name} Replacement`,
        role: role,
        teamId: teamId,
        pillarId: pillarId,
        description: `Open role due to ${member.name} leaving the team.`,
        status: 'open'
      });
    }

    // Delete member
    this.deleteMember(data, memberId);

    return true;
  }

  // Onboard member (change status from onboarding to active)
  completeOnboarding(data, memberId) {
    return this.updateMember(data, memberId, { status: 'active' });
  }

  // Open Role operations
  createOpenRole(data, openRole) {
    return this.create(data, openRole, 'openRoles');
  }

  updateOpenRole(data, roleId, updates) {
    return this.update(data, roleId, updates, 'openRoles');
  }

  deleteOpenRole(data, roleId) {
    return this.delete(data, roleId, 'openRoles');
  }

  // Move member between teams
  moveMember(data, memberId, newTeamId) {
    const member = data.teamMembers.find(m => m.id === memberId);
    if (!member) return null;

    const newTeam = data.teams.find(t => t.id === newTeamId);
    if (!newTeam) return null;

    return this.updateMember(data, memberId, {
      teamId: newTeamId,
      pillarId: newTeam.pillarId
    });
  }
}

export default new DataService();
