import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Users, MapPin, Briefcase, GraduationCap, DollarSign, Calendar, Star, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { CandidateModal } from '../components/CandidateModal';
import { Candidate } from '../types';
import { useTeamsContext } from '../context/TeamsContext'; 
import { useCandidatesContext } from '../context/CandidateContext';
import { useCandidateSelectionContext } from '../context/CandidateSelectionContext';

export const TeamDetailsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { teams, handleRemoveCandidateFromTeam } = useTeamsContext();
  const { candidates, isLoadingCandidates } = useCandidatesContext();
  const { handleViewDetails, selectedCandidate, isModalOpen, setIsModalOpen } = useCandidateSelectionContext();

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [candidateToRemove, setCandidateToRemove] = React.useState<{ id: string; name: string } | null>(null);

  // Show loading state while data is being fetched
  if (isLoadingCandidates || teams.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4c4cc9] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team details...</p>
        </div>
      </div>
    );
  }

  // Find the team by ID
  const team = teams.find((t) => t.id === teamId);
  

  
  // Get team members - first try by ID, then fallback to showing team info
  let teamMembers: Candidate[] = [];
  let membershipIssue = false;
  
  if (team) {
    // Try to find members by ID
    teamMembers = candidates.filter((candidate: Candidate) => team.candidate_ids.includes(candidate.id));
    
    // If no members found by ID, there's a data inconsistency
    if (teamMembers.length === 0 && team.candidate_ids.length > 0) {
      membershipIssue = true;
      console.warn('Team member IDs do not match current candidate database. This usually happens when candidate data was refreshed.');
    }
  }
  
  

  // If team not found, show error message
  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Not Found</h1>
          <p className="text-gray-600 mb-4">The team with ID "{teamId}" could not be found.</p>
          <Button onClick={() => navigate('/teams')} className="bg-[#4c4cc9] hover:bg-[#4c4cc9]/90">
            Back to Teams
          </Button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/teams');
  };

  const handleRemoveCandidate = (candidateId: string, candidateName: string) => {
    setCandidateToRemove({ id: candidateId, name: candidateName });
    setShowDeleteModal(true);
  };

  const confirmRemoveCandidate = async () => {
    if (candidateToRemove && team) {
      await handleRemoveCandidateFromTeam(team.id, candidateToRemove.id);
      setShowDeleteModal(false);
      setCandidateToRemove(null);
    }
  };

  const cancelRemoveCandidate = () => {
    setShowDeleteModal(false);
    setCandidateToRemove(null);
  };
  const formatSalary = (candidate: Candidate) => {
    const salary = candidate.annual_salary_expectation?.['full-time'];
    if (!salary) return 'Not specified';
    return salary.replace('$', '$').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getEducationLevel = (candidate: Candidate) => {
    return candidate.education?.highest_level || 'Not specified';
  };

  const getExperience = (candidate: Candidate) => {
    return candidate.work_experiences?.[0]?.roleName || 'Not specified';
  };

  const getCompany = (candidate: Candidate) => {
    return candidate.work_experiences?.[0]?.company || 'Not specified';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-[#4c4cc9] to-indigo-600 p-3 rounded-2xl">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{team.candidate_ids.length}/5 members</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Created {new Date(team.saved_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Star className="w-3 h-3 mr-1" />
                Dream Team
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Team Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#4c4cc9]/10 to-indigo-50 border border-[#4c4cc9]/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-[#4c4cc9] p-2 rounded-xl">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#4c4cc9]">{teamMembers.length}</p>
                  <p className="text-sm text-[#4c4cc9]/80">Available Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-600 p-2 rounded-xl">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">
                    {teamMembers.filter(m => m.education?.highest_level === "Bachelor's Degree").length}
                  </p>
                  <p className="text-sm text-emerald-600">Bachelor's+</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-600 p-2 rounded-xl">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-700">
                    {new Set(teamMembers.flatMap(m => m.work_experiences?.map(w => w.company) || [])).size}
                  </p>
                  <p className="text-sm text-amber-600">Companies</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600 p-2 rounded-xl">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">
                    {teamMembers.length > 0 
                      ? `$${Math.round(teamMembers.reduce((sum, m) => {
                          const salary = m.annual_salary_expectation?.['full-time'];
                          return sum + (salary ? parseInt(salary.replace(/[^0-9]/g, '')) : 0);
                        }, 0) / teamMembers.length / 1000)}K`
                      : '$0K'
                    }
                  </p>
                  <p className="text-sm text-purple-600">Avg. Salary</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Team Members ({teamMembers.length})
          </h2>
          {teamMembers.length === 0 ? (
            <Card className="bg-white rounded-2xl border border-gray-100 text-center p-12">
              <div className="text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                {membershipIssue ? (
                  <>
                    <h3 className="text-lg font-medium mb-2 text-amber-600">Team Members Unavailable</h3>
                    <p className="text-sm mb-4">
                      This team was created with <strong>{team?.candidate_ids?.length || 0} members</strong>, but their profiles are no longer available in the current candidate database.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-amber-700">
                        <strong>What happened?</strong> The candidate database was likely refreshed or updated, which changed the member IDs.
                      </p>
                    </div>
                    <div className="flex justify-center space-x-3">
                      <Button 
                        onClick={() => navigate('/teams')} 
                        variant="outline"
                        className="text-gray-600 border-gray-300"
                      >
                        Back to Teams
                      </Button>
                      <Button 
                        onClick={() => navigate('/')} 
                        className="bg-[#4c4cc9] hover:bg-[#4c4cc9]/90"
                      >
                        Create New Team
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium mb-2">No team members found</h3>
                    <p className="text-sm">This team appears to be empty.</p>
                    <Button 
                      onClick={() => navigate('/')} 
                      className="mt-4 bg-[#4c4cc9] hover:bg-[#4c4cc9]/90"
                    >
                      Add Members
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {teamMembers.map((candidate) => (
              <Card key={candidate.id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  {/* Member Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#4c4cc9] to-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold">
                          {(candidate.name || 'N')[0].toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#4c4cc9] transition-colors">
                          {candidate.name || 'name not available'}
                        </h3>
                        <p className="text-sm text-gray-500">{candidate.email}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(candidate)}
                        className="text-[#4c4cc9] hover:bg-[#4c4cc9]/10"
                      >
                        View Details
                      </Button>
                                              <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCandidate(candidate.id, candidate.name)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          title="Remove from team"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  </div>

                  {/* Member Info Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{candidate.location || 'Location not specified'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{getExperience(candidate)} at {getCompany(candidate)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{getEducationLevel(candidate)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{formatSalary(candidate)} annually</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Top Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills?.slice(0, 4).map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant="secondary"
                          className="px-2 py-1 bg-[#4c4cc9]/10 text-[#4c4cc9] text-xs rounded-lg font-medium border border-[#4c4cc9]/20"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills && candidate.skills.length > 4 && (
                        <Badge variant="outline" className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-lg border border-gray-200">
                          +{candidate.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </div>

        {/* Empty State for Incomplete Team */}
        {teamMembers.length > 0 && teamMembers.length < 5 && (
          <Card className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Team Incomplete</h3>
              <p className="text-gray-500 text-sm">
                You can add {5 - teamMembers.length} more member{5 - teamMembers.length !== 1 ? 's' : ''} to complete your dream team.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Empty State for Empty Team */}
        {teamMembers.length === 0 && !membershipIssue && (
          <Card className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Team is Empty</h3>
              <p className="text-blue-600 text-sm mb-6">
                All team members have been removed. Add new members to rebuild your team.
              </p>
              <div className="flex justify-center space-x-3">
                <Button 
                  onClick={() => navigate('/teams')} 
                  variant="outline"
                  className="text-blue-600 border-blue-300"
                >
                  Back to Teams
                </Button>
                <Button 
                  onClick={() => navigate('/')} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Members
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Candidate Modal */}
      <CandidateModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md !bg-white">
          <DialogHeader>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-red-100 p-2 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <DialogTitle className="text-red-600">Remove Team Member</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to remove <strong>{candidateToRemove?.name || 'this candidate'}</strong> from the team? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={cancelRemoveCandidate}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRemoveCandidate}
              className="flex-1"
            >
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 