import React, { useState } from 'react';
import { Shield, Eye, EyeOff, AlertTriangle, Lock } from 'lucide-react';

const ContentDisplay = ({ 
  content, 
  type, 
  moderationResult, 
  onReveal,
  className = ""
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  
  const handleReveal = (e) => {
    console.log('点击查看原图按钮'); // 调试日志
    e.preventDefault();
    e.stopPropagation();
    setIsRevealed(true);
    if (onReveal) onReveal();
  };
  
  // 如果没有审核结果，直接显示内容
  if (!moderationResult) {
    return type === 'image' ? (
      <img 
        src={content} 
        alt="内容" 
        className={`w-full h-96 object-cover rounded-lg ${className}`} 
      />
    ) : (
      <p className={`text-gray-800 leading-relaxed ${className}`}>{content}</p>
    );
  }
  
  // 如果审核通过，直接显示内容
  if (moderationResult.isSafe) {
    return type === 'image' ? (
      <img 
        src={content} 
        alt="内容" 
        className={`w-full h-96 object-cover rounded-lg ${className}`} 
      />
    ) : (
      <p className={`text-gray-800 leading-relaxed ${className}`}>{content}</p>
    );
  }
  
  // 敏感内容处理
  if (type === 'image') {
    return (
      <div className={`relative rounded-lg overflow-hidden ${className}`}>
        {/* 背景图片 - 始终显示但可能被模糊 */}
        <img 
          src={content} 
          alt="内容" 
          className={`w-full h-96 object-cover transition-all duration-700 ${
            isRevealed ? 'filter-none' : 'filter blur-xl brightness-90'
          }`}
        />
        
        {/* 半透明遮罩层 - 朦胧效果，只在未显示时显示 */}
        {!isRevealed && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10"
            onClick={(e) => e.stopPropagation()} // 防止事件冒泡
          >
            <div 
              className="text-center max-w-sm bg-black bg-opacity-40 rounded-2xl p-6 backdrop-blur-md"
              onClick={(e) => e.stopPropagation()} // 防止事件冒泡
            >
              {/* 盾牌图标动画 */}
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl mx-auto">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-ping opacity-30 mx-auto"></div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-3">
                内容已被过滤
              </h3>
              
              <div className="bg-black bg-opacity-30 rounded-xl p-3 mb-4">
                <p className="text-sm text-gray-200 mb-1 leading-relaxed">
                  {moderationResult.summary || '此内容可能包含敏感信息'}
                </p>
                {moderationResult.reason && (
                  <p className="text-xs text-yellow-300 flex items-center justify-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {moderationResult.reason}
                  </p>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleReveal}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mx-auto cursor-pointer select-none"
                style={{ pointerEvents: 'auto' }} // 确保按钮可点击
              >
                <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span>查看原图</span>
              </button>
              
              <p className="text-xs text-gray-300 mt-3">
                点击后将显示原始内容
              </p>
            </div>
          </div>
        )}
        
        {/* 已显示标识 - 只在显示后显示 */}
        {isRevealed && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs flex items-center shadow-lg animate-fadeIn z-20">
            <EyeOff className="w-3 h-3 mr-1" />
            敏感内容已显示
          </div>
        )}
      </div>
    );
  } else {
    // 文本内容处理
    return (
      <div className={`relative ${className}`}>
        {/* 文本内容 - 始终显示但可能被模糊 */}
        <div className={`transition-all duration-500 ${
          isRevealed ? 'filter-none opacity-100' : 'filter blur-sm opacity-60'
        }`}>
          <p className="text-gray-800 leading-relaxed">{content}</p>
        </div>
        
        {/* 文本遮罩层 - 只在未显示时显示 */}
        {!isRevealed && (
          <div 
            className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-gray-300 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="text-center max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 锁定图标 */}
              <div className="relative mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg mx-auto">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-30 mx-auto"></div>
              </div>
              
              <h4 className="text-base font-semibold text-gray-800 mb-2">
                文本内容已过滤
              </h4>
              
              <div className="bg-white bg-opacity-70 rounded-lg p-3 mb-3 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">
                  {moderationResult.summary || '此内容可能包含敏感信息'}
                </p>
                {moderationResult.reason && (
                  <p className="text-xs text-orange-600 flex items-center justify-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {moderationResult.reason}
                  </p>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleReveal}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg mx-auto cursor-pointer select-none"
                style={{ pointerEvents: 'auto' }}
              >
                <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span>查看原文</span>
              </button>
              
              <p className="text-xs text-gray-500 mt-2">
                点击后将显示原始内容
              </p>
            </div>
          </div>
        )}
        
        {/* 文本已显示标识 */}
        {isRevealed && (
          <div className="mt-3 inline-flex items-center text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full animate-fadeIn">
            <EyeOff className="w-3 h-3 mr-1" />
            敏感内容已显示
          </div>
        )}
      </div>
    );
  }
};

export default ContentDisplay;