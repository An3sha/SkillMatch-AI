import React from 'react';
import { MapPin, Briefcase, GraduationCap, Star } from 'lucide-react';
import { Candidate } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface CandidateCardProps {
  candidate: Candidate;
  onSelect: (id: string) => void;
  onViewDetails: (candidate: Candidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onSelect,
  onViewDetails,
}) => {
  const isSelected = candidate.isSelected;

  const formatSalary = (salaryStr: string) => {
    return salaryStr.replace(/\$(\d+)/, (match, number) => {
      const num = parseInt(number);
      return num >= 1000 ? `$${(num / 1000).toFixed(0)}k` : match;
    });
  };

  const calculateYearsOfExperience = () => {
    return candidate.work_experiences?.length || 0;
  };

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl ${
      isSelected 
        ? 'bg-gradient-to-br from-[#4c4cc9]/10 to-indigo-50 border-[#4c4cc9]/20' 
        : 'bg-white hover:border-gray-300 border-blue-200'
  } h-[240px] flex flex-col`}> {/* further reduced height */}
      <CardContent className="p-3 flex-1 flex flex-col">
        {/* Header with Name and Salary */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate leading-tight mb-0.5">{candidate.name}</h3>
            <div className="flex items-center text-xs text-gray-500 font-normal">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0 text-[#4c4cc9]" />
              <span className="truncate text-[#4c4cc9]">{candidate.location}</span>
            </div>
          </div>
           {/* Salary Pill */}
        {candidate.annual_salary_expectation['full-time'] && (
          <div className="mb-1">
            <div className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs border border-green-200">
              {formatSalary(candidate.annual_salary_expectation['full-time'])}/year
            </div>
          </div>
        )}
        </div>

       

        {/* Experience and Education Row */}
        <div className="grid grid-cols-2 gap-1 mb-1">
          {candidate.work_experiences && candidate.work_experiences.length > 0 && (
            <div className="space-y-0.5">
              <div className="flex items-center text-[10px] text-gray-500 font-medium">
                <Briefcase className="w-3 h-3 mr-1" />
                EXPERIENCE
              </div>
              <div className="text-xs font-semibold text-gray-900">
                {calculateYearsOfExperience()} positions
              </div>
              <div className="text-[11px] text-gray-900 truncate">
                {candidate.work_experiences[0]?.roleName || 'N/A'}
              </div>
            </div>
          )}
          {candidate.education?.highest_level && (
            <div className="space-y-0.5">
              <div className="flex items-center text-[10px] text-gray-500 font-medium">
                <GraduationCap className="w-3 h-3 mr-1" />
                EDUCATION
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-semibold text-gray-900 truncate">
                  {candidate.education.highest_level}
                </span>
                {candidate.education?.degrees?.[0]?.isTop50 && (
                  <Star className="w-3 h-3 text-amber-500 flex-shrink-0" />
                )}
              </div>
              {candidate.education?.degrees?.[0] && (
                <div className="text-[11px] text-gray-900 truncate">
                  {candidate.education.degrees[0].subject}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Skills */}
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="flex-1 mb-1">
            <div className="text-[10px] text-gray-500 font-medium mb-0.5">SKILLS</div>
            <div className="flex flex-wrap gap-1">
              {candidate.skills?.slice(0, 4).map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-2 py-0.5 bg-gradient-to-r from-indigo-50 to-[#4c4cc9]/10 text-indigo-700 text-[10px] font-medium border border-indigo-200 rounded-full hover:from-indigo-100 hover:to-[#4c4cc9]/20 transition-all"
                >
                  {skill}
                </Badge>
              ))}
              {candidate.skills?.length > 4 && (
                <Badge 
                  variant="outline" 
                  className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] border-gray-200 rounded-full hover:bg-gray-100 transition-all"
                >
                  +{candidate.skills.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Actions - Fixed at bottom */}
      <div className="p-2 pt-0 flex items-center gap-1">
        <Button
          variant="outline"
          onClick={() => onViewDetails(candidate)}
          className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300 font-medium transition-all py-1 text-xs rounded-md h-7 min-w-0"
        >
          View
        </Button>
        <Button
          onClick={() => onSelect(candidate.id)}
          className={`px-3 font-medium transition-all py-1 text-xs rounded-md h-7 min-w-0 ${
            isSelected
              ? 'bg-[#4c4cc9] hover:bg-[#4c4cc9]/90 text-white shadow-lg text-xs'
              : 'bg-[#4c4cc9] hover:bg-[#4c4cc9]/90 text-white shadow-lg hover:shadow-xl text-xs'
          }`}
        >
          {isSelected ? '\u2713' : 'Select'}
        </Button>
      </div>
      
    </Card>
  );
};