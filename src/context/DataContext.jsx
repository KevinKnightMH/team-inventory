import { createContext, useContext, useState, useEffect } from 'react';
import { generateMockData } from '../utils/mockData';
import dataService from '../services/dataService';

const DataContext = createContext();

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }) {
  const [data, setData] = useState({
    pillars: [],
    teams: [],
    teamMembers: [],
    openRoles: []
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
    refreshData();
    return newPillar;
  };

  const updatePillar = (pillarId, updates) => {
    const updated = dataService.updatePillar(data, pillarId, updates);
    refreshData();
    return updated;
  };

  const deletePillar = (pillarId) => {
    try {
      dataService.deletePillar(data, pillarId);
      refreshData();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Team operations
  const createTeam = (team) => {
    const newTeam = dataService.createTeam(data, team);
    refreshData();
    return newTeam;
  };

  const updateTeam = (teamId, updates) => {
    const updated = dataService.updateTeam(data, teamId, updates);
    refreshData();
    return updated;
  };

  const deleteTeam = (teamId) => {
    try {
      dataService.deleteTeam(data, teamId);
      refreshData();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Team Member operations
  const createMember = (member) => {
    const newMember = dataService.createMember(data, member);
    refreshData();
    return newMember;
  };

  const updateMember = (memberId, updates) => {
    const updated = dataService.updateMember(data, memberId, updates);
    refreshData();
    return updated;
  };

  const deleteMember = (memberId) => {
    dataService.deleteMember(data, memberId);
    refreshData();
    return { success: true };
  };

  const moveMember = (memberId, newTeamId) => {
    const updated = dataService.moveMember(data, memberId, newTeamId);
    refreshData();
    return updated;
  };

  const offboardMember = (memberId) => {
    const result = dataService.offboardMember(data, memberId);
    refreshData();
    return result;
  };

  const completeOffboarding = (memberId) => {
    const result = dataService.completeOffboarding(data, memberId);
    refreshData();
    return result;
  };

  const completeOnboarding = (memberId) => {
    const result = dataService.completeOnboarding(data, memberId);
    refreshData();
    return result;
  };

  // Open Role operations
  const createOpenRole = (openRole) => {
    const newRole = dataService.createOpenRole(data, openRole);
    refreshData();
    return newRole;
  };

  const updateOpenRole = (roleId, updates) => {
    const updated = dataService.updateOpenRole(data, roleId, updates);
    refreshData();
    return updated;
  };

  const deleteOpenRole = (roleId) => {
    dataService.deleteOpenRole(data, roleId);
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
