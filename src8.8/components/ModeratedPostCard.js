// src/components/ModeratedPostCard.js
import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Shield,
  ChevronDown,
  ChevronUp,
  Clock,
  MoreHorizontal
} from 'lucide-react';

const ModeratedPostCard = ({ post, showModerationInfo = false, viewMode = 'grid' }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [contentRevealed, setContentRevealed] = useState(true);
  const [showModerationDetails, setShowModerationDetails] = useState(false);

  // 构建图片路径
  const getImagePath = (post) => {
    if (!post.image) return null;
    
    let basePath = '/data/';
    let imageName = post.image;
    
    // 根据数据源构建路径
    if (post.source === 'Part1') {
      basePath += 'Part1/images/';
    } else if (post.source === 'Part2') {
      basePath += 'Part2/images/';
    } else if (post.source === 'PartNormal') {
      basePath += 'PartNormal/';
    } else {
      // 尝试从ID或其他字段推断来源
      const postId = post.id?.toString() || '';
      if (postId.includes('part1') || postId.includes('Part1')) {
        basePath += 'Part1/images/';
      } else if (postId.includes('part2') || postId.includes('Part2')) {
        basePath += 'Part2/images/';
      } else if (postId.includes('normal') || postId.includes('Normal')) {
        basePath += 'PartNormal/';
      } else {
        basePath += 'Part1/images/'; // 默认
      }
    }
    
    // 处理图片文件名
    if (!imageName.includes('.')) {
      // 尝试常见的图片扩展名
      imageName += '.jpg';
    }
    
    return basePath + imageName;
  };

  const imagePath = getImagePath(post);

  const formatCount = (count) => {
    if (!count || count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 10000) return (count / 1000).toFixed(1) + 'k';
    return Math.round(count / 1000) + 'k';
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '刚刚';
    return timeStr;
  };

  const getModerationBadge = () => {
    if (!showModerationInfo || !post.moderation) return null;
    
    const { isSafe, needsReview } = post.moderation;
    
    if (isSafe) {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          <Shield size={12} />
          安全
        </div>
      );
    }
    
    if (needsReview) {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
          <AlertTriangle size={12} />
          审核
        </div>
      );
    }
    
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
        <AlertTriangle size={12} />
        屏蔽
      </div>
    );
  };

  // 列表视图
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="p-6 flex space-x-4">
          {/* 用户头像 */}
          <div className="flex-shrink-0">
            <img
              src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
              alt={post.author?.nickname || '用户'}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
            />
          </div>
          
          {/* 内容区 */}
          <div className="flex-1 min-w-0">
            {/* 用户信息和审核状态 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 truncate">
                  {post.author?.nickname || '小红薯用户'}
                </span>
                <span className="text-sm text-gray-500">
                  {formatTime(post.publishTime || post.createTime)}
                </span>
              </div>
              {getModerationBadge()}
            </div>
            
            {/* 内容标题 */}
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 leading-relaxed">
              {post.title || post.content?.substring(0, 60) + '...'}
            </h3>
            
            {/* 内容正文 */}
            {post.content && post.content !== post.title && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                {post.content}
              </p>
            )}
            
            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-gray-400">+{post.tags.length - 3}</span>
                )}
              </div>
            )}
            
            {/* 互动按钮 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center space-x-2 text-sm transition-all duration-200 hover:scale-105 ${
                    liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{formatCount((post.stats?.likes || post.likes || 0) + (liked ? 1 : 0))}</span>
                </button>
                <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{formatCount(post.stats?.comments || post.commentCount || 0)}</span>
                </button>
                <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-green-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>{formatCount(post.stats?.shares || 0)}</span>
                </button>
              </div>
              
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-105 ${
                  bookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* 图片预览 */}
          {imagePath && (
            <div className="flex-shrink-0">
              <img
                src={imagePath}
                alt={post.title}
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  // 图片加载失败，尝试其他路径
                  if (!e.target.dataset.tried) {
                    e.target.dataset.tried = 'true';
                    const alternatives = [
                      `/data/Part1/images/${post.image}`,
                      `/data/Part2/images/${post.image}`, 
                      `/data/PartNormal/${post.image}`,
                      `/data/Part1/images/${post.image}.jpg`,
                      `/data/Part2/images/${post.image}.jpg`,
                      `/data/PartNormal/${post.image}.jpg`
                    ];
                    
                    // 尝试下一个路径
                    const currentIndex = alternatives.indexOf(e.target.src.split(window.location.origin)[1]);
                    if (currentIndex < alternatives.length - 1) {
                      e.target.src = alternatives[currentIndex + 1];
                      return;
                    }
                  }
                  
                  // 所有路径都失败，隐藏图片
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 瀑布流卡片视图
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden break-inside-avoid mb-4 group border border-gray-100">
      {/* 用户信息头部 */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
            alt={post.author?.nickname}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div>
            <span className="font-medium text-gray-900 text-sm">
              {post.author?.nickname || '小红薯用户'}
            </span>
            <p className="text-xs text-gray-500">
              {formatTime(post.publishTime || post.createTime)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getModerationBadge()}
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* 图片区域 */}
      {imagePath ? (
        <div className="relative">
          <img
            src={imagePath}
            alt={post.title}
            className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
            style={{ aspectRatio: 'auto' }}
            onError={(e) => {
              // 图片加载失败时的多路径尝试
              if (!e.target.dataset.tried) {
                e.target.dataset.tried = 'true';
                
                // 构建所有可能的图片路径
                const imageBaseName = post.image?.replace(/\.[^/.]+$/, '') || post.id || 'default';
                const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
                const sources = ['Part1/images', 'Part2/images', 'PartNormal'];
                
                const alternatives = [];
                sources.forEach(source => {
                  extensions.forEach(ext => {
                    alternatives.push(`/data/${source}/${imageBaseName}${ext}`);
                    alternatives.push(`/data/${source}/${post.image}`);
                  });
                });
                
                // 尝试下一个路径
                const currentSrc = e.target.src.split(window.location.origin)[1];
                const currentIndex = alternatives.indexOf(currentSrc);
                if (currentIndex < alternatives.length - 1) {
                  e.target.src = alternatives[currentIndex + 1];
                  return;
                }
              }
              
              // 所有路径都失败，显示占位内容
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          
          {/* 图片加载失败的占位符 */}
          <div className="hidden w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500 text-2xl">📝</span>
              </div>
              <p className="text-gray-600 text-sm font-medium line-clamp-2">
                {post.title?.substring(0, 40) || post.content?.substring(0, 40)}
                {(post.title || post.content)?.length > 40 ? '...' : ''}
              </p>
            </div>
          </div>
          
          {/* 悬停时的渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        /* 纯文字内容的卡片 */
        <div className="aspect-square bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-3 text-sm leading-relaxed">
              {post.title || post.content?.substring(0, 80)}
            </h3>
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div className="p-4">
        {/* 标题和内容 */}
        <div className="mb-3">
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm leading-relaxed">
            {post.title || post.content?.substring(0, 60)}
            {(post.title || post.content)?.length > 60 ? '...' : ''}
          </h3>
          
          {/* 如果有标题且内容不同，显示部分内容 */}
          {post.title && post.content && post.content !== post.title && (
            <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
              {post.content.substring(0, 50)}...
            </p>
          )}
        </div>

        {/* 标签 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-gray-400">+{post.tags.length - 2}</span>
            )}
          </div>
        )}

        {/* 审核详情 */}
        {showModerationInfo && post.moderation && !post.moderation.isSafe && (
          <div className="mb-3">
            <button
              onClick={() => setShowModerationDetails(!showModerationDetails)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span>审核详情</span>
              {showModerationDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showModerationDetails && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                <div className="space-y-2">
                  {post.moderation.reasons && post.moderation.reasons.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">问题：</span>
                      <ul className="ml-2 text-xs text-gray-600 mt-1">
                        {post.moderation.reasons.map((reason, index) => (
                          <li key={index}>• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    置信度: {Math.round((post.moderation.confidence || 0.8) * 100)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 互动栏 */}
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center space-x-1 text-xs transition-all duration-200 hover:scale-105 ${
                liked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{formatCount((post.stats?.likes || post.likes || 0) + (liked ? 1 : 0))}</span>
            </button>
            <button className="flex items-center space-x-1 text-xs hover:text-blue-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{formatCount(post.stats?.comments || post.commentCount || 0)}</span>
            </button>
            <button className="flex items-center space-x-1 text-xs hover:text-green-500 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>{formatCount(post.stats?.shares || 0)}</span>
            </button>
          </div>
          
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-1 rounded transition-all duration-200 hover:scale-105 ${
              bookmarked ? 'text-yellow-500' : 'hover:text-yellow-500'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* 来源信息（调试用） */}
        {showModerationInfo && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>来源: {post.source || '未知'}</span>
              <span>ID: {post.id}</span>
            </div>
            {imagePath && (
              <div className="text-xs text-gray-400 mt-1 truncate">
                图片: {imagePath}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratedPostCard;