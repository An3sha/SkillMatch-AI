import React from 'react';
import { Users, Target, Award, LogOut } from 'lucide-react';
import { Badge } from './ui/badge';

interface HeaderProps {
  selectedCount: number;
  totalCandidates: number;
  onBuildTeam: () => void;
  onShowTeams: () => void;
  teamsCount: number;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedCount, totalCandidates, onBuildTeam, onShowTeams, teamsCount, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-[#4c4cc9] to-indigo-600 p-2.5 rounded-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">100B Jobs 🚀</h1>
            <p className="text-sm text-gray-500">Find and hire top talent</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">{totalCandidates} Candidates</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-[#4c4cc9]" />
            <Badge variant="secondary" className="text-sm font-medium text-[#4c4cc9] bg-[#4c4cc9]/10">
              {selectedCount}/5 Selected
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            {teamsCount > 0 && (
              <button
                onClick={onShowTeams}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Show Your Teams ({teamsCount})
              </button>
            )}
            <button
              onClick={onBuildTeam}
              className="bg-[#4c4cc9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4c4cc9]/90 transition-colors cursor-pointer"
            >
              Build Team
            </button>
             <button
          onClick={onLogout}
          className="bg-red-400 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
          </div>
        </div>
      </div>
    </header>
  );
};