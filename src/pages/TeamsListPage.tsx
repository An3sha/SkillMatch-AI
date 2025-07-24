import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Users, Eye, Trash2, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useTeamsContext } from '../context/TeamsContext';

export const TeamsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { teams = [], handleDeleteTeam } = useTeamsContext();

  const handleViewTeam = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleCreateTeam = () => {
    navigate('/');
    // We could add a query parameter or state to open team builder
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
                onClick={handleBackToDashboard}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-[#4c4cc9] to-indigo-600 p-3 rounded-2xl">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Your Teams</h1>
                  <p className="text-gray-600 mt-1">
                    {teams.length} team{teams.length !== 1 ? 's' : ''} created
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleCreateTeam}
              className="bg-[#4c4cc9] hover:bg-[#4c4cc9]/90 text-white flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Team</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Teams Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {teams.length === 0 ? (
          <Card className="bg-white rounded-2xl border border-gray-100 text-center">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Teams Created Yet</h3>
              <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
                Start building your dream teams by selecting candidates from the dashboard.
              </p>
              <Button
                onClick={handleCreateTeam}
                className="bg-[#4c4cc9] hover:bg-[#4c4cc9]/90 text-white flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Team</span>
              </Button>
              <p className="text-xs text-gray-400 mt-4">
                You can create up to 3 teams with 5 candidates each.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card key={team.id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-[#4c4cc9] to-indigo-600 p-2 rounded-xl">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[#4c4cc9] transition-colors">
                            {team.name}
                          </CardTitle>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTeam(team.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{team.candidate_ids.length}/5 members</span>
                      </div>
                      
                      <p className="text-xs text-gray-400">
                        Created: {new Date(team.saved_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <Button
                      onClick={() => handleViewTeam(team.id)}
                      className="w-full mt-6 bg-[#4c4cc9] hover:bg-[#4c4cc9]/90 text-white rounded-xl py-3 flex items-center justify-center space-x-2 transition-all group-hover:shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Team Details</span>
                    </Button>
                  </CardHeader>
                </Card>
              ))}
            </div>

                          {teams.length >= 3 && (
              <Card className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-amber-700 mb-2">
                    <Crown className="w-5 h-5" />
                    <h3 className="font-semibold">Team Limit Reached</h3>
                  </div>
                  <p className="text-sm text-amber-600">
                    You've reached the maximum of 3 teams. Delete an existing team to create a new one.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}; 