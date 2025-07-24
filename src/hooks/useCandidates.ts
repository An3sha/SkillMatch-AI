import { useState, useEffect, useMemo } from 'react';
import { supabase } from './useAuth';
import { Candidate, WorkExperience, Education, Degree } from '../types';

export interface FilterState {
  searchTerm: string;
  sortBy: string;
  locationFilter: string[];
  skillFilter: string[];
  companyFilter: string[];
  educationLevelFilter: string;
  subjectFilter: string;
  availabilityFilter: string;
  experienceLevelFilter: string;
  roleTypeFilter: string;
  salaryRange: [number, number];
  showSelected: boolean;
}

export const useCandidates = (
  selectedCandidates: Set<string>,
  filters: FilterState,
  page: number
) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);

  // Check if we have active filters that require client-side processing
  const hasActiveFilters = () => {
    return filters.searchTerm || 
               filters.locationFilter.length > 0 ||
    filters.skillFilter.length > 0 ||
    filters.companyFilter.length > 0 ||
    filters.educationLevelFilter !== "all" ||
    filters.subjectFilter !== "all" || 
           filters.availabilityFilter !== "all" || 
           filters.experienceLevelFilter !== "all" || 
           filters.roleTypeFilter !== "all" || 
           filters.salaryRange[0] !== 50000 || 
           filters.salaryRange[1] !== 300000;
  };

  // Smart fetch function - server-side pagination when no filters, otherwise fetch more for client-side filtering
  const fetchProfiles = async () => {
    setIsLoadingCandidates(true);
    
    try {
      const pageSize = 9;
      
      if (!hasActiveFilters() && !filters.showSelected) {
        // Server-side pagination when no filters
        let query = supabase
          .from("profiles")
          .select("*", { count: 'exact' });
        
        // Apply server-side sorting
        switch (filters.sortBy) {
          case "name":
            query = query.order("name");
            break;
          case "submitted":
            query = query.order("submitted_at", { ascending: false });
            break;
          case "salary":
            query = query.order("name");
            break;
          case "experience":
            query = query.order("name");
            break;
          default:
            query = query.order("name");
        }
        
        const { data, error, count } = await query.range((page - 1) * pageSize, page * pageSize - 1);

        if (error) {
          console.error("Error fetching profiles:", error.message);
        } else {
          setCandidates(data || []);
          setTotalCount(count || 0);
        }
      } else {
        // Client-side filtering - fetch all data
        const { data, error, count } = await supabase
          .from("profiles")
          .select("*", { count: 'exact' })
          .order("name");

        if (error) {
          console.error("Error fetching profiles:", error.message);
        } else {
          setCandidates(data || []);
          setTotalCount(count || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setIsLoadingCandidates(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("skills, location, work_experiences");

    if (error) {
      console.error("Error fetching filter options:", error.message);
    } else if (data) {
      const skills = new Set<string>();
      const locations = new Set<string>();
      const companies = new Set<string>();

      data.forEach(profile => {
        profile.skills?.forEach((skill: string) => skills.add(skill));
        if (profile.location) locations.add(profile.location);
        profile.work_experiences?.forEach((exp) => {
          if (exp.company) companies.add(exp.company);
        });
      });

      setAvailableSkills(Array.from(skills).sort());
      setAvailableLocations(Array.from(locations).sort());
      setAvailableCompanies(Array.from(companies).sort());
    }
  };

  // Fetch profiles on component mount and when relevant dependencies change
  useEffect(() => {
    fetchProfiles();
  }, [page, filters.sortBy]); // Only re-fetch when page or sort changes (for server-side pagination)

  // Separate effect for filter changes
  useEffect(() => {
    // Reset to page 1 and fetch when filters change
    fetchProfiles();
  }, [
    filters.searchTerm, 
    filters.locationFilter, 
    filters.skillFilter, 
    filters.companyFilter, 
    filters.educationLevelFilter, 
    filters.subjectFilter, 
    filters.availabilityFilter, 
    filters.experienceLevelFilter, 
    filters.roleTypeFilter, 
    filters.salaryRange, 
    filters.showSelected
  ]);

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Smart filtering, sorting, and pagination (handles both server-side and client-side)
  const { paginatedCandidates, totalFilteredCount, totalPages } = useMemo(() => {
    const pageSize = 9;
    
    // If we're using server-side pagination (no filters), return data as-is
    if (!hasActiveFilters() && !filters.showSelected) {
      const candidatesWithSelection = candidates.map((candidate) => ({
        ...candidate,
        isSelected: selectedCandidates.has(candidate.id),
      }));
      
      return {
        paginatedCandidates: candidatesWithSelection,
        totalFilteredCount: totalCount,
        totalPages: Math.ceil(totalCount / pageSize)
      };
    }
    
    // Client-side filtering and pagination when filters are active
    let filtered = candidates.map((candidate) => ({
      ...candidate,
      isSelected: selectedCandidates.has(candidate.id),
    }));

    // Apply search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          candidate.skills.some((skill) =>
            skill.toLowerCase().includes(filters.searchTerm.toLowerCase())
          ) ||
          candidate.work_experiences?.some(
            (exp) =>
              exp.company.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
              exp.roleName.toLowerCase().includes(filters.searchTerm.toLowerCase())
          ) ||
                     candidate.education?.degrees?.some(
              (degree) => degree.subject?.toLowerCase().includes(filters.searchTerm.toLowerCase())
            )
      );
    }

    // Apply location filter (multi-select)
    if (filters.locationFilter.length > 0) {
      filtered = filtered.filter((candidate) => 
        candidate.location && filters.locationFilter.includes(candidate.location)
      );
    }

    // Apply skill filter (multi-select)
    if (filters.skillFilter.length > 0) {
      filtered = filtered.filter((candidate) => 
        candidate.skills?.some(skill => filters.skillFilter.includes(skill))
      );
    }

    // Apply company filter (multi-select)
    if (filters.companyFilter.length > 0) {
      filtered = filtered.filter((candidate) =>
        candidate.work_experiences?.some(exp => filters.companyFilter.includes(exp.company))
      );
    }

    // Apply education level filter
    if (filters.educationLevelFilter && filters.educationLevelFilter !== "all") {
      filtered = filtered.filter((candidate) => 
        candidate.education?.highest_level === filters.educationLevelFilter
      );
    }



     // Apply subject filter
     if (filters.subjectFilter && filters.subjectFilter !== "all") {
               filtered = filtered.filter((candidate) =>
          candidate.education?.degrees?.some((degree) => degree.subject === filters.subjectFilter)
        );
     }

    // Apply availability filter
    if (filters.availabilityFilter && filters.availabilityFilter !== "all") {
      filtered = filtered.filter((candidate) =>
        candidate.work_availability?.includes(filters.availabilityFilter)
      );
    }

    // Apply role type filter
    if (filters.roleTypeFilter && filters.roleTypeFilter !== "all") {
      filtered = filtered.filter((candidate) =>
        candidate.work_experiences?.some(exp => 
          exp.roleName.toLowerCase().includes(filters.roleTypeFilter.toLowerCase())
        )
      );
    }

    // Apply experience level filter
    if (filters.experienceLevelFilter && filters.experienceLevelFilter !== "all") {
      filtered = filtered.filter((candidate) => {
        const expCount = candidate.work_experiences?.length || 0;
        switch (filters.experienceLevelFilter) {
          case "entry": return expCount <= 2;
          case "mid": return expCount >= 3 && expCount <= 5;
          case "senior": return expCount >= 6;
          default: return true;
        }
      });
    }

    // Apply salary filter
    filtered = filtered.filter((candidate) => {
      if (candidate.annual_salary_expectation["full-time"]) {
        const salary = parseInt(
          candidate.annual_salary_expectation["full-time"].replace(/[$,]/g, "")
        );
        return salary >= filters.salaryRange[0] && salary <= filters.salaryRange[1];
      }
      return true;
    });

    // Apply show selected filter
    if (filters.showSelected) {
      filtered = filtered.filter((candidate) => candidate.isSelected);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "submitted":
          return (
            new Date(b.submitted_at).getTime() -
            new Date(a.submitted_at).getTime()
          );
        case "salary": {
          const aSalary = parseInt(
            a.annual_salary_expectation["full-time"]?.replace(/[$,]/g, "") ||
              "0"
          );
          const bSalary = parseInt(
            b.annual_salary_expectation["full-time"]?.replace(/[$,]/g, "") ||
              "0"
          );
          return bSalary - aSalary;
        }
        case "experience":
          return (
            (b.work_experiences?.length || 0) -
            (a.work_experiences?.length || 0)
          );
        default:
          return 0;
      }
    });

    // Apply pagination
    const totalPages = Math.ceil(filtered.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      paginatedCandidates: paginated,
      totalFilteredCount: filtered.length,
      totalPages: totalPages
    };
  }, [
    candidates,
    selectedCandidates,
    filters.searchTerm,
    filters.locationFilter,
    filters.skillFilter,
    filters.companyFilter,
    filters.educationLevelFilter,
    filters.subjectFilter,
    filters.availabilityFilter,
    filters.experienceLevelFilter,
    filters.roleTypeFilter,
    filters.salaryRange,
    filters.showSelected,
    filters.sortBy,
    page,
    totalCount
  ]);

  return {
    candidates,
    paginatedCandidates,
    totalFilteredCount,
    totalPages,
    isLoadingCandidates,
    availableSkills,
    availableLocations,
    availableCompanies,
    hasActiveFilters: hasActiveFilters()
  };
}; 