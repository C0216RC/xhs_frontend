// src/components/moderation/ModerationOverlay.js
import React from 'react';
import { AlertTriangle, Eye, EyeOff, Shield, Info } from 'lucide-react';

const ModerationOverlay = ({ 
  moderationResult, 
  contentType = 'text', 
  isRevealed = false, 
  onRevealToggle,
  children,
  className = ''
}) => {
  if (!moderationResult || moderationResult.isSafe) {
    return children;
  }

  const getIcon = () => {
    switch (contentType) {
      case 'image':
        return <Shield size={24} />;
      case 'comment':
        return <Info size={24} />;
      default:
        return <AlertTriangle size={24} />;
    }
  };

  const getTitle = () => {
    switch (contentType) {
      case 'image':
        return '🤖 AI检测到敏感图片';
      case 'comment':
        return '🤖 AI检测到敏感评论';
      default:
        return '🤖 AI检测到敏感文本';
    }
  };

  const getDescription = () => {
    const reasons = moderationResult.reasons || [];
    if (reasons.length > 0) {
      return reasons.join('、');
    }
    
    switch (contentType) {
      case 'image':
        return '此图片可能包含不适宜的内容';
      case 'comment':
        return '此评论可能包含不适宜的内容';
      default:
        return '此文本可能包含不适宜的内容';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-red-600';
    if (confidence >= 0.6) return 'text-orange-600';
    return 'text-yellow-600';
  };

  // 如果内容已经被显示，则正常展示
  if (isRevealed) {
    return (
      <div className={`relative ${className}`}>
        {children}
        {/* 已显示状态的小标识 */}
        <div className="absolute top-2 right-2">
          <button
            onClick={onRevealToggle}
            className="bg-gray-800 bg-opacity-75 text-white p-1 rounded-full hover:bg-opacity-90 transition-all"
            title="隐藏敏感内容"
          >
            <EyeOff size={14} />
          </button>
        </div>
      </div>
    );
  }

  // 被遮罩的状态
  return (
    <div className={`relative ${className}`}>
      {/* 被模糊的原始内容 */}
      <div className="filter blur-sm select-none opacity-60 pointer-events-none">
        {children}
      </div>

      {/* 覆盖层 */}
      <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded-lg">
        <div className="text-center p-4 bg-white rounded-xl shadow-lg border-2 border-orange-200 max-w-xs mx-4">
          {/* 图标 */}
          <div className="flex justify-center mb-3">
            <div className="p-2 bg-orange-100 rounded-full text-orange-600">
              {getIcon()}
            </div>
          </div>

          {/* 标题 */}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {getTitle()}
          </h3>

          {/* 描述信息 */}
          <p className="text-sm text-orange-700 mb-3">
            {getDescription()}
          </p>

          {/* 置信度显示 */}
          {moderationResult.confidence && (
            <div className="text-xs text-gray-600 mb-3">
              检测置信度: 
              <span className={`ml-1 font-medium ${getConfidenceColor(moderationResult.confidence)}`}>
                {Math.round(moderationResult.confidence * 100)}%
              </span>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="space-y-2">
            <button
              onClick={onRevealToggle}
              className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <Eye size={16} />
              <span>显示原内容</span>
            </button>
            
            <p className="text-xs text-gray-500">
              点击后将显示原始内容，请谨慎查看
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 专门用于文本内容的遮罩组件
export const TextModerationOverlay = ({ 
  moderationResult, 
  isRevealed, 
  onRevealToggle, 
  children 
}) => {
  return (
    <ModerationOverlay
      moderationResult={moderationResult}
      contentType="text"
      isRevealed={isRevealed}
      onRevealToggle={onRevealToggle}
    >
      {children}
    </ModerationOverlay>
  );
};

// 专门用于图片内容的遮罩组件
export const ImageModerationOverlay = ({ 
  moderationResult, 
  isRevealed, 
  onRevealToggle, 
  children 
}) => {
  return (
    <ModerationOverlay
      moderationResult={moderationResult}
      contentType="image"
      isRevealed={isRevealed}
      onRevealToggle={onRevealToggle}
    >
      {children}
    </ModerationOverlay>
  );
};

// 专门用于评论内容的遮罩组件
export const CommentModerationOverlay = ({ 
  moderationResult, 
  isRevealed, 
  onRevealToggle, 
  children 
}) => {
  return (
    <ModerationOverlay
      moderationResult={moderationResult}
      contentType="comment"
      isRevealed={isRevealed}
      onRevealToggle={onRevealToggle}
    >
      {children}
    </ModerationOverlay>
  );
};

export default ModerationOverlay;