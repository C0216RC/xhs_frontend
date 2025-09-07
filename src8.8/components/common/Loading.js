import React from 'react';

const Loading = ({ 
  size = 'md', 
  text = '加载中...', 
  fullScreen = false,
  color = 'text-red-500',
  type = 'spinner' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const LoadingSpinner = () => {
    if (type === 'dots') {
      return (
        <div className="flex items-center justify-center space-x-2">
          <div className={`${sizeClasses[size]} ${color} animate-bounce`} style={{animationDelay: '0ms'}}>
            <div className="w-full h-full bg-current rounded-full"></div>
          </div>
          <div className={`${sizeClasses[size]} ${color} animate-bounce`} style={{animationDelay: '150ms'}}>
            <div className="w-full h-full bg-current rounded-full"></div>
          </div>
          <div className={`${sizeClasses[size]} ${color} animate-bounce`} style={{animationDelay: '300ms'}}>
            <div className="w-full h-full bg-current rounded-full"></div>
          </div>
        </div>
      );
    }

    if (type === 'pulse') {
      return (
        <div className={`${sizeClasses[size]} ${color} animate-pulse`}>
          <div className="w-full h-full bg-current rounded-full"></div>
        </div>
      );
    }

    // 默认spinner类型
    return (
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-transparent rounded-full animate-spin`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-red-500 rounded-full animate-spin`}></div>
      </div>
    );
  };

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <LoadingSpinner />
      {text && (
        <div className="text-center">
          <p className="text-gray-600 text-sm font-medium">{text}</p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <LoadingContent />
        </div>
      </div>
    );
  }

  return <LoadingContent />;
};

export default Loading;