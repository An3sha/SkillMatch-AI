import React, { createContext, useContext, ReactNode } from 'react';
import { useTeams } from '../hooks/useTeams';

type TeamsContextType = ReturnType<typeof useTeams> & {
  handleSaveTeam: (selectedCandidates: Set<string>, clearSelectedCandidates?: () => void) => Promise<boolean>;
};

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

interface TeamsProviderProps {
  children: ReactNode;
}

export const TeamsProvider: React.FC<TeamsProviderProps> = ({ children }) => {
  const teamsData = useTeams();

  const handleSaveTeam = async (selectedCandidates: Set<string>, clearSelectedCandidates?: () => void) => {
    const result = await teamsData.handleSaveTeam(selectedCandidates, clearSelectedCandidates);
    return result || false;
  };

  const value = {
    ...teamsData,
    handleSaveTeam,
  };

  return (
    <TeamsContext.Provider value={value}>
      {children}
    </TeamsContext.Provider>
  );
};

export const useTeamsContext = () => {
  const context = useContext(TeamsContext);
  if (context === undefined) {
    throw new Error('useTeamsContext must be used within a TeamsProvider');
  }
  return context;
}; 