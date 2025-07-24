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

export const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
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
      candidateIds: string[];
      savedAt: string;
    }>
  >([]);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);

  // Load teams from localStorage on component mount
  useEffect(() => {
    const savedTeams = localStorage.getItem("savedTeams");
    if (savedTeams) {
      const parsedTeams = JSON.parse(savedTeams);
      setTeams(parsedTeams);
    }
  }, []);

  // Save teams to localStorage whenever teams change
  useEffect(() => {
    if (teams.length > 0) {
      localStorage.setItem("savedTeams", JSON.stringify(teams));
    }
  }, [teams]);

  // Load current team data from localStorage on component mount
  useEffect(() => {
    const savedTeam = localStorage.getItem("savedTeam");
    if (savedTeam) {
      const parsedTeam = JSON.parse(savedTeam);
      setSelectedCandidates(new Set(parsedTeam.candidateIds));
      setTeamName(parsedTeam.name || "");
    }
  }, []);

  // Save team data to localStorage whenever selected candidates change
  useEffect(() => {
    if (selectedCandidates.size > 0) {
      const teamData = {
        name: teamName,
        candidateIds: Array.from(selectedCandidates),
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("savedTeam", JSON.stringify(teamData));
    }
  }, [selectedCandidates, teamName]);

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
    // Always start building a new team
    setShowTeamTab(true);
    setShowTeamsList(false);
    setSelectedCandidates(new Set());
    setTeamName("");
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

  const handleSaveTeam = () => {
    if (teams.length >= 3) {
      alert(
        "You can only create up to 3 teams. Please delete an existing team first."
      );
      return;
    }

    const teamData = {
      id: Date.now().toString(),
      name: teamName || "My Team",
      candidateIds: Array.from(selectedCandidates),
      savedAt: new Date().toISOString(),
    };

    setTeams((prev) => [...prev, teamData]);
    setSelectedCandidates(new Set());
    setTeamName("");
    setShowTeamTab(false);
    localStorage.removeItem("savedTeam");
    alert("Team saved successfully!");
  };

  const handleClearTeam = () => {
    setSelectedCandidates(new Set());
    setTeamName("");
    localStorage.removeItem("savedTeam");
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams((prev) => prev.filter((team) => team.id !== teamId));
  };

  const handleEditTeam = (team: {
    id: string;
    name: string;
    candidateIds: string[];
    savedAt: string;
  }) => {
    setSelectedCandidates(new Set(team.candidateIds));
    setTeamName(team.name);
    setCurrentTeamId(team.id);
    setShowTeamTab(true);
  };

  const handleUpdateTeam = () => {
    if (!currentTeamId) return;

    const updatedTeams = teams.map((team) =>
      team.id === currentTeamId
        ? {
            ...team,
            name: teamName,
            candidateIds: Array.from(selectedCandidates),
          }
        : team
    );

    setTeams(updatedTeams);
    setSelectedCandidates(new Set());
    setTeamName("");
    setCurrentTeamId(null);
    setShowTeamTab(false);
    localStorage.removeItem("savedTeam");
    alert("Team updated successfully!");
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
    if (locationFilter) {
      filtered = filtered.filter((candidate) => {
        if (locationFilter === "all") {
          return true;
        }
        if (locationFilter === "US") {
          return (
            candidate.location.includes("CA") ||
            candidate.location.includes("NY") ||
            candidate.location.includes("IL") ||
            candidate.location.includes("WA") ||
            candidate.location.includes("FL") ||
            candidate.location.includes("MA") ||
            candidate.location.includes("TX")
          );
        } else if (locationFilter === "International") {
          return (
            !candidate.location.includes("CA") &&
            !candidate.location.includes("NY") &&
            !candidate.location.includes("IL") &&
            !candidate.location.includes("WA") &&
            !candidate.location.includes("FL") &&
            !candidate.location.includes("MA") &&
            !candidate.location.includes("TX")
          );
        }
        return true;
      });
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
    showSelected,
    salaryRange,
  ]);

  const selectedCandidatesList = candidates.filter((c) =>
    selectedCandidates.has(c.id)
  );

  const pageSize = 10;

  // Pagination helpers
  const totalPages = Math.ceil(totalCount / pageSize);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        selectedCount={selectedCandidates.size}
        totalCandidates={candidates.length}
        onBuildTeam={handleBuildTeam}
        onShowTeams={handleShowTeams}
        teamsCount={teams.length}
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
                      ? `${teams.length} team${
                          teams.length !== 1 ? "s" : ""
                        } created`
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
