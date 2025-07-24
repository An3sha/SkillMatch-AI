import React from 'react';
import { Search, Users, MapPin, X, SlidersHorizontal, DollarSign, Building, Code } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface FilterPanelProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  showSelected: boolean;
  setShowSelected: (show: boolean) => void;
  salaryRange: [number, number];
  setSalaryRange: (range: [number, number]) => void;
  selectedCount: number;
  onUnselectAll: () => void;
  skillFilter: string;
  setSkillFilter: (skill: string) => void;
  companyFilter: string;
  setCompanyFilter: (company: string) => void;
  availableSkills: string[];
  availableLocations: string[];
  availableCompanies: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  locationFilter,
  setLocationFilter,
  showSelected,
  setShowSelected,
  salaryRange,
  setSalaryRange,
  selectedCount,
  onUnselectAll,
  skillFilter,
  setSkillFilter,
  companyFilter,
  setCompanyFilter,
  availableSkills,
  availableLocations,
  availableCompanies,
}) => {
  return (
    <div className="w-1/4 bg-white border-r border-gray-100 p-4 space-y-4 flex-shrink-0 min-h-screen">
      {/* Selected Candidates Section */}
      {selectedCount > 0 && (
        <div className="bg-gradient-to-br from-[#4c4cc9]/5 to-indigo-50 rounded-xl p-4 border border-[#4c4cc9]/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#4c4cc9]" />
              <span className="text-sm font-semibold text-gray-900">Selected Team</span>
            </div>
            <Badge variant="secondary" className="bg-[#4c4cc9] text-white px-2 py-1 rounded-full text-xs font-semibold">
              {selectedCount}/5
            </Badge>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={() => setShowSelected(!showSelected)}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                showSelected
                  ? 'bg-[#4c4cc9] hover:bg-[#4c4cc9]/90 text-white shadow-lg'
                  : 'border-[#4c4cc9]/20 bg-[#4c4cc9]/10 text-[#4c4cc9] hover:bg-[#4c4cc9]/20'
              }`}
            >
              {showSelected ? 'Back to All' : 'View Selected'}
            </Button>
            
            <Button
              onClick={onUnselectAll}
              variant="outline"
              className="w-full py-2 rounded-lg text-sm font-medium border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
          <SlidersHorizontal className="w-4 h-4 text-[#4c4cc9]" />
          <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700">Search Candidates</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Name, skills, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4c4cc9] focus:border-[#4c4cc9] transition-all text-sm bg-gray-50"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700">Sort by</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#4c4cc9] focus:border-[#4c4cc9] text-sm bg-gray-50">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="!opacity-100 !visible z-50 bg-white">
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="submitted">Recently Applied</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>Location</span>
          </Label>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#4c4cc9] focus:border-[#4c4cc9] text-sm bg-gray-50">
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent className="!opacity-100 !visible z-50 bg-white">
              <SelectItem value="all">All Locations</SelectItem>
              {availableLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <Code className="w-3 h-3" />
            <span>Skills</span>
          </Label>
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#4c4cc9] focus:border-[#4c4cc9] text-sm bg-gray-50">
              <SelectValue placeholder="All skills" />
            </SelectTrigger>
            <SelectContent className="!opacity-100 !visible z-50 bg-white">
              <SelectItem value="all">All Skills</SelectItem>
              {availableSkills.map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Company */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <Building className="w-3 h-3" />
            <span>Company</span>
          </Label>
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#4c4cc9] focus:border-[#4c4cc9] text-sm bg-gray-50">
              <SelectValue placeholder="All companies" />
            </SelectTrigger>
            <SelectContent className="!opacity-100 !visible z-50 bg-white">
              <SelectItem value="all">All Companies</SelectItem>
              {availableCompanies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <DollarSign className="w-3 h-3 text-emerald-600" />
            <span>Salary Range</span>
          </Label>
          
          <Select 
            value={salaryRange[0] === 50000 && salaryRange[1] === 300000 ? "all" : `${salaryRange[0]}-${salaryRange[1]}`}
            onValueChange={(value) => {
              if (value === "all") {
                setSalaryRange([50000, 300000]);
              } else {
                const [min, max] = value.split('-').map(v => parseInt(v));
                setSalaryRange([min, max]);
              }
            }}
          >
            <SelectTrigger className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#4c4cc9] focus:border-[#4c4cc9] text-sm bg-gray-50">
              <SelectValue placeholder="All salary ranges" />
            </SelectTrigger>
            <SelectContent className="!opacity-100 !visible z-50 bg-white">
              <SelectItem value="all">All Salary Ranges</SelectItem>
              <SelectItem value="50000-80000">$50k - $80k</SelectItem>
              <SelectItem value="80000-120000">$80k - $120k</SelectItem>
              <SelectItem value="120000-160000">$120k - $160k</SelectItem>
              <SelectItem value="160000-200000">$160k - $200k</SelectItem>
              <SelectItem value="200000-250000">$200k - $250k</SelectItem>
              <SelectItem value="250000-300000">$250k - $300k</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};