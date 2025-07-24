import { useState, useEffect } from 'react';
import { supabase } from './useAuth';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from './use-toast';

export interface Team {
  id: string;
  name: string;
  user_id?: string;
  candidate_ids: string[];
  saved_at: string;
}

export const useTeams = () => {
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [showTeamTab, setShowTeamTab] = useState(false);
  const [showTeamsList, setShowTeamsList] = useState(false);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState("");


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

  const handleBuildTeam = () => {
    setShowTeamTab(true);
    setShowTeamsList(false);
  };

  const handleShowTeams = () => {
    setShowTeamsList(true);
    setShowTeamTab(false);
    setShowTeamDetails(false);
    setSelectedTeam(null);
    setTeamName("");
  };

  const handleViewTeamDetails = (team: Team) => {
    setSelectedTeam(team);
    setShowTeamDetails(true);
    setShowTeamsList(false);
    setShowTeamTab(false);
  };

  const handleBackToTeamsList = () => {
    setShowTeamDetails(false);
    setSelectedTeam(null);
    setShowTeamsList(true);
  };

  const handleClearTeam = () => {
    setTeamName("");
  };

  const handleSaveTeam = async (selectedCandidates: Set<string>, clearSelectedCandidates?: () => void) => {
    if (teams.length >= 3) {
      toast({
        title: "Team Limit Reached",
        description: "You can only create up to 3 teams. Please delete an existing team first.",
        variant: "destructive",
      });
      return;
    }

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to save a team.",
        variant: "destructive",
      });
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
      toast({
        title: "Save Failed",
        description: "Failed to save team. Please try again.",
        variant: "destructive",
      });
    } else {
      setTeams((prev) => [...prev, teamData]);
      setTeamName("");
      setShowTeamTab(false);
      
      // Clear selected candidates to reset dashboard
      if (clearSelectedCandidates) {
        clearSelectedCandidates();
      }
      
      toast({
        title: "Team Saved Successfully! 🎉",
        description: `Your team "${teamData.name}" has been saved with ${teamData.candidate_ids.length} candidates.`,
      });
      return true;
    }
    return false;
  };

  const handleDeleteTeam = async (teamId: string) => {
    const { error } = await supabase
      .from("teams")
      .delete()
      .eq("id", teamId);

    if (error) {
      console.error("Error deleting team:", error.message);
      toast({
        title: "Delete Failed",
        description: "Failed to delete team. Please try again.",
        variant: "destructive",
      });
    } else {
      setTeams((prev) => prev.filter((team) => team.id !== teamId));
      toast({
        title: "Team Deleted",
        description: "Team has been successfully deleted.",
      });
    }
  };

  const handleRemoveCandidateFromTeam = async (teamId: string, candidateId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) {
      toast({
        title: "Error",
        description: "Team not found.",
        variant: "destructive",
      });
      return false;
    }

    const updatedCandidateIds = team.candidate_ids.filter(id => id !== candidateId);

    const { error } = await supabase
      .from("teams")
      .update({ candidate_ids: updatedCandidateIds })
      .eq("id", teamId);

    if (error) {
      console.error("Error removing candidate from team:", error.message);
      toast({
        title: "Remove Failed",
        description: "Failed to remove candidate from team. Please try again.",
        variant: "destructive",
      });
      return false;
    } else {
      setTeams((prev) => prev.map(t => 
        t.id === teamId 
          ? { ...t, candidate_ids: updatedCandidateIds }
          : t
      ));
      toast({
        title: "Member Removed",
        description: "Candidate has been removed from the team.",
      });
      return true;
    }
  };



  const closeTeamModals = () => {
    setShowTeamTab(false);
    setShowTeamsList(false);
    setShowTeamDetails(false);
    setSelectedTeam(null);
  };

  return {
    teams,
    showTeamTab,
    showTeamsList,
    showTeamDetails,
    selectedTeam,
    teamName,
    setTeamName,
    handleBuildTeam,
    handleShowTeams,
    handleViewTeamDetails,
    handleBackToTeamsList,
    handleClearTeam,
    handleSaveTeam,
    handleDeleteTeam,
    handleRemoveCandidateFromTeam,
    closeTeamModals
  };
}; 