import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { AuthCallback } from "./components/AuthCallback";
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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

  // Immediate localStorage cleanup - runs on every render
  useEffect(() => {
    // Clean up all localStorage items immediately
    localStorage.removeItem("savedTeam");
    localStorage.removeItem("savedTeams");
    // Don't remove the Supabase auth token here as it's needed for authentication
  });

  // Global function to manually clear localStorage (can be called from browser console)
  useEffect(() => {
    // @ts-expect-error - Adding global function to window
    window.clearAppStorage = () => {
      localStorage.removeItem("savedTeam");
      localStorage.removeItem("savedTeams");
      console.log("App localStorage cleared!");
    };
  }, []);

  // Check for existing session on app load
  useEffect(() => {
    const checkUser = async () => {
      // Clean up old localStorage items
      localStorage.removeItem("savedTeam");
      localStorage.removeItem("savedTeams");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
      }
    };
    
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsLoggedIn(true);
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          // Clean up localStorage on sign out
          localStorage.removeItem("savedTeam");
          localStorage.removeItem("savedTeams");
        }
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
    const { data, error, count } = await supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .range(from, to);

    if (error) {
      console.error("Error fetching profiles:", error.message);
    } else {
      setCandidates(data || []);
      setTotalCount(count || 0);
    }
  }

  useEffect(() => {
    fetchProfiles(page);
  }, [page]);

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
    let filtered = candidates.map((candidate) => ({
      ...candidate,
      isSelected: selectedCandidates.has(candidate.id),
    }));

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          candidate.work_experiences?.some(
            (exp) =>
              exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
              exp.roleName.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply location filter
    if (locationFilter && locationFilter !== "all") {
      filtered = filtered.filter((candidate) => candidate.location === locationFilter);
    }

    // Apply skill filter
    if (skillFilter && skillFilter !== "all") {
      filtered = filtered.filter((candidate) => 
        candidate.skills?.some(skill => skill === skillFilter)
      );
    }

    // Apply company filter
    if (companyFilter && companyFilter !== "all") {
      filtered = filtered.filter((candidate) =>
        candidate.work_experiences?.some(exp => exp.company === companyFilter)
      );
    }

    // Apply salary filter
    filtered = filtered.filter((candidate) => {
      if (candidate.annual_salary_expectation["full-time"]) {
        const salary = parseInt(
          candidate.annual_salary_expectation["full-time"].replace(/[$,]/g, "")
        );
        return salary >= salaryRange[0] && salary <= salaryRange[1];
      }
      return true;
    });

    // Apply show selected filter
    if (showSelected) {
      filtered = filtered.filter((candidate) => candidate.isSelected);
    }

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "submitted":
          return (
            new Date(b.submitted_at).getTime() -
            new Date(a.submitted_at).getTime()
          );
        case "salary": {
          const aSalary = parseInt(
            a.annual_salary_expectation["full-time"]?.replace(/[$,]/g, "") ||
              "0"
          );
          const bSalary = parseInt(
            b.annual_salary_expectation["full-time"]?.replace(/[$,]/g, "") ||
              "0"
          );
          return bSalary - aSalary;
        }
        case "experience":
          return (
            (b.work_experiences?.length || 0) -
            (a.work_experiences?.length || 0)
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    candidates,
    selectedCandidates,
    searchTerm,
    sortBy,
    locationFilter,
    skillFilter,
    companyFilter,
    showSelected,
    salaryRange,
  ]);

  const selectedCandidatesList = candidates.filter((c) =>
    selectedCandidates.has(c.id)
  );

  const pageSize = 10;

  // Pagination helpers
  const totalPages = Math.ceil(totalCount / pageSize);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    // Clean up all localStorage items
    localStorage.removeItem("savedTeam");
    localStorage.removeItem("savedTeams");
    // Clear Supabase auth token
    localStorage.removeItem("sb-fkhopyrggtmvikblwwnn-auth-token");
  };

  // Main App Component (authenticated content)
  const MainApp = () => (
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
                {filteredAndSortedCandidates.map((candidate) => (
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <div className="text-gray-500 text-lg mb-2">
                  No candidates found
                </div>
                <p className="text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
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

  return (
    <Router>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route 
          path="/" 
          element={isLoggedIn ? <MainApp /> : <LoginPage />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
