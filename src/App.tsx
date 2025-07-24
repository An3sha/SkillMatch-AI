const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
import React, { useState, useMemo, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { Header } from "./components/Header";
import { FilterPanel } from "./components/FilterPanel";
import { CandidateCard } from "./components/CandidateCard";
import { CandidateModal } from "./components/CandidateModal";
import { Candidate } from "./types";
import { createClient } from "@supabase/supabase-js";
import { ChatBot } from "./components/ChatBot";
import { X } from "lucide-react";
import { SelectedTeam } from "./components/SelectedTeam";
import { Pagination } from "./components/Pagination";
import { v4 as uuidv4 } from 'uuid';

export const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [locationFilter, setLocationFilter] = useState("all");
  const [showSelected, setShowSelected] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([
    50000, 300000,
  ]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showTeamTab, setShowTeamTab] = useState(false);
  const [showTeamsList, setShowTeamsList] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teams, setTeams] = useState<
    Array<{
      id: string;
      name: string;
      user_id?: string;
      candidate_ids: string[];
      saved_at: string;
    }>
  >([]);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [skillFilter, setSkillFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");

  // Check authentication state on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsLoggedIn(!!session?.user);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Load teams from Supabase on component mount
  const loadTeamsFromDB = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('saved_at', { ascending: false });

    if (error) {
      console.error('Error loading teams:', error.message);
    } else {
      setTeams(data || []);
    }
  };

  useEffect(() => {
    loadTeamsFromDB();
  }, []);

  async function fetchProfiles(page = 1) {
    const from = (page - 1) * 10;
    const to = from + 10 - 1;
    
    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" });

    // Apply search filter
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }

    // Apply location filter
    if (locationFilter && locationFilter !== "all") {
      query = query.eq('location', locationFilter);
    }

    // Apply skill filter
    if (skillFilter && skillFilter !== "all") {
      query = query.contains('skills', [skillFilter]);
    }

    // Apply company filter
    if (companyFilter && companyFilter !== "all") {
      query = query.contains('work_experiences', [{ company: companyFilter }]);
    }

    // Apply salary filter
    if (salaryRange[0] !== 50000 || salaryRange[1] !== 300000) {
      // Handle salary as text field with currency formatting
     query = query
  .gte('salary_numeric', salaryRange[0])
  .lte('salary_numeric', salaryRange[1]);

    }

    // Apply sorting
    switch (sortBy) {
      case "name":
        query = query.order('name', { ascending: true });
        break;
      case "submitted":
        query = query.order('submitted_at', { ascending: false });
        break;
      case "salary":
        query = query.order('annual_salary_expectation->full-time', { ascending: false });
        break;
      case "experience":
        query = query.order('work_experiences', { ascending: false });
        break;
      default:
        query = query.order('name', { ascending: true });
    }

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching profiles:", error.message);
    } else {
      setCandidates(data || []);
      setTotalCount(count || 0);
    }
  }

  useEffect(() => {
    fetchProfiles(page);
  }, [page, searchTerm, locationFilter, skillFilter, companyFilter, salaryRange, sortBy]);

  // Reset page to 1 when filters change (but not when page changes)
  useEffect(() => {
    const isFilterChange = searchTerm || locationFilter !== "all" || skillFilter !== "all" || companyFilter !== "all" || salaryRange[0] !== 50000 || salaryRange[1] !== 300000;
    if (isFilterChange && page !== 1) {
      setPage(1);
    }
  }, [searchTerm, locationFilter, skillFilter, companyFilter, salaryRange, sortBy, page]);

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

  const handleBuildTeam = () => {
    // Show team building modal with current selections
    setShowTeamTab(true);
    setShowTeamsList(false);
    // Don't clear selectedCandidates - preserve current selections
    setCurrentTeamId(null);
  };

  const handleShowTeams = () => {
    // Show teams list
    setShowTeamsList(true);
    setShowTeamTab(false);
    setSelectedCandidates(new Set());
    setTeamName("");
    setCurrentTeamId(null);
  };

  const handleRemoveFromTeam = (candidateId: string) => {
    setSelectedCandidates((prev) => {
      const newSet = new Set(prev);
      newSet.delete(candidateId);
      return newSet;
    });
  };

  const handleSaveTeam = async () => {
    if (teams.length >= 3) {
      alert(
        "You can only create up to 3 teams. Please delete an existing team first."
      );
      return;
    }

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      alert("You must be logged in to save a team.");
      return;
    }

    const teamData = {
      id: uuidv4(),
      name: teamName || "My Team",
      user_id: user.data.user.id,
      candidate_ids: Array.from(selectedCandidates),
      saved_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("teams")
      .insert([teamData]);

    if (error) {
      console.error("Error saving team:", error.message);
      alert("Failed to save team.");
    } else {
      setTeams((prev) => [...prev, teamData]);
      setSelectedCandidates(new Set());
      setTeamName("");
      setShowTeamTab(false);
      alert("Team saved successfully!");
    }
  };

  const handleClearTeam = () => {
    setSelectedCandidates(new Set());
    setTeamName("");
  };

  const handleDeleteTeam = async (teamId: string) => {
    const { error } = await supabase
      .from("teams")
      .delete()
      .eq("id", teamId);

    if (error) {
      console.error("Error deleting team:", error.message);
      alert("Failed to delete team.");
    } else {
      setTeams((prev) => prev.filter((team) => team.id !== teamId));
      alert("Team deleted successfully!");
    }
  };

  const handleEditTeam = async (team: {
    id: string;
    name: string;
    user_id?: string;
    candidate_ids: string[];
    saved_at: string;
  }) => {
    setSelectedCandidates(new Set(team.candidate_ids));
    setTeamName(team.name);
    setCurrentTeamId(team.id);
    setShowTeamTab(true);
  };

  const handleUpdateTeam = async () => {
    if (!currentTeamId) return;

    const { error } = await supabase
      .from("teams")
      .update({ name: teamName, candidate_ids: Array.from(selectedCandidates) })
      .eq("id", currentTeamId);

    if (error) {
      console.error("Error updating team:", error.message);
      alert("Failed to update team.");
    } else {
      setTeams((prev) =>
        prev.map((team) =>
          team.id === currentTeamId
            ? {
                ...team,
                name: teamName,
                candidate_ids: Array.from(selectedCandidates),
              }
            : team
        )
      );
      setSelectedCandidates(new Set());
      setTeamName("");
      setCurrentTeamId(null);
      setShowTeamTab(false);
      alert("Team updated successfully!");
    }
  };

  const filteredAndSortedCandidates = useMemo(() => {
    // Only apply client-side filtering for "show selected" view
    // All other filtering should be handled server-side
    let filtered = candidates.map((candidate) => ({
      ...candidate,
      isSelected: selectedCandidates.has(candidate.id),
    }));

    // Only apply show selected filter (client-side only)
    if (showSelected) {
      filtered = filtered.filter((candidate) => candidate.isSelected);
    }

    // Apply salary filter (client-side only for now)
    if (salaryRange[0] !== 50000 || salaryRange[1] !== 300000) {
      filtered = filtered.filter(candidate => {
        const salary = candidate.annual_salary_expectation?.['full-time']?.replace(/[^0-9]/g, '');
        if (salary) {
          const salaryNum = parseInt(salary, 10);
          return salaryNum >= salaryRange[0] && salaryNum <= salaryRange[1];
        }
        return false;
      });
    }

    return filtered;
  }, [candidates, selectedCandidates, showSelected, salaryRange]);

  const selectedCandidatesList = candidates.filter((c) =>
    selectedCandidates.has(c.id)
  );

  const pageSize = 10;

  // Calculate pagination based on server-side results
  // For showSelected view, use client-side filtered results
  // For main view, use server-side total count
  const totalPages = showSelected 
    ? Math.ceil(filteredAndSortedCandidates.length / pageSize)
    : Math.ceil(totalCount / pageSize);

  // Only show pagination when there are multiple pages and we're not in showSelected mode
  // or when showSelected has enough items to paginate
  const shouldShowPagination = showSelected 
    ? filteredAndSortedCandidates.length > pageSize
    : totalCount > pageSize;

  // Create available options for filters
  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    candidates.forEach(candidate => {
      candidate.skills?.forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, [candidates]);

  const availableLocations = useMemo(() => {
    const locations = new Set<string>();
    candidates.forEach(candidate => {
      if (candidate.location) locations.add(candidate.location);
    });
    return Array.from(locations).sort();
  }, [candidates]);

  const availableCompanies = useMemo(() => {
    const companies = new Set<string>();
    candidates.forEach(candidate => {
      candidate.work_experiences?.forEach(exp => {
        if (exp.company) companies.add(exp.company);
      });
    });
    return Array.from(companies).sort();
  }, [candidates]);

  if (!isLoggedIn) {
    return <LoginPage />;
  }
const handleLogout = async () => {
  await supabase.auth.signOut();
  setIsLoggedIn(false);
};
  
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        selectedCount={selectedCandidates.size}
        totalCandidates={candidates.length}
        onBuildTeam={handleBuildTeam}
        onShowTeams={handleShowTeams}
        teamsCount={teams.length}
          onLogout={handleLogout}
      />

      <div className="flex">
        {/* Left Sidebar */}
        <FilterPanel
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          showSelected={showSelected}
          setShowSelected={setShowSelected}
          salaryRange={salaryRange}
          setSalaryRange={setSalaryRange}
          selectedCount={selectedCandidates.size}
          onUnselectAll={handleUnselectAll}
          skillFilter={skillFilter}
          setSkillFilter={setSkillFilter}
          companyFilter={companyFilter}
          setCompanyFilter={setCompanyFilter}
          availableSkills={availableSkills}
          availableLocations={availableLocations}
          availableCompanies={availableCompanies}
        />

        {/* Main Content */}
        <div className="w-3/4 px-6 py-8">
          <div className="w-full">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {showSelected ? "Selected Candidates" : "All Candidates"}
              </h2>
              <p className="text-gray-500">
                {filteredAndSortedCandidates.length} candidate
                {filteredAndSortedCandidates.length !== 1 ? "s" : ""} available
              </p>
            </div>

            {showSelected && selectedCandidatesList.length > 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6">
                  {selectedCandidatesList.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={{ ...candidate, isSelected: true }}
                      onSelect={handleSelect}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            )}

            {!showSelected && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={{ ...candidate, isSelected: selectedCandidates.has(candidate.id) }}
                    onSelect={handleSelect}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}

            {showSelected && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {filteredAndSortedCandidates
                  .slice((page - 1) * pageSize, page * pageSize)
                  .map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onSelect={handleSelect}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
              </div>
            )}

            {filteredAndSortedCandidates.length === 0 && (
              <div className="text-center py-16">
                
                <div className="text-gray-500 text-lg mb-2">
                  No candidates found
                </div>
                <p className="text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {shouldShowPagination && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={showSelected ? filteredAndSortedCandidates.length : totalCount}
                itemsPerPage={pageSize}
              />
            )}
          </div>
        </div>
      </div>

      <CandidateModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
      />

      {/* Chat Bot Agent Floating Button and Chat Window */}
      <ChatBot />

      {(showTeamTab || showTeamsList) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200 rounded-t-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {showTeamsList ? "Your Teams" : "Build Your Team"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {showTeamsList
                      ? `${teams.length} team${teams.length !== 1 ? "s" : ""} created`
                      : `Selected ${selectedCandidates.size}/5 candidates`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowTeamTab(false);
                    setShowTeamsList(false);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Team Content */}
              <div className="p-6">
                <SelectedTeam
                  selectedCandidates={candidates.filter((candidate) =>
                    selectedCandidates.has(candidate.id)
                  )}
                  onDeselect={handleRemoveFromTeam}
                  onViewDetails={handleViewDetails}
                  teamName={teamName}
                  onTeamNameChange={setTeamName}
                  onSaveTeam={handleSaveTeam}
                  onClearTeam={handleClearTeam}
                  teams={teams}
                  onDeleteTeam={handleDeleteTeam}
                  onEditTeam={handleEditTeam}
                  onUpdateTeam={handleUpdateTeam}
                  showTeamsList={showTeamsList}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
