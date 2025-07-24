import React from 'react';
import { X } from 'lucide-react';
import { SelectedTeam } from './SelectedTeam';
import { TeamDetailsPage } from '../pages/TeamDetailsPage';
import { Candidate } from '../types';
import { Team } from '../hooks/useTeams';

interface TeamModalProps {
  showTeamTab: boolean;
  showTeamsList: boolean;
  showTeamDetails: boolean;
  selectedTeam: Team | null;
  selectedCandidates: Candidate[];
  teamName: string;
  teams: Team[];
  allCandidates: Candidate[];
  onTeamNameChange: (name: string) => void;
  onSaveTeam: () => Promise<boolean>;
  onClearTeam: () => void;
  onDeleteTeam: (teamId: string) => void;
  onViewTeamDetails: (team: Team) => void;
  onBackToTeamsList: () => void;
  onDeselect: (candidateId: string) => void;
  onViewDetails: (candidate: Candidate) => void;
  onClose: () => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({
  showTeamTab,
  showTeamsList,
  showTeamDetails,
  selectedTeam,
  selectedCandidates,
  teamName,
  teams,
  allCandidates,
  onTeamNameChange,
  onSaveTeam,
  onClearTeam,
  onDeleteTeam,
  onViewTeamDetails,
  onBackToTeamsList,
  onDeselect,
  onViewDetails,
  onClose,
}) => {
  if (!showTeamTab && !showTeamsList && !showTeamDetails) {
    return null;
  }

  // Get team members for the selected team
  const getTeamMembers = (team: Team): Candidate[] => {
    return allCandidates.filter(candidate => team.candidate_ids.includes(candidate.id));
  };

  const handleSaveTeam = async () => {
    const success = await onSaveTeam();
    if (success) {
      onClose();
    }
  };



  // If showing team details, render the full-page TeamDetailsPage
  if (showTeamDetails && selectedTeam) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <TeamDetailsPage
          team={selectedTeam}
          teamMembers={getTeamMembers(selectedTeam)}
          onBack={onBackToTeamsList}
          onViewDetails={onViewDetails}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto custom-scrollbar-minimal">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200 rounded-t-2xl">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {showTeamsList ? "Your Teams" : "Build Your Team"}
              </h2>
              <p className="text-gray-600 mt-1">
                {showTeamsList
                  ? `${teams.length} team${teams.length !== 1 ? "s" : ""} created`
                  : `Selected ${selectedCandidates.length}/5 candidates`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Team Content */}
          <div className="p-6">
            <SelectedTeam
              selectedCandidates={selectedCandidates}
              onDeselect={onDeselect}
              onViewDetails={onViewDetails}
              teamName={teamName}
              onTeamNameChange={onTeamNameChange}
              onSaveTeam={handleSaveTeam}
              onClearTeam={onClearTeam}
              teams={teams}
              onDeleteTeam={onDeleteTeam}
              onViewTeamDetails={onViewTeamDetails}
              showTeamsList={showTeamsList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 