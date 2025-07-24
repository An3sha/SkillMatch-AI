import React from "react";
import { CandidateCard } from "./CandidateCard";
import { Candidate } from "../types";

interface CandidateGridProps {
  showSelected: boolean;
  paginatedCandidates: Candidate[];
  selectedCandidatesList: Candidate[];
  totalFilteredCount: number;
  isLoadingCandidates: boolean;
  hasActiveFilters: boolean;
  onSelect: (id: string) => void;
  onViewDetails: (candidate: Candidate) => void;
}

export const CandidateGrid: React.FC<CandidateGridProps> = ({
  showSelected,
  paginatedCandidates,
  selectedCandidatesList,
  totalFilteredCount,
  isLoadingCandidates,
  hasActiveFilters,
  onSelect,
  onViewDetails,
}) => {
  return (
    <div className="w-full flex-1 flex flex-col p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {showSelected ? "Selected Candidates" : "All Candidates"}
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-gray-500">
            {showSelected
              ? `${paginatedCandidates.length} selected candidate${
                  paginatedCandidates.length !== 1 ? "s" : ""
                }`
              : `${totalFilteredCount} candidate${
                  totalFilteredCount !== 1 ? "s" : ""
                } found`}
          </p>
          {!hasActiveFilters && !showSelected && !isLoadingCandidates && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ⚡ Fast mode
            </span>
          )}
        </div>
      </div>

      {showSelected && selectedCandidatesList.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6 p-4">
            {selectedCandidatesList.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={{ ...candidate, isSelected: true }}
                onSelect={onSelect}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {!showSelected && isLoadingCandidates && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-lg h-[280px] flex flex-col p-3 animate-pulse"
            >
              {/* Header - Match CandidateCard structure */}
              <div className="flex items-start justify-between mb-3 h-[65px]">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="ml-2 flex-shrink-0">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
              </div>

              {/* Experience and Education section - h-[55px] */}
              <div className="mb-3 h-[55px]">
                <div className="h-3 bg-gray-200 rounded mb-1 w-1/4"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                </div>
              </div>

              {/* Skills section - h-[60px] */}
              <div className="mb-3 h-[60px]">
                <div className="h-3 bg-gray-200 rounded mb-1 w-1/4"></div>
                <div className="flex gap-1 mt-1">
                  <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-14"></div>
                </div>
              </div>

              {/* Action buttons at bottom */}
              <div className="mt-auto flex gap-2">
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showSelected && !isLoadingCandidates && paginatedCandidates.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {paginatedCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onSelect={onSelect}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

      {paginatedCandidates.length === 0 && !isLoadingCandidates && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 text-gray-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No candidates found
            </h3>

            <p className="text-gray-500 mb-6 leading-relaxed">
              We couldn't find any candidates matching your current search and
              filter criteria. Try adjusting your filters or search terms to
              discover more candidates.
            </p>

            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                Clear filters to see all candidates
              </p>
              <p className="flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                Try different search keywords
              </p>
              <p className="flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                Expand your filter criteria
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
