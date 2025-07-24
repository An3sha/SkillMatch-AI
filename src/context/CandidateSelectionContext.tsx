import React, { createContext, useContext, ReactNode } from 'react';
import { useCandidateSelection } from '../hooks/useCandidateSelection';

type CandidateSelectionContextType = ReturnType<typeof useCandidateSelection>;

const CandidateSelectionContext = createContext<CandidateSelectionContextType | undefined>(undefined);

interface CandidateSelectionProviderProps {
  children: ReactNode;
}

export const CandidateSelectionProvider: React.FC<CandidateSelectionProviderProps> = ({ children }) => {
  const candidateSelectionData = useCandidateSelection();

  return (
    <CandidateSelectionContext.Provider value={candidateSelectionData}>
      {children}
    </CandidateSelectionContext.Provider>
  );
};

export const useCandidateSelectionContext = () => {
  const context = useContext(CandidateSelectionContext);
  if (context === undefined) {
    throw new Error('useCandidateSelectionContext must be used within a CandidateSelectionProvider');
  }
  return context;
}; 