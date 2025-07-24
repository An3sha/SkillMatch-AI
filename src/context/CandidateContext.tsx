import React, { createContext, useContext, ReactNode } from 'react';
import { useCandidates } from '../hooks/useCandidates';
import { useFilters } from '../hooks/useFilters';
import { useCandidateSelectionContext } from './CandidateSelectionContext';

type CandidatesContextType = ReturnType<typeof useCandidates> & {
  filters: ReturnType<typeof useFilters>;
};

const CandidatesContext = createContext<CandidatesContextType | undefined>(undefined);

interface CandidatesProviderProps {
  children: ReactNode;
}

export const CandidatesProvider: React.FC<CandidatesProviderProps> = ({ children }) => {
  const filters = useFilters();
  const { selectedCandidates } = useCandidateSelectionContext();
  
  const candidatesData = useCandidates(
    selectedCandidates,
    {
      searchTerm: filters.searchTerm,
      sortBy: filters.sortBy,
      locationFilter: filters.locationFilter,
      skillFilter: filters.skillFilter,
      companyFilter: filters.companyFilter,
      educationLevelFilter: filters.educationLevelFilter,
      subjectFilter: filters.subjectFilter,
      availabilityFilter: filters.availabilityFilter,
      experienceLevelFilter: filters.experienceLevelFilter,
      roleTypeFilter: filters.roleTypeFilter,
      salaryRange: filters.salaryRange,
      showSelected: filters.showSelected,
    },
    filters.page
  );

  const value = {
    ...candidatesData,
    filters,
  };

  return (
    <CandidatesContext.Provider value={value}>
      {children}
    </CandidatesContext.Provider>
  );
};

export const useCandidatesContext = () => {
  const context = useContext(CandidatesContext);
  if (context === undefined) {
    throw new Error('useCandidatesContext must be used within a CandidatesProvider');
  }
  return context;
}; 