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
  } h-[280px] flex flex-col`}>
      <CardContent className="p-3 flex-1 flex flex-col min-h-0">
        {/* Header with Name and Salary - Fixed Height */}
        <div className="flex items-start justify-between mb-3 h-[65px]">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate leading-tight mb-1">
              {candidate.name || 'name not available'}
            </h3>
            <div className="text-xs text-gray-600 truncate mb-1">
              {candidate.email || 'No information available'}
            </div>
            <div className="flex items-center text-xs text-gray-500 font-normal">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0 text-[#4c4cc9]" />
              <span className="truncate text-[#4c4cc9]">
                {candidate.location || 'No information available'}
              </span>
            </div>
          </div>
          {/* Salary Pill */}
          <div className="ml-2 flex-shrink-0">
            {candidate.annual_salary_expectation?.['full-time'] ? (
              <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
                {formatSalary(candidate.annual_salary_expectation['full-time'])}/year
              </div>
            ) : (
              <div className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium border border-gray-200">
                No salary info
              </div>
            )}
          </div>
        </div>

       

        {/* Experience and Education Row - Fixed Height */}
        <div className="grid grid-cols-2 gap-2 mb-3 h-[55px]">
          <div className="space-y-0.5 overflow-hidden">
            <div className="flex items-center text-[10px] text-gray-500 font-medium">
              <Briefcase className="w-3 h-3 mr-1" />
              EXPERIENCE
            </div>
            {candidate.work_experiences && candidate.work_experiences.length > 0 ? (
              <>
                <div className="text-xs font-semibold text-gray-900">
                  {calculateYearsOfExperience()} pos
                </div>
                <div className="text-[11px] text-gray-900 truncate">
                  {candidate.work_experiences[0]?.roleName || 'No information available'}
                </div>
              </>
            ) : (
              <div className="text-[11px] text-gray-500 italic">
                No information available
              </div>
            )}
          </div>
          
          <div className="space-y-0.5 overflow-hidden">
            <div className="flex items-center text-[10px] text-gray-500 font-medium">
              <GraduationCap className="w-3 h-3 mr-1" />
              EDUCATION
            </div>
            {candidate.education?.highest_level ? (
              <>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-semibold text-gray-900 truncate">
                    {candidate.education.highest_level}
                  </span>
                  {candidate.education?.degrees?.[0]?.isTop50 && (
                    <Star className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  )}
                </div>
                <div className="text-[11px] text-gray-900 truncate">
                  {candidate.education?.degrees?.[0]?.subject || 'No information available'}
                </div>
              </>
            ) : (
              <div className="text-[11px] text-gray-500 italic">
                No information available
              </div>
            )}
          </div>
        </div>

        {/* Skills - Fixed Height */}
        <div className="mb-3 h-[60px] overflow-hidden">
          <div className="text-[10px] text-gray-500 font-medium mb-1">SKILLS</div>
          {candidate.skills && candidate.skills.length > 0 ? (
            <div className="flex gap-1 overflow-hidden">
              {candidate.skills?.slice(0, 6).map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-2 py-0.5 bg-gradient-to-r from-indigo-50 to-[#4c4cc9]/10 text-indigo-700 text-[10px] font-medium border border-indigo-200 rounded-full hover:from-indigo-100 hover:to-[#4c4cc9]/20 transition-all flex-shrink-0"
                >
                  {skill}
                </Badge>
              ))}
              {candidate.skills?.length > 6 && (
                <Badge 
                  variant="outline" 
                  className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] border-gray-200 rounded-full hover:bg-gray-100 transition-all flex-shrink-0"
                >
                  +{candidate.skills.length - 6}
                </Badge>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-gray-500 italic">
              No information available
            </div>
          )}
        </div>
      </CardContent>

      {/* Actions - Fixed at bottom */}
      <div className="p-3 pt-0 flex items-center gap-2 mt-auto">
        <Button
          variant="outline"
          onClick={() => onViewDetails(candidate)}
          className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300 font-medium transition-all text-xs rounded-lg h-8"
        >
          View Details
        </Button>
        <Button
          onClick={() => onSelect(candidate.id)}
          className={`px-4 font-medium transition-all text-xs rounded-lg h-8 ${
            isSelected
              ? 'bg-[#4c4cc9] hover:bg-[#4c4cc9]/90 text-white shadow-lg'
              : 'bg-[#4c4cc9] hover:bg-[#4c4cc9]/90 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isSelected ? '\u2713 Selected' : 'Select'}
        </Button>
      </div>
      
    </Card>
  );
};