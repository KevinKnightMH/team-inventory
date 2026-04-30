import { createContext, useContext, useState, useEffect } from 'react';
import { generateMockData } from '../utils/mockData';
import dataService from '../services/dataService';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [data, setData] = useState({
    pillars: [],
    teams: [],
    teamMembers: [],
    openRoles: [],
    auditLogs: [],
    users: [],
    roles: []
  });
  const [loading, setLoading] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    const storedData = dataService.loadData();

    if (storedData) {
      setData(storedData);
    } else {
      // Generate and save mock data
      const mockData = generateMockData();
      setData(mockData);
      dataService.saveData(mockData);
    }

    setLoading(false);
  }, []);

  // Helper function to refresh data after updates
  const refreshData = () => {
    const currentData = dataService.loadData();
    if (currentData) {
      setData(currentData);
    }
  };

  // Pillar operations
  const createPillar = (pillar) => {
    const newPillar = dataService.createPillar(data, pillar);
    dataService.logAudit(data, 'create', 'pillar', newPillar.id, newPillar.name, user, null, JSON.stringify(newPillar));
    refreshData();
    return newPillar;
  };

  const updatePillar = (pillarId, updates) => {
    const pillar = data.pillars.find(p => p.id === pillarId);
    const oldValue = JSON.stringify(pillar);
    const updated = dataService.updatePillar(data, pillarId, updates);
    const newValue = JSON.stringify(updated);
    dataService.logAudit(data, 'update', 'pillar', pillarId, pillar?.name || 'Unknown', user, oldValue, newValue);
    refreshData();
    return updated;
  };

  const deletePillar = (pillarId) => {
    try {
      const pillar = data.pillars.find(p => p.id === pillarId);
      const oldValue = JSON.stringify(pillar);
      dataService.deletePillar(data, pillarId);
      dataService.logAudit(data, 'delete', 'pillar', pillarId, pillar?.name || 'Unknown', user, oldValue, null);
      refreshData();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Team operations
  const createTeam = (team) => {
    const newTeam = dataService.createTeam(data, team);
    dataService.logAudit(data, 'create', 'team', newTeam.id, newTeam.name, user, null, JSON.stringify(newTeam));
    refreshData();
    return newTeam;
  };

  const updateTeam = (teamId, updates) => {
    const team = data.teams.find(t => t.id === teamId);
    const oldValue = JSON.stringify(team);
    const updated = dataService.updateTeam(data, teamId, updates);
    const newValue = JSON.stringify(updated);
    dataService.logAudit(data, 'update', 'team', teamId, team?.name || 'Unknown', user, oldValue, newValue);
    refreshData();
    return updated;
  };

  const deleteTeam = (teamId) => {
    try {
      const team = data.teams.find(t => t.id === teamId);
      const oldValue = JSON.stringify(team);
      dataService.deleteTeam(data, teamId);
      dataService.logAudit(data, 'delete', 'team', teamId, team?.name || 'Unknown', user, oldValue, null);
      refreshData();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Team Member operations
  const createMember = (member) => {
    const newMember = dataService.createMember(data, member);
    dataService.logAudit(data, 'create', 'member', newMember.id, newMember.name, user, null, JSON.stringify(newMember));
    refreshData();
    return newMember;
  };

  const updateMember = (memberId, updates) => {
    const member = data.teamMembers.find(m => m.id === memberId);
    const oldValue = JSON.stringify(member);
    const updated = dataService.updateMember(data, memberId, updates);
    const newValue = JSON.stringify(updated);
    dataService.logAudit(data, 'update', 'member', memberId, member?.name || 'Unknown', user, oldValue, newValue);
    refreshData();
    return updated;
  };

  const deleteMember = (memberId) => {
    const member = data.teamMembers.find(m => m.id === memberId);
    const oldValue = JSON.stringify(member);
    dataService.deleteMember(data, memberId);
    dataService.logAudit(data, 'delete', 'member', memberId, member?.name || 'Unknown', user, oldValue, null);
    refreshData();
    return { success: true };
  };

  const moveMember = (memberId, newTeamId) => {
    const member = data.teamMembers.find(m => m.id === memberId);
    const oldTeam = data.teams.find(t => t.id === member?.teamId);
    const newTeam = data.teams.find(t => t.id === newTeamId);
    const updated = dataService.moveMember(data, memberId, newTeamId);
    dataService.logAudit(data, 'move', 'member', memberId, member?.name || 'Unknown', user,
      oldTeam?.name || 'Unassigned',
      newTeam?.name || 'Unassigned'
    );
    refreshData();
    return updated;
  };

  const offboardMember = (memberId) => {
    const member = data.teamMembers.find(m => m.id === memberId);
    const result = dataService.offboardMember(data, memberId);
    dataService.logAudit(data, 'offboard', 'member', memberId, member?.name || 'Unknown', user, 'active', 'offboarding');
    refreshData();
    return result;
  };

  const completeOffboarding = (memberId) => {
    const member = data.teamMembers.find(m => m.id === memberId);
    const oldValue = JSON.stringify(member);
    const result = dataService.completeOffboarding(data, memberId);
    dataService.logAudit(data, 'complete_offboard', 'member', memberId, member?.name || 'Unknown', user, oldValue, 'Removed');
    refreshData();
    return result;
  };

  const completeOnboarding = (memberId) => {
    const member = data.teamMembers.find(m => m.id === memberId);
    const result = dataService.completeOnboarding(data, memberId);
    dataService.logAudit(data, 'complete_onboard', 'member', memberId, member?.name || 'Unknown', user, 'onboarding', 'active');
    refreshData();
    return result;
  };

  // Open Role operations
  const createOpenRole = (openRole) => {
    const newRole = dataService.createOpenRole(data, openRole);
    dataService.logAudit(data, 'create', 'openRole', newRole.id, newRole.title, user, null, JSON.stringify(newRole));
    refreshData();
    return newRole;
  };

  const updateOpenRole = (roleId, updates) => {
    const role = data.openRoles.find(r => r.id === roleId);
    const oldValue = JSON.stringify(role);
    const updated = dataService.updateOpenRole(data, roleId, updates);
    const newValue = JSON.stringify(updated);
    dataService.logAudit(data, 'update', 'openRole', roleId, role?.title || 'Unknown', user, oldValue, newValue);
    refreshData();
    return updated;
  };

  const deleteOpenRole = (roleId) => {
    const role = data.openRoles.find(r => r.id === roleId);
    const oldValue = JSON.stringify(role);
    dataService.deleteOpenRole(data, roleId);
    dataService.logAudit(data, 'delete', 'openRole', roleId, role?.title || 'Unknown', user, oldValue, null);
    refreshData();
    return { success: true };
  };

  // User operations
  const createUser = (userData) => {
    const newUser = dataService.createUser(data, userData);
    dataService.logAudit(data, 'create', 'user', newUser.id, newUser.name, user, null, JSON.stringify(newUser));
    refreshData();
    return newUser;
  };

  const updateUser = (userId, updates) => {
    const existingUser = data.users.find(u => u.id === userId);
    const oldValue = JSON.stringify(existingUser);
    const updated = dataService.updateUser(data, userId, updates);
    const newValue = JSON.stringify(updated);
    dataService.logAudit(data, 'update', 'user', userId, existingUser?.name || 'Unknown', user, oldValue, newValue);
    refreshData();
    return updated;
  };

  const deleteUser = (userId) => {
    const existingUser = data.users.find(u => u.id === userId);
    const oldValue = JSON.stringify(existingUser);
    dataService.deleteUser(data, userId);
    dataService.logAudit(data, 'delete', 'user', userId, existingUser?.name || 'Unknown', user, oldValue, null);
    refreshData();
    return { success: true };
  };

  // Role operations
  const createRole = (roleData) => {
    const newRole = dataService.createRole(data, roleData);
    dataService.logAudit(data, 'create', 'role', newRole.id, newRole.displayName, user, null, JSON.stringify(newRole));
    refreshData();
    return newRole;
  };

  const updateRole = (roleId, updates) => {
    try {
      const existingRole = data.roles.find(r => r.id === roleId);
      const oldValue = JSON.stringify(existingRole);
      const updated = dataService.updateRole(data, roleId, updates);
      const newValue = JSON.stringify(updated);
      dataService.logAudit(data, 'update', 'role', roleId, existingRole?.displayName || 'Unknown', user, oldValue, newValue);
      refreshData();
      return { success: true, role: updated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteRole = (roleId) => {
    try {
      const existingRole = data.roles.find(r => r.id === roleId);
      const oldValue = JSON.stringify(existingRole);
      dataService.deleteRole(data, roleId);
      dataService.logAudit(data, 'delete', 'role', roleId, existingRole?.displayName || 'Unknown', user, oldValue, null);
      refreshData();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Helper functions to get related data
  const getPillarById = (id) => data.pillars.find(p => p.id === id);
  const getTeamById = (id) => data.teams.find(t => t.id === id);
  const getMemberById = (id) => data.teamMembers.find(m => m.id === id);
  const getTeamsByPillar = (pillarId) => data.teams.filter(t => t.pillarId === pillarId);
  const getMembersByTeam = (teamId) => data.teamMembers.filter(m => m.teamId === teamId);
  const getOpenRolesByTeam = (teamId) => data.openRoles.filter(r => r.teamId === teamId);

  const value = {
    data,
    loading,
    // Pillar operations
    createPillar,
    updatePillar,
    deletePillar,
    // Team operations
    createTeam,
    updateTeam,
    deleteTeam,
    // Member operations
    createMember,
    updateMember,
    deleteMember,
    moveMember,
    offboardMember,
    completeOffboarding,
    completeOnboarding,
    // Open Role operations
    createOpenRole,
    updateOpenRole,
    deleteOpenRole,
    // User operations
    createUser,
    updateUser,
    deleteUser,
    // Role operations
    createRole,
    updateRole,
    deleteRole,
    // Helper functions
    getPillarById,
    getTeamById,
    getMemberById,
    getTeamsByPillar,
    getMembersByTeam,
    getOpenRolesByTeam,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
