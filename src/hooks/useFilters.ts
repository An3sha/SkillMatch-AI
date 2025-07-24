import { useState } from 'react';

export const useFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [showSelected, setShowSelected] = useState(false);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([50000, 300000]);
  const [page, setPage] = useState(1);
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string[]>([]);
  const [educationLevelFilter, setEducationLevelFilter] = useState("all");

  const [subjectFilter, setSubjectFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [experienceLevelFilter, setExperienceLevelFilter] = useState("all");
  const [roleTypeFilter, setRoleTypeFilter] = useState("all");

  const filters = {
    searchTerm,
    sortBy,
    locationFilter,
    skillFilter,
    companyFilter,
    educationLevelFilter,
    subjectFilter,
    availabilityFilter,
    experienceLevelFilter,
    roleTypeFilter,
    salaryRange,
    showSelected
  };

  const resetPage = () => setPage(1);

  return {
    // Filter states
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
    page,
    setPage,
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
    
    // Combined filters object
    filters,
    
    // Utility functions
    resetPage
  };
}; 