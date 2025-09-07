// src/components/PostDetail.js
import React, { useState, useEffect } from 'react';
import { 
  X, Heart, MessageCircle, Bookmark, Share2, MapPin, Clock, 
  User, Eye, AlertTriangle, Send, ChevronDown, ChevronUp, RefreshCw 
} from 'lucide-react';
import { TextModerationOverlay, ImageModerationOverlay, CommentModerationOverlay } from './moderation/ModerationOverlay';
import ImageGallery from './content/ImageGallery';

const PostDetail = ({ post, isOpen, onClose, dataService }) => {
  // 状态管理
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  // 评论分页状态
  const [commentsDisplayed, setCommentsDisplayed] = useState(30); // 当前显示的评论数量
  const [isLoadingMoreComments, setIsLoadingMoreComments] = useState(false);
  const COMMENTS_PER_PAGE = 30; // 每次加载30条评论
  
  // 敏感内容显示状态
  const [textContentRevealed, setTextContentRevealed] = useState(false);
  const [imageContentRevealed, setImageContentRevealed] = useState(false);
  const [revealedComments, setRevealedComments] = useState(new Set());

  // 重置状态当帖子改变时
  useEffect(() => {
    if (post) {
      setTextContentRevealed(false);
      setImageContentRevealed(false);
      setRevealedComments(new Set());
      setCommentsDisplayed(30); // 重置为显示30条评论
    }
  }, [post]);

  // 如果没有帖子数据或未打开，不渲染
  if (!isOpen || !post) return null;

  // 格式化数字
  const formatNumber = (num) => {
    if (!num || num === 0) return '0';
    if (num < 1000) return num.toString();
    if (num < 10000) return `${(num / 1000).toFixed(1)}k`;
    return `${Math.floor(num / 1000)}k`;
  };

  // 获取所有图片路径
  const getAllImages = () => {
    return post.images || [];
  };

  // 获取头像路径
  const getAvatarSrc = () => {
    return dataService.getAvatarPath(post.avatar, post.userId || post.nickname, post.source);
  };

  // 交互处理
  const toggleLike = () => {
    setLiked(!liked);
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      console.log('新评论:', newComment);
      setNewComment('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  // 处理评论显示状态切换
  const toggleCommentReveal = (commentId) => {
    const newRevealed = new Set(revealedComments);
    if (newRevealed.has(commentId)) {
      newRevealed.delete(commentId);
    } else {
      newRevealed.add(commentId);
    }
    setRevealedComments(newRevealed);
  };

  // 加载更多评论
  const handleLoadMoreComments = async () => {
    setIsLoadingMoreComments(true);
    
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCommentsDisplayed(prev => prev + COMMENTS_PER_PAGE);
    setIsLoadingMoreComments(false);
  };

  // 渲染审核信息面板
  const renderModerationPanel = () => {
    const moderation = post.moderation;
    if (!moderation || moderation.isSafe) return null;

    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="text-orange-600 mt-0.5" size={20} />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-orange-900">🤖 AI内容审核提醒</h4>
            <div className="mt-2 text-sm text-orange-800">
              {moderation.isBlocked && (
                <p className="mb-1">• 此内容已被AI识别为敏感内容并自动屏蔽</p>
              )}
              {moderation.needsReview && (
                <p className="mb-1">• 此内容需要人工审核</p>
              )}
              {moderation.reasons && moderation.reasons.length > 0 && (
                <p className="mb-1">• 检测到的问题：{moderation.reasons.join('、')}</p>
              )}
              <p className="text-xs text-orange-700 mt-2">
                检测置信度: {Math.round((moderation.confidence || 0.8) * 100)}%
              </p>
            </div>
          </div>
        </div>
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
        <div className="space-y-4">
          {post.title && (
            <h1 className="text-xl font-bold text-gray-900">{post.title}</h1>
          )}
          {post.content && (
            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
              {post.content}
            </p>
          )}
        </div>
      </TextModerationOverlay>
    );
  };

  // 渲染图片内容 - 使用新的ImageGallery组件
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
        <div className="space-y-4">
          <ImageGallery 
            images={images} 
            initialIndex={0}
            alt={post.title || '小红书图片'}
          />
        </div>
      </ImageModerationOverlay>
    );
  };

  // 渲染单个评论
  const renderComment = (comment, index) => {
    const commentModeration = post.moderation?.results?.comments;
    const isCommentBlocked = commentModeration && !commentModeration.isSafe;
    const isRevealed = revealedComments.has(comment.id);

    return (
      <div key={comment.id || index} className="border-b border-gray-100 pb-4 last:border-b-0">
        <CommentModerationOverlay
          moderationResult={isCommentBlocked ? commentModeration : null}
          isRevealed={isRevealed}
          onRevealToggle={() => toggleCommentReveal(comment.id)}
        >
          <div className="flex space-x-3">
            <img
              src={dataService.getAvatarPath(comment.avatar, comment.userId)}
              alt={comment.nickname}
              className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"
              onError={(e) => {
                e.target.src = dataService.getAvatarPath('', comment.userId || comment.nickname);
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {comment.nickname || '匿名用户'}
                </span>
                <span className="text-xs text-gray-500">
                  {dataService.formatTime(comment.time)}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
              {comment.likedCount > 0 && (
                <div className="flex items-center mt-2 space-x-2 text-xs text-gray-500">
                  <Heart size={12} />
                  <span>{formatNumber(comment.likedCount)}</span>
                </div>
              )}
            </div>
          </div>
        </CommentModerationOverlay>
      </div>
    );
  };

  // 渲染评论区域
  const renderCommentsSection = () => {
    const comments = post.comments || [];
    const totalCommentsCount = post.commentCount || comments.length; // 优先使用帖子的评论计数
    const hasComments = comments.length > 0;
    
    // 当前显示的评论（限制在 commentsDisplayed 数量内）
    const commentsToShow = comments.slice(0, commentsDisplayed);
    
    // 是否还有更多评论可以加载
    const hasMoreComments = comments.length > commentsDisplayed;
    
    // 剩余评论数量
    const remainingComments = Math.max(0, comments.length - commentsDisplayed);

    return (
      <div className="space-y-4">
        {/* 评论标题和统计 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            评论 ({totalCommentsCount.toLocaleString()})
          </h3>
          <div className="flex items-center space-x-2">
            {post.moderation?.results?.comments && !post.moderation.results.comments.isSafe && (
              <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                🤖 {post.moderation.results.comments.blockedCount || 0} 条评论被屏蔽
              </div>
            )}
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              显示 {commentsToShow.length} / {comments.length}
            </div>
          </div>
        </div>

        {/* 评论输入框 */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex space-x-3">
            <img
              src={dataService.getAvatarPath('', 'current_user')}
              alt="当前用户"
              className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="说点什么..."
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="2"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {newComment.length}/200
                </span>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  <Send size={14} />
                  <span>发送</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 评论列表 */}
        {hasComments ? (
          <div className="space-y-4">
            {/* 评论列表 */}
            <div className="space-y-4">
              {commentsToShow.map((comment, index) => renderComment(comment, index))}
            </div>
            
            {/* 加载更多评论按钮 */}
            {hasMoreComments && (
              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={handleLoadMoreComments}
                  disabled={isLoadingMoreComments}
                  className="flex items-center justify-center space-x-2 w-full py-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200"
                >
                  {isLoadingMoreComments ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} />
                      <span>加载中...</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      <span>查看更多评论 ({remainingComments.toLocaleString()} 条)</span>
                    </>
                  )}
                </button>
                
                {/* 加载进度提示 */}
                <div className="mt-2 text-center">
                  <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
                    <div className="w-32 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-red-500 h-1 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, (commentsToShow.length / comments.length) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span>{Math.round((commentsToShow.length / comments.length) * 100)}%</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* 评论加载完成提示 */}
            {!hasMoreComments && comments.length > COMMENTS_PER_PAGE && (
              <div className="text-center py-4 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>已显示全部 {comments.length.toLocaleString()} 条评论</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="mx-auto mb-2" size={32} />
            <p>暂无评论，快来抢沙发吧～</p>
          </div>
        )}
        
        {/* 评论区底部信息 */}
        {hasComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                评论按时间排序显示
              </span>
              <span>
                {totalCommentsCount !== comments.length && (
                  `主页显示: ${totalCommentsCount.toLocaleString()} | 实际加载: ${comments.length.toLocaleString()}`
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染标签
  const renderTags = () => {
    if (!post.tags || !Array.isArray(post.tags) || post.tags.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {post.tags.map((tag, index) => (
          <span
            key={index}
            className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full hover:bg-red-100 cursor-pointer transition-colors"
          >
            #{tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={getAvatarSrc()}
              alt={post.nickname}
              className="w-10 h-10 rounded-full bg-gray-200"
              onError={(e) => {
                e.target.src = dataService.getAvatarPath('', post.userId || post.nickname);
              }}
            />
            <div>
              <h2 className="font-semibold text-gray-900">
                {post.nickname || '匿名用户'}
              </h2>
              <div className="flex items-center text-sm text-gray-500 space-x-3">
                {post.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin size={14} />
                    <span>{post.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{dataService.formatTime(post.time)}</span>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {post.source}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容区域 - 可滚动 */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* 审核信息面板 */}
            {renderModerationPanel()}

            {/* 图片内容 */}
            <div className="mb-6">
              {renderImageContent()}
            </div>

            {/* 文本内容 */}
            <div className="mb-6">
              {renderTextContent()}
            </div>

            {/* 标签 */}
            {renderTags()}

            {/* 互动数据 */}
            <div className="flex items-center justify-between py-4 mt-6 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button
                  onClick={toggleLike}
                  className={`flex items-center space-x-2 ${
                    liked ? 'text-red-500' : 'text-gray-600'
                  } hover:text-red-500 transition-colors`}
                >
                  <Heart 
                    size={20} 
                    className={liked ? 'fill-current' : ''} 
                  />
                  <span className="font-medium">
                    {formatNumber((post.likedCount || 0) + (liked ? 1 : 0))}
                  </span>
                </button>

                <div className="flex items-center space-x-2 text-gray-600">
                  <MessageCircle size={20} />
                  <span className="font-medium">
                    {formatNumber(post.commentCount || 0)}
                  </span>
                </div>

                <button
                  onClick={toggleBookmark}
                  className={`flex items-center space-x-2 ${
                    bookmarked ? 'text-yellow-500' : 'text-gray-600'
                  } hover:text-yellow-500 transition-colors`}
                >
                  <Bookmark 
                    size={20} 
                    className={bookmarked ? 'fill-current' : ''} 
                  />
                  <span className="font-medium">
                    {formatNumber(post.collectedCount || 0)}
                  </span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title || '小红书内容',
                      text: post.content?.substring(0, 100) + '...',
                      url: window.location.href
                    });
                  }
                }}
                className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors"
              >
                <Share2 size={20} />
                <span className="font-medium">分享</span>
              </button>
            </div>

            {/* 评论区域 */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              {renderCommentsSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;