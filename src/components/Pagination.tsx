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
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
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
            ? <span key={idx} className="w-10 h-10 flex items-center justify-center text-gray-300 font-semibold">...</span>
            : <button
                key={num}
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