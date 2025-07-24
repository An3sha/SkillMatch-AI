import React from 'react';
import { Crown, Users, MapPin, Briefcase, X, Save, Trash2, Edit } from 'lucide-react';
import { Candidate } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SelectedTeamProps {
  selectedCandidates: Candidate[];
  onDeselect: (id: string) => void;
  onViewDetails: (candidate: Candidate) => void;
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
}

export const SelectedTeam: React.FC<SelectedTeamProps> = ({
  selectedCandidates,
  onDeselect,
  onViewDetails,
  teamName,
  onTeamNameChange,
  onSaveTeam,
  onClearTeam,
  teams,
  onDeleteTeam,
  onEditTeam,
  onUpdateTeam,
  showTeamsList,
}) => {
  // Show teams list if showTeamsList is true or if teams exist and no candidates are currently selected
  if (showTeamsList || (teams.length > 0 && selectedCandidates.length === 0)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Your Teams</h3>
          
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Card key={team.id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-[#4c4cc9]" />
                    <CardTitle className="text-lg font-semibold text-gray-900">{team.name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTeam(team)}
                      className="p-1 text-gray-400 hover:text-[#4c4cc9]"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTeam(team.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{team.candidate_ids.length}/5 members</p>
                <p className="text-xs text-gray-400">
                  Created: {new Date(team.saved_at).toLocaleDateString()}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
        
        {teams.length >= 3 && (
          <Card className="bg-yellow-50 border border-yellow-200 rounded-2xl">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-800">
                You've reached the maximum of 3 teams. Delete an existing team to create a new one.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (selectedCandidates.length === 0) {
    return (
      <Card className="bg-white rounded-2xl border border-gray-100 text-center">
        <CardContent className="p-8">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Your Team</h3>
        <p className="text-gray-500 text-sm">Select up to 5 candidates to build your dream team.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-2xl border border-gray-100">
      <CardHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-[#4c4cc9] to-indigo-600 p-3 rounded-2xl">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Your Team</CardTitle>
              <p className="text-sm text-gray-500">{selectedCandidates.length}/5 members</p>
            </div>
          </div>
        </div>
        
        {/* Team Name Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => onTeamNameChange(e.target.value)}
            placeholder="Enter team name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c4cc9] focus:border-[#4c4cc9] text-sm"
          />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Team Members */}
        <div className="space-y-4">
          {selectedCandidates.map((candidate, index) => {
            return (
              <Card key={candidate.id} className="bg-gray-50 rounded-2xl border border-gray-100 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeselect(candidate.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-white rounded-full h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
                
                <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-[#4c4cc9] text-white rounded-xl flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
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
                    {candidate.skills?.slice(0, 3).map((skill, skillIndex) => (
                      <Badge
                        key={skillIndex}
                        variant="secondary"
                        className="px-2 py-1 bg-[#4c4cc9]/10 text-[#4c4cc9] text-xs rounded-lg font-medium border border-[#4c4cc9]/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {candidate.skills?.length > 3 && (
                      <Badge variant="outline" className="px-2 py-1 bg-white text-gray-500 text-xs rounded-lg border border-gray-200">
                        +{candidate.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <Button
                    variant="link"
                    onClick={() => onViewDetails(candidate)}
                    className="text-[#4c4cc9] hover:text-[#4c4cc9]/80 text-sm font-medium transition-colors p-0 h-auto"
                  >
                    View
                  </Button>
                </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Team Complete Message */}
        {selectedCandidates.length === 5 && (
          <Card className="mt-6 bg-gradient-to-r from-[#4c4cc9]/10 to-emerald-50 border border-[#4c4cc9]/20 rounded-2xl">
            <CardContent className="p-5">
            <div className="flex items-center space-x-3">
              <Crown className="w-5 h-5 text-[#4c4cc9]" />
              <h3 className="font-semibold text-[#4c4cc9]">Team Complete!</h3>
            </div>
            <p className="text-sm text-[#4c4cc9]/80 mt-2">
              Your dream team is ready to build the next unicorn! 🚀
            </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onClearTeam}
            className="flex-1 flex items-center justify-center space-x-2 text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </Button>
          <Button
            onClick={teams.some(team => team.candidate_ids.length === selectedCandidates.length && 
              team.candidate_ids.every(id => selectedCandidates.some(c => c.id === id))) ? onUpdateTeam : onSaveTeam}
            disabled={selectedCandidates.length === 0}
            className="flex-1 flex items-center justify-center space-x-2 bg-[#4c4cc9] hover:bg-[#4c4cc9]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{teams.some(team => team.candidate_ids.length === selectedCandidates.length && 
              team.candidate_ids.every(id => selectedCandidates.some(c => c.id === id))) ? 'Update Team' : 'Save Team'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};