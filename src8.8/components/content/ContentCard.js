import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MapPin, Clock, Eye, AlertTriangle } from 'lucide-react';
import { TextModerationOverlay, ImageModerationOverlay } from '../moderation/ModerationOverlay';

const ContentCard = ({ post, onClick, dataService }) => {
  // 状态管理
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());
  const [imagesError, setImagesError] = useState(new Set());
  const [textContentRevealed, setTextContentRevealed] = useState(false);
  const [imageContentRevealed, setImageContentRevealed] = useState(false);

  // 如果没有帖子数据，返回空
  if (!post) return null;

  // 格式化数字显示
  const formatNumber = (num) => {
    if (!num || num === 0) return '0';
    if (num < 1000) return num.toString();
    if (num < 10000) return `${(num / 1000).toFixed(1)}k`;
    return `${Math.floor(num / 1000)}k`;
  };

  // 处理图片加载成功
  const handleImageLoad = (imagePath) => {
    setImagesLoaded(prev => new Set([...prev, imagePath]));
    setImagesError(prev => {
      const newSet = new Set(prev);
      newSet.delete(imagePath);
      return newSet;
    });
  };

  // 处理图片加载失败
  const handleImageError = (imagePath) => {
    setImagesError(prev => new Set([...prev, imagePath]));
    setImagesLoaded(prev => {
      const newSet = new Set(prev);
      newSet.delete(imagePath);
      return newSet;
    });
  };

  // 交互处理
  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title || '小红书内容',
        text: post.content?.substring(0, 100) + '...',
        url: window.location.href
      });
    }
  };

  // 卡片点击处理
  const handleCardClick = () => {
    if (onClick) {
      onClick(post);
    }
  };

  // 获取所有图片路径
  const getAllImages = () => {
    return post.images || [];
  };

  // 获取主图片路径（向后兼容）
  const getMainImageSrc = () => {
    const images = getAllImages();
    return images.length > 0 ? images[0] : null;
  };

  // 获取头像路径
  const getAvatarSrc = () => {
    return dataService.getAvatarPath(post.avatar, post.userId || post.nickname, post.source);
  };

  // 渲染审核状态指示器
  const renderModerationBadge = () => {
    const moderation = post.moderation;
    if (!moderation || moderation.isSafe) return null;

    let badgeClass = 'bg-yellow-100 text-yellow-800';
    let badgeText = '待审核';

    if (moderation.isBlocked) {
      badgeClass = 'bg-red-100 text-red-800';
      badgeText = '已屏蔽';
    } else if (moderation.needsReview) {
      badgeClass = 'bg-orange-100 text-orange-800';
      badgeText = '待审核';
    }

    return (
      <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${badgeClass} z-10`}>
        <AlertTriangle size={12} className="inline mr-1" />
        {badgeText}
      </div>
    );
  };

  // 渲染文本内容
  const renderTextContent = () => {
    const textModeration = post.moderation?.results?.text;
    
    return (
      <TextModerationOverlay
        moderationResult={textModeration}
        isRevealed={textContentRevealed}
        onRevealToggle={() => setTextContentRevealed(!textContentRevealed)}
      >
        <div className="space-y-2">
          {post.title && (
            <h3 className="font-semibold text-gray-900 text-sm leading-5 line-clamp-2">
              {post.title}
            </h3>
          )}
          {post.content && (
            <p className="text-gray-700 text-sm leading-5 line-clamp-3">
              {post.content}
            </p>
          )}
        </div>
      </TextModerationOverlay>
    );
  };

  // 渲染图片内容 - 支持多图显示
  const renderImageContent = () => {
    const images = getAllImages();
    if (!images || images.length === 0) return null;

    const imageModeration = post.moderation?.results?.image;

    return (
      <ImageModerationOverlay
        moderationResult={imageModeration}
        isRevealed={imageContentRevealed}
        onRevealToggle={() => setImageContentRevealed(!imageContentRevealed)}
      >
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          {images.length === 1 ? (
            // 单张图片显示
            <div className="relative">
              {!imagesLoaded.has(images[0]) && !imagesError.has(images[0]) && (
                <div className="aspect-square flex items-center justify-center">
                  <div className="animate-pulse bg-gray-200 w-8 h-8 rounded"></div>
                </div>
              )}
              
              {imagesError.has(images[0]) ? (
                <div className="aspect-square flex items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-500">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded flex items-center justify-center">
                      <Eye size={20} />
                    </div>
                    <p className="text-xs">图片加载失败</p>
                  </div>
                </div>
              ) : (
                <img
                  src={images[0]}
                  alt={post.title || '小红书图片'}
                  className={`w-full h-auto object-cover transition-opacity duration-300 ${
                    imagesLoaded.has(images[0]) ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ aspectRatio: '1 / 1.2' }}
                  onLoad={() => handleImageLoad(images[0])}
                  onError={() => handleImageError(images[0])}
                  loading="lazy"
                />
              )}
            </div>
          ) : (
            // 多张图片网格显示
            <div className="grid grid-cols-2 gap-1">
              {images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`${post.title} - 图片${index + 1}`}
                    className="w-full h-24 object-cover"
                    onLoad={() => handleImageLoad(image)}
                    onError={() => handleImageError(image)}
                    loading="lazy"
                  />
                  {/* 显示更多图片的遮罩 */}
                  {index === 3 && images.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">+{images.length - 3}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* 图片数量指示器 */}
          {images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
              {images.length}张
            </div>
          )}
        </div>
      </ImageModerationOverlay>
    );
  };

  // 渲染标签
  const renderTags = () => {
    if (!post.tags || !Array.isArray(post.tags) || post.tags.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {post.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
        {post.tags.length > 3 && (
          <span className="text-xs text-gray-500 px-2 py-1">
            +{post.tags.length - 3}
          </span>
        )}
      </div>
    );
  };

  return (
    <div 
      className="xiaohongshu-card cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* 审核状态徽章 */}
      {renderModerationBadge()}

      {/* 图片区域 */}
      {renderImageContent()}

      {/* 内容区域 */}
      <div className="p-3">
        {/* 文本内容 */}
        {renderTextContent()}

        {/* 标签 */}
        {renderTags()}

        {/* 位置和时间信息 */}
        <div className="flex items-center text-xs text-gray-500 mt-2 space-x-3">
          {post.location && (
            <div className="flex items-center space-x-1">
              <MapPin size={10} />
              <span>{post.location}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Clock size={10} />
            <span>{dataService.formatTime(post.time)}</span>
          </div>
        </div>

        {/* 用户信息 */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <img
              src={getAvatarSrc()}
              alt={post.nickname}
              className="w-6 h-6 rounded-full bg-gray-200"
              onError={(e) => {
                e.target.src = dataService.getAvatarPath('', post.userId || post.nickname, post.source);
              }}
            />
            <span className="text-sm text-gray-700 font-medium truncate max-w-20">
              {post.nickname || '匿名用户'}
            </span>
          </div>

          {/* 来源和图片数量标识 */}
          <div className="flex items-center space-x-1">
            <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
              {post.source}
            </div>
            {post.imageCount > 0 && (
              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {post.imageCount}图
              </div>
            )}
          </div>
        </div>

        {/* 互动数据 */}
        <div className="xiaohongshu-interaction">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                liked ? 'text-red-500' : 'text-gray-500'
              } hover:text-red-500 transition-colors`}
            >
              <Heart 
                size={16} 
                className={liked ? 'fill-current' : ''} 
              />
              <span className="text-xs">
                {formatNumber((post.likedCount || 0) + (liked ? 1 : 0))}
              </span>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onClick(post); }}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <MessageCircle size={16} />
              <span className="text-xs">
                {formatNumber(post.commentCount || 0)}
              </span>
            </button>

            <button
              onClick={handleBookmark}
              className={`flex items-center space-x-1 ${
                bookmarked ? 'text-yellow-500' : 'text-gray-500'
              } hover:text-yellow-500 transition-colors`}
            >
              <Bookmark 
                size={16} 
                className={bookmarked ? 'fill-current' : ''} 
              />
              <span className="text-xs">
                {formatNumber(post.collectedCount || 0)}
              </span>
            </button>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;