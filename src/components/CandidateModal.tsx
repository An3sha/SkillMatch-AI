import React from 'react';
import { MapPin, Mail, Phone, Calendar, Briefcase, GraduationCap, Award } from 'lucide-react';
import { Candidate } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface CandidateModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen || !candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-xl max-w-3xl w-full max-h-[75vh] overflow-y-auto shadow-2xl p-0">
        {/* Header */}
        <DialogHeader className="flex flex-col items-center justify-center p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="text-center">
            <DialogTitle className="text-lg font-semibold text-gray-900">{candidate.name}</DialogTitle>
            <div className="flex items-center justify-center space-x-3 mt-1 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-60">{candidate.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>{candidate.phone}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Left Side - Education & Work Experience */}
            <div className="space-y-3">
              {/* Work Experience */}
              {candidate.work_experiences && candidate.work_experiences.length > 0 && (
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="pb-1.5">
                    <CardTitle className="flex items-center space-x-2 text-sm">
                      <div className="bg-blue-50 p-1 rounded-lg">
                        <Briefcase className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-900">Work Experience</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1.5">
                      {candidate.work_experiences?.map((exp, index) => (
                        <div key={index} className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                          <h4 className="font-semibold text-gray-900 text-xs">{exp.roleName}</h4>
                          <p className="text-xs text-gray-600 mt-0.5">{exp.company}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {candidate.education?.degrees && candidate.education.degrees.length > 0 && (
                <Card className="bg-gradient-to-br from-blue-30 to-white border border-blue-100 shadow-sm">
                  <CardHeader className="pb-1.5">
                    <CardTitle className="flex items-center space-x-2 text-sm">
                      <div className="bg-emerald-50 p-1 rounded-lg">
                        <GraduationCap className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="font-semibold text-gray-900">Education</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1.5">
                      {candidate.education?.degrees?.map((degree: { degree: string; subject: string; school: string; isTop50?: boolean }, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-2 border border-blue-200">
                          <div className="flex items-center space-x-1.5 mb-1">
                            <h4 className="font-semibold text-gray-900 text-xs">{degree.degree}</h4>
                            {degree.isTop50 && (
                              <Badge className="px-1 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                Top 50
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-0.5">{degree.subject}</p>
                          <p className="text-xs text-gray-500">{degree.school}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Side - Overview, Salary, Skills, Applied Date */}
            <div className="space-y-2">
              {/* Overview */}
              <Card className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-1.5">
                  <CardTitle className="text-xs font-semibold text-gray-900">Overview</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Experience</span>
                      <span className="font-medium text-gray-900 text-xs">{candidate.work_experiences?.length || 0} roles</span>
                    </div>
                    {candidate.education?.highest_level && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Education</span>
                        <span className="font-medium text-gray-900 text-xs">{candidate.education.highest_level}</span>
                      </div>
                    )}
                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Skills</span>
                        <span className="font-medium text-gray-900 text-xs">{candidate.skills.length} skills</span>
                      </div>
                    )}
                    {candidate.work_availability && candidate.work_availability.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Availability</span>
                        <span className="font-medium text-gray-900 text-xs">{candidate.work_availability.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Salary */}
              {candidate.annual_salary_expectation['full-time'] && (
                <Card className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 shadow-sm">
                  <CardHeader className="pb-1.5">
                    <CardTitle className="flex items-center space-x-2 text-xs">
                      <span className="font-semibold text-gray-900">Salary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-base font-bold text-gray-900 mb-0.5">
                      {candidate.annual_salary_expectation['full-time']}
                    </div>
                    <div className="text-xs text-gray-600">Annual, full-time</div>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {candidate.skills && candidate.skills.length > 0 && (
                <Card className="border border-blue-200 shadow-sm">
                  <CardHeader className="pb-1.5">
                    <CardTitle className="flex items-center space-x-2 text-xs">
                      <div className="bg-[#4c4cc9]/10 p-1 rounded-lg">
                        <Award className="w-3 h-3 text-[#4c4cc9]" />
                      </div>
                      <span className="font-semibold text-gray-900">Skills</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills?.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Application Date */}
              <Card className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 shadow-sm">
                <CardHeader className="pb-1.5">
                  <CardTitle className="flex items-center space-x-2 text-xs">
                    <Calendar className="w-3 h-3 text-blue-600" />
                    <span className="font-semibold text-gray-900">Applied</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-gray-600">
                    {new Date(candidate.submitted_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Button - Bottom Right */}
          <div className="flex justify-end mt-3 pt-2 border-t border-gray-100">
            <Button
              onClick={() => onSelect(candidate.id)}
              className={`py-2 px-4 rounded-lg font-semibold transition-all text-xs h-auto ${
                candidate.isSelected
                  ? 'bg-[#4c4cc9] hover:bg-[#4c4cc9]/90 text-white shadow-lg'
                  : 'bg-[#4c4cc9] hover:bg-[#4c4cc9]/90 text-white shadow-lg'
              }`}
            >
              {candidate.isSelected ? '✓ Selected' : 'Select Candidate'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};