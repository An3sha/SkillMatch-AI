import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Users, MapPin, X, SlidersHorizontal, DollarSign, Building, Code, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';

interface FilterPanelProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  locationFilter: string[];
  setLocationFilter: (locations: string[]) => void;
  showSelected: boolean;
  setShowSelected: (show: boolean) => void;
  salaryRange: [number, number];
  setSalaryRange: (range: [number, number]) => void;
  selectedCount: number;
  onUnselectAll: () => void;
  skillFilter: string[];
  setSkillFilter: (skills: string[]) => void;
  companyFilter: string[];
  setCompanyFilter: (companies: string[]) => void;
  educationLevelFilter: string;
  setEducationLevelFilter: (level: string) => void;

  subjectFilter: string;
  setSubjectFilter: (subject: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (availability: string) => void;
  experienceLevelFilter: string;
  setExperienceLevelFilter: (level: string) => void;
  roleTypeFilter: string;
  setRoleTypeFilter: (role: string) => void;
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
  educationLevelFilter,
  setEducationLevelFilter,
  subjectFilter,
  setSubjectFilter,
  availabilityFilter,
  setAvailabilityFilter,
  experienceLevelFilter,
  setExperienceLevelFilter,
  roleTypeFilter,
  setRoleTypeFilter,
  availableSkills,
  availableLocations,
  availableCompanies,
}) => {
    const [locationSearch, setLocationSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const skillRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);

  // Search input debouncing
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);



  // Sync local search term with props when it changes externally
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounced search handler
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchTerm(value);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout to update the actual search after 400ms
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
    }, 400);
  }, [setSearchTerm]);



  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (skillRef.current && !skillRef.current.contains(event.target as Node)) {
        setShowSkillDropdown(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target as Node)) {
        setShowCompanyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSalaryChange = (index: number, value: string) => {
    const numValue = parseInt(value) * 1000;
    const newRange: [number, number] = [...salaryRange];
    newRange[index] = numValue;
    setSalaryRange(newRange);
  };

  const toggleLocation = (location: string) => {
    const newLocations = locationFilter.includes(location)
      ? locationFilter.filter(l => l !== location)
      : [...locationFilter, location];
    setLocationFilter(newLocations);
  };

  const toggleSkill = (skill: string) => {
    const newSkills = skillFilter.includes(skill)
      ? skillFilter.filter(s => s !== skill)
      : [...skillFilter, skill];
    setSkillFilter(newSkills);
  };

  const toggleCompany = (company: string) => {
    const newCompanies = companyFilter.includes(company)
      ? companyFilter.filter(c => c !== company)
      : [...companyFilter, company];
    setCompanyFilter(newCompanies);
  };

  const filteredLocations = availableLocations.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredSkills = availableSkills.filter(skill =>
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const filteredCompanies = availableCompanies.filter(company =>
    company.toLowerCase().includes(companySearch.toLowerCase())
  );

  const clearAllFilters = () => {
    setSearchTerm("");
    setLocalSearchTerm(""); // Clear local search state
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current); // Clear any pending search timeout
    }
    setLocationFilter([]);
    setSkillFilter([]);
    setCompanyFilter([]);
    setEducationLevelFilter("all");
    setSubjectFilter("all");
    setAvailabilityFilter("all");
    setExperienceLevelFilter("all");
    setRoleTypeFilter("all");
    setSalaryRange([50000, 300000]);
    setSortBy("name");
  };

  const hasActiveFilters = searchTerm || locationFilter.length > 0 || skillFilter.length > 0 || 
    companyFilter.length > 0 || educationLevelFilter !== "all" || 
    subjectFilter !== "all" || availabilityFilter !== "all" || experienceLevelFilter !== "all" || 
    roleTypeFilter !== "all" || salaryRange[0] !== 50000 || salaryRange[1] !== 300000;

  return (
    <div className="w-1/4 bg-white border-r border-gray-100 flex-shrink-0 h-full flex flex-col overflow-y-auto custom-scrollbar">
      {/* Selected Candidates Section */}
      {selectedCount > 0 && (
        <div className="bg-gradient-to-br from-[#4c4cc9]/5 to-indigo-50 rounded-xl p-4 border border-[#4c4cc9]/10 mx-4 mt-4">
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
      <div 
        className="flex-1 space-y-4 pb-16 px-4 pt-4" 
      >
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-[#4c4cc9]" />
            <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
          </div>
          {hasActiveFilters && (
            <Button
              onClick={clearAllFilters}
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1 h-auto border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-300"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700">Search Candidates</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Name, email, skills, education, roles..."
              value={localSearchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl focus:outline-none focus:border-[#4c4cc9] transition-all text-sm bg-gray-50"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700">Sort by</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4c4cc9] text-sm bg-gray-50">
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

        {/* Location Multi-Select */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>Location</span>
          </Label>
          <div className="relative" ref={locationRef}>
            <div 
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4c4cc9] text-sm bg-gray-50 cursor-pointer"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            >
              {locationFilter.length === 0 ? (
                <span className="text-gray-500">All locations</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {locationFilter.slice(0, 2).map(location => (
                    <Badge 
                      key={location} 
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 group"
                    >
                      <span className="truncate max-w-[80px]">{location}</span>
                      <X 
                        className="w-3.5 h-3.5 cursor-pointer text-blue-500 hover:text-blue-700 hover:bg-blue-200 rounded-full p-0.5 transition-all duration-150 group-hover:bg-blue-200" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLocation(location);
                        }}
                      />
                    </Badge>
                  ))}
                  {locationFilter.length > 2 && (
                    <Badge className="bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium px-2.5 py-1 rounded-lg">
                      +{locationFilter.length - 2} more
                    </Badge>
                  )}
                </div>
              )}
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
            
            {showLocationDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar-dark">
                <div className="p-2">
                  <Input
                    placeholder="Search locations..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto custom-scrollbar-dark">
                  {filteredLocations.map((location) => (
                    <div
                      key={location}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleLocation(location)}
                    >
                      <span className="text-sm">{location}</span>
                      {locationFilter.includes(location) && (
                        <Badge variant="secondary" className="text-xs">✓</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skills Multi-Select */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <Code className="w-3 h-3" />
            <span>Skills</span>
          </Label>
          <div className="relative" ref={skillRef}>
            <div 
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4c4cc9] text-sm bg-gray-50 cursor-pointer"
              onClick={() => setShowSkillDropdown(!showSkillDropdown)}
            >
              {skillFilter.length === 0 ? (
                <span className="text-gray-500">All skills</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {skillFilter.slice(0, 2).map(skill => (
                    <Badge 
                      key={skill} 
                      className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all duration-200 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 group"
                    >
                      <span className="truncate max-w-[80px]">{skill}</span>
                      <X 
                        className="w-3.5 h-3.5 cursor-pointer text-green-500 hover:text-green-700 hover:bg-green-200 rounded-full p-0.5 transition-all duration-150 group-hover:bg-green-200" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSkill(skill);
                        }}
                      />
                    </Badge>
                  ))}
                  {skillFilter.length > 2 && (
                    <Badge className="bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium px-2.5 py-1 rounded-lg">
                      +{skillFilter.length - 2} more
                    </Badge>
                  )}
                </div>
              )}
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
            
            {showSkillDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar-dark">
                <div className="p-2">
                  <Input
                    placeholder="Search skills..."
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto custom-scrollbar-dark">
                  {filteredSkills.map((skill) => (
                    <div
                      key={skill}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleSkill(skill)}
                    >
                      <span className="text-sm">{skill}</span>
                      {skillFilter.includes(skill) && (
                        <Badge variant="secondary" className="text-xs">✓</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Company Multi-Select */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <Building className="w-3 h-3" />
            <span>Company</span>
          </Label>
          <div className="relative" ref={companyRef}>
            <div 
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4c4cc9] text-sm bg-gray-50 cursor-pointer"
              onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
            >
              {companyFilter.length === 0 ? (
                <span className="text-gray-500">All companies</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {companyFilter.slice(0, 2).map(company => (
                    <Badge 
                      key={company} 
                      className="bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border border-purple-200 hover:from-purple-100 hover:to-violet-100 hover:border-purple-300 transition-all duration-200 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 group"
                    >
                      <span className="truncate max-w-[80px]">{company}</span>
                      <X 
                        className="w-3.5 h-3.5 cursor-pointer text-purple-500 hover:text-purple-700 hover:bg-purple-200 rounded-full p-0.5 transition-all duration-150 group-hover:bg-purple-200" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompany(company);
                        }}
                      />
                    </Badge>
                  ))}
                  {companyFilter.length > 2 && (
                    <Badge className="bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium px-2.5 py-1 rounded-lg">
                      +{companyFilter.length - 2} more
                    </Badge>
                  )}
                </div>
              )}
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
            
                         {showCompanyDropdown && (
               <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar-dark">
                 <div className="p-2">
                   <Input
                     placeholder="Search companies..."
                     value={companySearch}
                     onChange={(e) => setCompanySearch(e.target.value)}
                     className="text-sm"
                   />
                 </div>
                 <div className="max-h-40 overflow-y-auto custom-scrollbar-dark">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleCompany(company)}
                    >
                      <span className="text-sm">{company}</span>
                      {companyFilter.includes(company) && (
                        <Badge variant="secondary" className="text-xs">✓</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Education Level */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <span>🎓</span>
            <span>Education Level</span>
          </Label>
          <Select value={educationLevelFilter} onValueChange={setEducationLevelFilter}>
            <SelectTrigger className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4c4cc9] text-sm bg-gray-50">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent className="!opacity-100 !visible z-50 bg-white">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
              <SelectItem value="Master's Degree">Master's Degree</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
              <SelectItem value="Associate Degree">Associate Degree</SelectItem>
              <SelectItem value="High School">High School</SelectItem>
            </SelectContent>
          </Select>
        </div>



        {/* Subject/Major */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <span>📚</span>
            <span>Major/Subject</span>
          </Label>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4c4cc9] text-sm bg-gray-50">
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent className="!opacity-100 !visible z-50 bg-white">
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Law">Law</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Work Availability */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <span>⏰</span>
            <span>Availability</span>
          </Label>
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4c4cc9] text-sm bg-gray-50">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent className="!opacity-100 !visible z-50 bg-white">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <span>💼</span>
            <span>Experience Level</span>
          </Label>
          <Select value={experienceLevelFilter} onValueChange={setExperienceLevelFilter}>
            <SelectTrigger className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4c4cc9] text-sm bg-gray-50">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent className="!opacity-100 !visible z-50 bg-white">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
              <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
              <SelectItem value="senior">Senior Level (6+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Role Type */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <span>🚀</span>
            <span>Role Type</span>
          </Label>
          <Select value={roleTypeFilter} onValueChange={setRoleTypeFilter}>
            <SelectTrigger className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4c4cc9] text-sm bg-gray-50">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent className="!opacity-100 !visible z-50 bg-white">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Developer">Developer</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Engineer">Engineer</SelectItem>
              <SelectItem value="Designer">Designer</SelectItem>
              <SelectItem value="Analyst">Analyst</SelectItem>
              <SelectItem value="Scientist">Scientist</SelectItem>
              <SelectItem value="Administrator">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Salary Range */}
        <div className="space-y-3">
          <Label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <DollarSign className="w-3 h-3 text-emerald-600" />
            <span>Salary Range</span>
          </Label>
          
          <div className="space-y-3">
            {/* Salary Slider */}
            <Slider
              value={[salaryRange[0] / 1000, salaryRange[1] / 1000]}
              onValueChange={(value) => setSalaryRange([value[0] * 1000, value[1] * 1000])}
              max={300}
              min={50}
              step={10}
              className="w-full"
            />
            
            {/* Min/Max Inputs */}
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <Label className="block text-xs text-gray-500 mb-1">Min ($k)</Label>
                <Input
                  type="number"
                  min="50"
                  max="300"
                  step="10"
                  value={salaryRange[0] / 1000}
                  onChange={(e) => handleSalaryChange(0, e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4c4cc9] h-auto bg-white"
                />
              </div>
              <div className="flex-1">
                <Label className="block text-xs text-gray-500 mb-1">Max ($k)</Label>
                <Input
                  type="number"
                  min="50"
                  max="300"
                  step="10"
                  value={salaryRange[1] / 1000}
                  onChange={(e) => handleSalaryChange(1, e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4c4cc9] h-auto bg-white"
                />
              </div>
            </div>
            
            {/* Preset Salary Ranges */}
            <div className="space-y-2">
              <Label className="block text-xs text-gray-500">Quick Ranges</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSalaryRange([50000, 80000])}
                  className="text-xs py-1 h-auto bg-gray-50 hover:bg-gray-100"
                >
                  $50k-80k
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSalaryRange([80000, 120000])}
                  className="text-xs py-1 h-auto bg-gray-50 hover:bg-gray-100"
                >
                  $80k-120k
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSalaryRange([120000, 180000])}
                  className="text-xs py-1 h-auto bg-gray-50 hover:bg-gray-100"
                >
                  $120k-180k
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSalaryRange([180000, 300000])}
                  className="text-xs py-1 h-auto bg-gray-50 hover:bg-gray-100"
                >
                  $180k+
                </Button>
              </div>
            </div>
            
            {/* Salary Display */}
            <div className="text-xs text-gray-500 text-center">
              ${(salaryRange[0] / 1000).toFixed(0)}k - ${(salaryRange[1] / 1000).toFixed(0)}k annually
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};