import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

const ModerationBadge = ({ isAnalyzing, textModeration, imageModeration }) => {
  // 正在分析中
  if (isAnalyzing) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-medium shadow-sm">
        <div className="relative">
          <Clock className="w-3 h-3 animate-spin" />
          <div className="absolute inset-0 animate-ping">
            <Clock className="w-3 h-3 text-blue-400 opacity-30" />
          </div>
        </div>
        <span>智能审核中</span>
      </div>
    );
  }
  
  // 没有审核结果
  if (!textModeration && !imageModeration) {
    return null;
  }
  
  // 计算整体安全状态
  const textSafe = !textModeration || textModeration.isSafe;
  const imageSafe = !imageModeration || imageModeration.isSafe;
  const overallSafe = textSafe && imageSafe;
  
  // 计算置信度
  const confidence = Math.min(
    textModeration?.confidence || 1,
    imageModeration?.confidence || 1
  );
  
  if (overallSafe) {
    return (
      <div className="group relative flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200">
        <div className="relative">
          <CheckCircle className="w-3 h-3" />
          <div className="absolute inset-0 animate-pulse opacity-50">
            <CheckCircle className="w-3 h-3 text-green-400" />
          </div>
        </div>
        <span>安全内容</span>
        
        {/* 悬浮提示 */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          <div className="flex items-center space-x-2">
            <Zap className="w-3 h-3" />
            <span>AI审核通过 · 置信度 {Math.round(confidence * 100)}%</span>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    );
  } else {
    const hasTextIssue = textModeration && !textModeration.isSafe;
    const hasImageIssue = imageModeration && !imageModeration.isSafe;
    
    return (
      <div className="group relative flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200">
        <div className="relative">
          <AlertTriangle className="w-3 h-3 animate-pulse" />
          <div className="absolute inset-0 animate-bounce opacity-30">
            <AlertTriangle className="w-3 h-3 text-yellow-400" />
          </div>
        </div>
        <span>内容已过滤</span>
        
        {/* 悬浮提示 */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Shield className="w-3 h-3" />
              <span>AI检测到敏感内容</span>
            </div>
            {hasTextIssue && (
              <div className="text-yellow-300">• 文本: {textModeration.reason}</div>
            )}
            {hasImageIssue && (
              <div className="text-yellow-300">• 图片: {imageModeration.reason}</div>
            )}
            <div className="text-gray-400 pt-1 border-t border-gray-600">
              置信度 {Math.round(confidence * 100)}%
            </div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    );
  }
};

export default ModerationBadge;