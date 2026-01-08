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
    auditLogs: []
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
    dataService.logAudit(data, 'create', 'pillar', newPillar.id, newPillar.name, user);
    refreshData();
    return newPillar;
  };

  const updatePillar = (pillarId, updates) => {
    const pillar = data.pillars.find(p => p.id === pillarId);
    const updated = dataService.updatePillar(data, pillarId, updates);
    dataService.logAudit(data, 'update', 'pillar', pillarId, pillar?.name || 'Unknown', user, { updates });
    refreshData();
    return updated;
  };

  const deletePillar = (pillarId) => {
    try {
      const pillar = data.pillars.find(p => p.id === pillarId);
      dataService.deletePillar(data, pillarId);
      dataService.logAudit(data, 'delete', 'pillar', pillarId, pillar?.name || 'Unknown', user);
      refreshData();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Team operations
  const createTeam = (team) => {
    const newTeam = dataService.createTeam(data, team);
    dataService.logAudit(data, 'create', 'team', newTeam.id, newTeam.name, user);
    refreshData();
    return newTeam;
  };

  const updateTeam = (teamId, updates) => {
    const team = data.teams.find(t => t.id === teamId);
    const updated = dataService.updateTeam(data, teamId, updates);
    dataService.logAudit(data, 'update', 'team', teamId, team?.name || 'Unknown', user, { updates });
    refreshData();
    return updated;
  };

  const deleteTeam = (teamId) => {
    try {
      const team = data.teams.find(t => t.id === teamId);
      dataService.deleteTeam(data, teamId);
      dataService.logAudit(data, 'delete', 'team', teamId, team?.name || 'Unknown', user);
      refreshData();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Team Member operations
  const createMember = (member) => {
    const newMember = dataService.createMember(data, member);
    dataService.logAudit(data, 'create', 'member', newMember.id, newMember.name, user);
    refreshData();
    return newMember;
  };

  const updateMember = (memberId, updates) => {
    const member = data.teamMembers.find(m => m.id === memberId);
    const updated = dataService.updateMember(data, memberId, updates);
    dataService.logAudit(data, 'update', 'member', memberId, member?.name || 'Unknown', user, { updates });
    refreshData();
    return updated;
  };

  const deleteMember = (memberId) => {
    const member = data.teamMembers.find(m => m.id === memberId);
    dataService.deleteMember(data, memberId);
    dataService.logAudit(data, 'delete', 'member', memberId, member?.name || 'Unknown', user);
    refreshData();
    return { success: true };
  };

  const moveMember = (memberId, newTeamId) => {
    const member = data.teamMembers.find(m => m.id === memberId);
    const newTeam = data.teams.find(t => t.id === newTeamId);
    const updated = dataService.moveMember(data, memberId, newTeamId);
    dataService.logAudit(data, 'move', 'member', memberId, member?.name || 'Unknown', user, {
      toTeam: newTeam?.name
    });
    refreshData();
    return updated;
  };

  const offboardMember = (memberId) => {
    const member = data.teamMembers.find(m => m.id === memberId);
    const result = dataService.offboardMember(data, memberId);
    dataService.logAudit(data, 'offboard', 'member', memberId, member?.name || 'Unknown', user);
    refreshData();
    return result;
  };

  const completeOffboarding = (memberId) => {
    const member = data.teamMembers.find(m => m.id === memberId);
    const result = dataService.completeOffboarding(data, memberId);
    dataService.logAudit(data, 'complete_offboard', 'member', memberId, member?.name || 'Unknown', user);
    refreshData();
    return result;
  };

  const completeOnboarding = (memberId) => {
    const member = data.teamMembers.find(m => m.id === memberId);
    const result = dataService.completeOnboarding(data, memberId);
    dataService.logAudit(data, 'complete_onboard', 'member', memberId, member?.name || 'Unknown', user);
    refreshData();
    return result;
  };

  // Open Role operations
  const createOpenRole = (openRole) => {
    const newRole = dataService.createOpenRole(data, openRole);
    dataService.logAudit(data, 'create', 'openRole', newRole.id, newRole.title, user);
    refreshData();
    return newRole;
  };

  const updateOpenRole = (roleId, updates) => {
    const role = data.openRoles.find(r => r.id === roleId);
    const updated = dataService.updateOpenRole(data, roleId, updates);
    dataService.logAudit(data, 'update', 'openRole', roleId, role?.title || 'Unknown', user, { updates });
    refreshData();
    return updated;
  };

  const deleteOpenRole = (roleId) => {
    const role = data.openRoles.find(r => r.id === roleId);
    dataService.deleteOpenRole(data, roleId);
    dataService.logAudit(data, 'delete', 'openRole', roleId, role?.title || 'Unknown', user);
    refreshData();
    return { success: true };
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
