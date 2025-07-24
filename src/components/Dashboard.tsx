import React, { useEffect } from "react";
import { Header } from "./Header";
import { FilterPanel } from "./FilterPanel";
import { CandidateModal } from "./CandidateModal";
import { CandidateGrid } from "./CandidateGrid";
import { Pagination } from "./Pagination";
import { TeamModal } from "./TeamModal";
import { ChatBot } from "./ChatBot";
import { useTeamsContext } from "../context/TeamsContext";
import { useCandidateSelectionContext } from "../context/CandidateSelectionContext";
import { useCandidatesContext } from "../context/CandidateContext";

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const teams = useTeamsContext();
  const teamsArray = teams.teams || [];
  const candidateSelection = useCandidateSelectionContext();
  const { candidates, totalFilteredCount, isLoadingCandidates, hasActiveFilters, totalPages, availableSkills, availableLocations, availableCompanies, paginatedCandidates, filters } = useCandidatesContext();

  // Get selected candidates as array for display
  const selectedCandidatesList = candidates.filter((candidate) =>
    candidateSelection.selectedCandidates.has(candidate.id)
  );

  // Reset page when filters change
  useEffect(() => {
    if (filters.page !== 1) {
      filters.setPage(1);
    }
  }, [
    filters.searchTerm,
    filters.locationFilter,
    filters.skillFilter,
    filters.companyFilter,
    filters.educationLevelFilter,
    filters.subjectFilter,
    filters.availabilityFilter,
    filters.experienceLevelFilter,
    filters.roleTypeFilter,
    filters.salaryRange,
    filters.showSelected,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen">
      <Header
        selectedCount={candidateSelection.selectedCandidates.size}
        totalCandidates={totalFilteredCount}
        teamsCount={teamsArray.length}
        onBuildTeam={teams.handleBuildTeam}
        onLogout={onLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        <FilterPanel
          searchTerm={filters.searchTerm}
          setSearchTerm={filters.setSearchTerm}
          sortBy={filters.sortBy}
          setSortBy={filters.setSortBy}
          locationFilter={filters.locationFilter}
          setLocationFilter={filters.setLocationFilter}
          skillFilter={filters.skillFilter}
          setSkillFilter={filters.setSkillFilter}
          companyFilter={filters.companyFilter}
          setCompanyFilter={filters.setCompanyFilter}
          educationLevelFilter={filters.educationLevelFilter}
          setEducationLevelFilter={filters.setEducationLevelFilter}
          subjectFilter={filters.subjectFilter}
          setSubjectFilter={filters.setSubjectFilter}
          availabilityFilter={filters.availabilityFilter}
          setAvailabilityFilter={filters.setAvailabilityFilter}
          experienceLevelFilter={filters.experienceLevelFilter}
          setExperienceLevelFilter={filters.setExperienceLevelFilter}
          roleTypeFilter={filters.roleTypeFilter}
          setRoleTypeFilter={filters.setRoleTypeFilter}
          salaryRange={filters.salaryRange}
          setSalaryRange={filters.setSalaryRange}
          showSelected={filters.showSelected}
          setShowSelected={filters.setShowSelected}
          selectedCount={candidateSelection.selectedCandidates.size}
          onUnselectAll={candidateSelection.handleUnselectAll}
          availableSkills={availableSkills}
          availableLocations={availableLocations}
          availableCompanies={availableCompanies}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="flex-1 flex flex-col">
              <CandidateGrid
                showSelected={filters.showSelected}
                paginatedCandidates={paginatedCandidates}
                selectedCandidatesList={selectedCandidatesList}
                totalFilteredCount={totalFilteredCount}
                isLoadingCandidates={isLoadingCandidates}
                hasActiveFilters={Boolean(hasActiveFilters)}
                onSelect={candidateSelection.handleSelect}
                onViewDetails={candidateSelection.handleViewDetails}
              />
              
              {!filters.showSelected && totalPages > 1 && (
                <div className="sticky bottom-0 bg-white shadow-lg border-t border-gray-200 py-4 px-6 z-10">
                  <div className="relative">
                    <Pagination
                      currentPage={filters.page}
                      totalPages={totalPages}
                      onPageChange={filters.setPage}
                    />
                    {isLoadingCandidates && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4c4cc9]"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Team Modal */}
      <TeamModal
        showTeamTab={teams.showTeamTab}
        showTeamsList={teams.showTeamsList}
        showTeamDetails={teams.showTeamDetails}
        selectedTeam={teams.selectedTeam}
        selectedCandidates={selectedCandidatesList}
        teamName={teams.teamName}
                  teams={teamsArray}
        allCandidates={candidates}
        onTeamNameChange={teams.setTeamName}
        onSaveTeam={async () => {
          const result = await teams.handleSaveTeam(
            candidateSelection.selectedCandidates,
            candidateSelection.clearSelectedCandidates
          );
          return result || false;
        }}
        onClearTeam={teams.handleClearTeam}
        onDeleteTeam={teams.handleDeleteTeam}
        onViewTeamDetails={teams.handleViewTeamDetails}
        onBackToTeamsList={teams.handleBackToTeamsList}
        onDeselect={candidateSelection.handleRemoveFromTeam}
        onViewDetails={candidateSelection.handleViewDetails}
        onClose={teams.closeTeamModals}
      />

      {/* Candidate Modal */}
      <CandidateModal
        candidate={candidateSelection.selectedCandidate}
        isOpen={candidateSelection.isModalOpen}
        onClose={() => candidateSelection.setIsModalOpen(false)}
        onSelect={candidateSelection.handleSelect}
      />

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}; 