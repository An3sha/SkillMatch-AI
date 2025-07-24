import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  // Don't show pagination if there's only one page, no data, or invalid state
  if (totalPages <= 1 || totalItems === 0 || currentPage > totalPages) {
    return null;
  }

  // Generate page numbers for pagination bar
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Always show first page
    pages.push(1);
    
    if (currentPage <= 4) {
      // Near the beginning: show 2,3,4,5, ..., last
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Near the end: show first, ..., last-4, last-3, last-2, last-1, last
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle: show first, ..., current-1, current, current+1, ..., last
      pages.push('...');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push('...');
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
                key={`page-${num}-${idx}`}
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