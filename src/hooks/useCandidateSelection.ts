import { useState } from 'react';
import { Candidate } from '../types';

export const useCandidateSelection = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(
    new Set()
  );
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (candidateId: string) => {
    setSelectedCandidates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId);
      } else if (newSet.size < 5) {
        newSet.add(candidateId);
      }
      return newSet;
    });
  };

  const handleUnselectAll = () => {
    setSelectedCandidates(new Set());
  };

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleRemoveFromTeam = (candidateId: string) => {
    setSelectedCandidates((prev) => {
      const newSet = new Set(prev);
      newSet.delete(candidateId);
      return newSet;
    });
  };

  const clearSelectedCandidates = () => {
    setSelectedCandidates(new Set());
  };



  return {
    selectedCandidates,
    selectedCandidate,
    isModalOpen,
    setIsModalOpen,
    handleSelect,
    handleUnselectAll,
    handleViewDetails,
    handleRemoveFromTeam,
    clearSelectedCandidates
  };
}; 