import React from 'react';
import { Search, Users, MapPin, X, SlidersHorizontal, DollarSign } from 'lucide-react';
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
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  showSelected: boolean;
  setShowSelected: (show: boolean) => void;
  salaryRange: [number, number];
  setSalaryRange: (range: [number, number]) => void;
  selectedCount: number;
  onUnselectAll: () => void;
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
}) => {
  const handleSalaryChange = (index: number, value: string) => {
    const numValue = parseInt(value) * 1000;
    const newRange: [number, number] = [...salaryRange];
    newRange[index] = numValue;
    setSalaryRange(newRange);
  };

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
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="International">International</SelectItem>
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#4c4cc9] focus:border-[#4c4cc9] h-auto bg-white"
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#4c4cc9] focus:border-[#4c4cc9] h-auto bg-white"
                />
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