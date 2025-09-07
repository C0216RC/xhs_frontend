import React, { useState } from 'react';
import { Heart, MessageCircle, Flag, MoreHorizontal } from 'lucide-react';
import ContentDisplay from './ContentDisplay';
import { useContentModeration } from '../../hooks/useContentModeration';

const Comment = ({ comment }) => {
  const [liked, setLiked] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  
  const {
    textModeration,
    imageModeration,
    isAnalyzing
  } = useContentModeration(comment.content, comment.image);
  
  const handleLike = () => {
    setLiked(!liked);
  };
  
  const handleReply = () => {
    if (replyText.trim()) {
      console.log('回复:', replyText);
      setReplyText('');
      setShowReply(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };
  
  return (
    <div className="group">
      <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
        {/* 用户头像 */}
        <div className="flex-shrink-0">
          <img 
            src={comment.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612f0c6?w=32&h=32&fit=crop&crop=face'} 
            alt="用户头像" 
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* 用户信息和时间 */}
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-sm text-gray-900 hover:text-red-500 cursor-pointer transition-colors">
              {comment.username}
            </span>
            <span className="text-xs text-gray-500">{comment.time}</span>
            {isAnalyzing && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-500">审核中</span>
              </div>
            )}
          </div>
          
          {/* 评论图片 */}
          {comment.image && (
            <div className="mb-2">
              <ContentDisplay 
                content={comment.image}
                type="image"
                moderationResult={imageModeration}
                className="max-w-xs rounded-lg"
              />
            </div>
          )}
          
          {/* 评论文本 */}
          {comment.content && (
            <div className="mb-2">
              <ContentDisplay 
                content={comment.content}
                type="text"
                moderationResult={textModeration}
                className="text-gray-800 text-sm leading-relaxed"
              />
            </div>
          )}
          
          {/* 评论操作 */}
          <div className="flex items-center space-x-4 text-xs">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 hover:text-red-500 transition-all duration-200 transform hover:scale-110 ${
                liked ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <Heart className={`w-3 h-3 ${liked ? 'fill-current animate-pulse' : ''}`} />
              <span>{(comment.likes || 0) + (liked ? 1 : 0)}</span>
            </button>
            
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-all duration-200 transform hover:scale-110"
            >
              <MessageCircle className="w-3 h-3" />
              <span>回复</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-500 hover:text-yellow-500 transition-all duration-200 transform hover:scale-110">
              <Flag className="w-3 h-3" />
              <span>举报</span>
            </button>
            
            {/* 更多操作 */}
            <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-all duration-200">
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>
          
          {/* 回复输入框 */}
          {showReply && (
            <div className="mt-3 animate-slideUp">
              <div className="flex items-start space-x-2">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face"
                  alt="我的头像" 
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-200"
                />
                <div className="flex-1 relative">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`回复 ${comment.username}...`}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none transition-all duration-200"
                    rows="2"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-400">
                      按 Enter 发送，Shift + Enter 换行
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowReply(false)}
                        className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                      >
                        发送
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 子评论 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {!showReplies ? (
                <button
                  onClick={() => setShowReplies(true)}
                  className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  查看 {comment.replies.length} 条回复
                </button>
              ) : (
                <div className="space-y-2 animate-fadeIn">
                  <button
                    onClick={() => setShowReplies(false)}
                    className="text-xs text-gray-500 hover:text-gray-600 font-medium transition-colors duration-200 mb-2"
                  >
                    收起回复
                  </button>
                  {comment.replies.map((reply, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
                      <img 
                        src={reply.avatar || 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=24&h=24&fit=crop&crop=face'} 
                        alt="回复者头像" 
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-xs text-gray-800">{reply.username}</span>
                          <span className="text-xs text-gray-500">{reply.time}</span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">{reply.content}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <button className="text-xs text-gray-500 hover:text-red-500 transition-colors duration-200">
                            <Heart className="w-2 h-2 inline mr-1" />
                            {reply.likes || 0}
                          </button>
                          <button className="text-xs text-gray-500 hover:text-blue-500 transition-colors duration-200">
                            回复
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;