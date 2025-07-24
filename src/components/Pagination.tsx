import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate page numbers for pagination bar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    // If we have 7 or fewer pages, show all
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Always show first page
    pages.push(1);
    
    // Calculate start and end for middle section
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust start and end to show 3 pages in middle when possible
    if (currentPage <= 3) {
      start = 2;
      end = Math.min(5, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      start = Math.max(totalPages - 4, 2);
      end = totalPages - 1;
    }
    
    // Add ellipsis if there's a gap between 1 and start
    if (start > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if there's a gap between end and last page
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page (if totalPages > 1)
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-8">
      <div className="flex items-center justify-center space-x-2 max-w-4xl w-full">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-[#4c4cc9] hover:border-[#4c4cc9]/40 disabled:opacity-50 transition-colors"
          aria-label="Previous page"
        >
          &lt;
        </button>
        {getPageNumbers().map((num, idx) =>
          num === '...'
            ? <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-300 font-semibold">...</span>
            : <button
                key={`page-${num}`}
                onClick={() => onPageChange(Number(num))}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border font-semibold transition-colors text-sm
                  ${currentPage === num ? 'bg-[#4c4cc9] text-white border-[#4c4cc9] shadow' : 'bg-white text-gray-700 border-gray-200 hover:bg-[#4c4cc9]/10 hover:text-[#4c4cc9] hover:border-[#4c4cc9]/40'}`}
                disabled={currentPage === num}
                aria-current={currentPage === num ? 'page' : undefined}
              >
                {num}
              </button>
        )}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-[#4c4cc9] hover:border-[#4c4cc9]/40 disabled:opacity-50 transition-colors"
          aria-label="Next page"
        >
          &gt;
        </button>
      </div>
    
    </div>
  );
}; 