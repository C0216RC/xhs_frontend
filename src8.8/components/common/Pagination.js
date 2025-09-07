import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  showInfo = true,
  showSizeChanger = false,
  showQuickJumper = true,
  className = ''
}) => {
  const [jumpPage, setJumpPage] = useState('');

  // 生成页码数组的辅助函数
  const generatePageNumbers = () => {
    const delta = 2; // 当前页前后显示的页码数
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    // 去除重复的页码
    return [...new Set(rangeWithDots)].filter(page => 
      page === '...' || (typeof page === 'number' && page >= 1 && page <= totalPages)
    );
  };

  // 处理页码点击
  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // 处理上一页
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // 处理下一页
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // 处理快速跳转
  const handleQuickJump = () => {
    const page = parseInt(jumpPage);
    if (page && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage('');
    }
  };

  if (totalPages <= 1) return null;

  const pageNumbers = generatePageNumbers();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* 信息显示 */}
      {showInfo && (
        <div className="flex items-center text-sm text-gray-600">
          <span>
            显示第 {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} 条，
            共 {totalItems} 条
          </span>
        </div>
      )}

      {/* 分页控件 */}
      <div className="flex items-center space-x-2">
        {/* 上一页按钮 */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`
            flex items-center px-3 py-2 text-sm border rounded-md transition-colors
            ${currentPage === 1
              ? 'text-gray-400 border-gray-200 cursor-not-allowed'
              : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }
          `}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          上一页
        </button>

        {/* 页码按钮 */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`
                  px-3 py-2 text-sm border rounded-md transition-colors min-w-[2.5rem]
                  ${currentPage === page
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }
                `}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* 下一页按钮 */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`
            flex items-center px-3 py-2 text-sm border rounded-md transition-colors
            ${currentPage === totalPages
              ? 'text-gray-400 border-gray-200 cursor-not-allowed'
              : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }
          `}
        >
          下一页
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>

        {/* 快速跳转 */}
        {showQuickJumper && totalPages > 10 && (
          <div className="flex items-center ml-4 text-sm text-gray-600">
            <span className="mr-2">跳至</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuickJump()}
              className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <span className="mx-2">页</span>
            <button
              onClick={handleQuickJump}
              className="px-2 py-1 text-blue-600 hover:text-blue-800"
            >
              确定
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;