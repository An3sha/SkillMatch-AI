import React from 'react';
import { Crown, Users, MapPin, Briefcase, X, Save, Trash2 } from 'lucide-react';
import { Candidate } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SelectedTeamProps {
  selectedCandidates: Candidate[];
  onDeselect: (id: string) => void;
  teamName: string;
  onTeamNameChange: (name: string) => void;
  onSaveTeam: () => void;
  onClearTeam: () => void;
  teams: Array<{
    id: string;
    name: string;
    user_id?: string;
    candidate_ids: string[];
    saved_at: string;
  }>;
  onDeleteTeam: (teamId: string) => void;
  onEditTeam: (team: {
    id: string;
    name: string;
    user_id?: string;
    candidate_ids: string[];
    saved_at: string;
  }) => void;
  onUpdateTeam: () => void;
  showTeamsList: boolean;
  currentTeamId: string | null;
  originalTeamName: string;
  originalCandidateIds: string[];
}

export const SelectedTeam: React.FC<SelectedTeamProps> = ({
  selectedCandidates,
  onDeselect,
  teamName,
  onTeamNameChange,
  onSaveTeam,
  onClearTeam,
  teams,
  onDeleteTeam,
  onEditTeam,
  onUpdateTeam,
  showTeamsList,
  currentTeamId,
  originalTeamName,
  originalCandidateIds,
}) => {
  // Check if there are any changes to enable/disable update button
  const hasChanges = React.useMemo(() => {
    if (!currentTeamId) return false;
    
    const nameChanged = teamName !== originalTeamName;
    const candidatesChanged = selectedCandidates.length !== originalCandidateIds.length ||
      !originalCandidateIds.every(id => selectedCandidates.some(c => c.id === id));
    
    return nameChanged || candidatesChanged;
  }, [currentTeamId, teamName, originalTeamName, selectedCandidates, originalCandidateIds]);

  // Show teams list only if showTeamsList is true and no candidates are currently selected
  if (showTeamsList && selectedCandidates.length === 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-900">Your Teams</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {teams.map((team) => (
            <Card key={team.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 overflow-hidden">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#4c4cc9] to-indigo-600 p-1 rounded-md">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xs font-semibold text-gray-900">{team.name}</CardTitle>
                      <p className="text-xs text-gray-500">{team.candidate_ids.length}/5 members</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTeam(team)}
                      className="p-1 text-gray-400 hover:text-[#4c4cc9] hover:bg-[#4c4cc9]/10 rounded transition-colors"
                    >
                      <Users className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTeam(team.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  Created: {new Date(team.saved_at).toLocaleDateString()}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
        
        {teams.length >= 3 && (
          <Card className="bg-yellow-50 border border-yellow-200 rounded-lg">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-yellow-100 rounded flex items-center justify-center">
                  <Crown className="w-2.5 h-2.5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-yellow-800">Team Limit Reached</h4>
                  <p className="text-xs text-yellow-700">
                    You've reached the maximum of 3 teams. Delete an existing team to create a new one.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (selectedCandidates.length === 0) {
    return (
      <Card className="bg-white rounded-lg border border-gray-200 text-center">
        <CardContent className="p-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#4c4cc9]/10 to-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-[#4c4cc9]" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Build Your Dream Team</h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Select up to 5 candidates from the list to build your perfect team.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg border border-gray-200">
      <CardHeader className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-[#4c4cc9] to-indigo-600 p-2 rounded-lg">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{selectedCandidates.length}/5 members selected</p>
            </div>
          </div>
        </div>
        
        {/* Team Name Input */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Team Name</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => onTeamNameChange(e.target.value)}
            placeholder="Enter a memorable team name..."
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#4c4cc9] focus:border-[#4c4cc9] text-xs transition-colors"
          />
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Team Members */}
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Team Members</h4>
          {selectedCandidates.map((candidate, index) => {
            return (
              <Card key={candidate.id} className="bg-gray-50 rounded-md border border-gray-100 relative hover:shadow-sm transition-shadow">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeselect(candidate.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-white rounded h-auto"
                >
                  <X className="w-3 h-3" />
                </Button>
                
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4c4cc9] to-indigo-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-gray-900 mb-0.5">{candidate.name}</h5>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{candidate.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-3 h-3" />
                          <span>{candidate.work_experiences?.[0]?.roleName || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills?.slice(0, 2).map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant="secondary"
                          className="px-1.5 py-0.5 bg-[#4c4cc9]/10 text-[#4c4cc9] text-xs rounded font-medium border border-[#4c4cc9]/20"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills?.length > 2 && (
                        <Badge variant="outline" className="px-1.5 py-0.5 bg-white text-gray-500 text-xs rounded border border-gray-200">
                          +{candidate.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Team Complete Message */}
        {selectedCandidates.length === 5 && (
          <Card className="mb-4 bg-gradient-to-r from-[#4c4cc9]/10 to-emerald-50 border border-[#4c4cc9]/20 rounded-lg">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#4c4cc9] rounded-lg flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#4c4cc9]">Team Complete! 🚀</h4>
                  <p className="text-xs text-[#4c4cc9]/80">
                    Your dream team is ready to build the next unicorn!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onClearTeam}
            className="flex-1 flex items-center justify-center space-x-1 text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-700 py-1.5 text-xs font-medium"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </Button>
          <Button
            onClick={teams.some(team => team.candidate_ids.length === selectedCandidates.length && 
              team.candidate_ids.every(id => selectedCandidates.some(c => c.id === id))) ? onUpdateTeam : onSaveTeam}
            disabled={selectedCandidates.length === 0 || (!!currentTeamId && !hasChanges)}
            className="flex-1 flex items-center justify-center space-x-1 bg-[#4c4cc9] hover:bg-[#4c4cc9]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed py-1.5 text-xs font-medium"
          >
            <Save className="w-3 h-3" />
            <span>{teams.some(team => team.candidate_ids.length === selectedCandidates.length && 
              team.candidate_ids.every(id => selectedCandidates.some(c => c.id === id))) ? 'Update' : 'Save'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};