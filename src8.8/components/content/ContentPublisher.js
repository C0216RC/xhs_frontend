import React, { useState, useRef } from 'react';
import { Upload, X, Image, Hash, MapPin, Smile, Video } from 'lucide-react';
import ContentDisplay from './ContentDisplay';
import { useContentModeration } from '../../hooks/useContentModeration';
import { useImageUpload } from '../../hooks/useImageUpload';

const ContentPublisher = ({ onPublish }) => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [location, setLocation] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    image,
    imagePreview,
    handleImageUpload,
    clearImage
  } = useImageUpload();
  
  const {
    textModeration,
    imageModeration,
    isAnalyzing
  } = useContentModeration(content, image);
  
  const fileInputRef = useRef(null);
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const canPublish = () => {
    const hasContent = content.trim() || image;
    const isSafe = (!textModeration || textModeration.isSafe) && 
                   (!imageModeration || imageModeration.isSafe);
    return hasContent && isSafe && !isAnalyzing;
  };
  
  const handlePublish = async () => {
    if (!canPublish()) return;
    
    setIsPublishing(true);
    
    try {
      const newPost = {
        id: Date.now(),
        username: '当前用户',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        content: content.trim(),
        image: imagePreview,
        time: '刚刚',
        likes: 0,
        comments: [],
        tags: tags,
        location: location,
        views: 0
      };
      
      onPublish(newPost);
      
      // 重置表单
      setContent('');
      setTags([]);
      setLocation('');
      setNewTag('');
      clearImage();
      setIsExpanded(false);
    } catch (error) {
      console.error('发布失败:', error);
    } finally {
      setIsPublishing(false);
    }
  };
  
  const hasUnsafeContent = (textModeration && !textModeration.isSafe) || 
                          (imageModeration && !imageModeration.isSafe);
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            alt="我的头像" 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">分享新鲜事</h3>
            <p className="text-sm text-gray-500">记录生活，分享美好</p>
          </div>
          {isAnalyzing && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-blue-600 font-medium">AI审核中</span>
            </div>
          )}
        </div>
      </div>
      
      {/* 内容输入区域 */}
      <div className="p-4">
        <div className="space-y-4">
          {/* 文本输入 */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="分享你的生活，记录美好时刻..."
              className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-200 bg-gray-50 focus:bg-white"
              rows={isExpanded ? 6 : 3}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {content.length}/2000
            </div>
          </div>
          
          {/* 文本审核结果预览 */}
          {textModeration && content.trim() && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">内容预览</span>
              </div>
              <ContentDisplay 
                content={content}
                type="text"
                moderationResult={textModeration}
              />
            </div>
          )}
          
          {/* 图片上传区域 */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />
            
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden bg-gray-50 p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">图片预览</span>
                </div>
                <div className="relative inline-block">
                  <ContentDisplay 
                    content={imagePreview}
                    type="image"
                    moderationResult={imageModeration}
                    className="max-w-md max-h-64 rounded-lg"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="group flex items-center justify-center space-x-3 w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full group-hover:bg-red-100 transition-colors duration-300">
                  <Upload className="w-6 h-6 text-gray-500 group-hover:text-red-500 transition-colors duration-300" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-700 group-hover:text-red-500 transition-colors duration-300">
                    点击上传图片
                  </p>
                  <p className="text-sm text-gray-500">支持 JPG、PNG、GIF 格式</p>
                </div>
              </button>
            )}
          </div>
          
          {/* 展开后的功能区域 */}
          {isExpanded && (
            <div className="space-y-4 animate-fadeIn">
              {/* 标签输入 */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="添加话题标签..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-200"
                    maxLength={20}
                  />
                  <button
                    onClick={handleAddTag}
                    disabled={!newTag.trim() || tags.length >= 10}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                  >
                    添加
                  </button>
                </div>
                
                {/* 标签列表 */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="group flex items-center space-x-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium hover:from-red-200 hover:to-pink-200 transition-all duration-200"
                      >
                        <span>#{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="w-4 h-4 text-red-400 hover:text-red-600 hover:bg-red-200 rounded-full flex items-center justify-center transition-all duration-200"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {tags.length >= 10 && (
                  <p className="text-xs text-gray-500">最多添加10个标签</p>
                )}
              </div>
              
              {/* 位置信息 */}
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="添加位置信息..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-200"
                />
              </div>
            </div>
          )}
          
          {/* 审核失败提示 */}
          {hasUnsafeContent && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-red-800 mb-2">检测到敏感内容</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {textModeration && !textModeration.isSafe && (
                      <li>• 文本内容：{textModeration.reason}</li>
                    )}
                    {imageModeration && !imageModeration.isSafe && (
                      <li>• 图片内容：{imageModeration.reason}</li>
                    )}
                  </ul>
                  <p className="text-sm text-red-600 mt-2 font-medium">
                    请修改内容后重新发布
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 底部功能栏 */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <Image className="w-4 h-4" />
              <span className="text-sm font-medium">图片</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200">
              <Video className="w-4 h-4" />
              <span className="text-sm font-medium">视频</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all duration-200">
              <Smile className="w-4 h-4" />
              <span className="text-sm font-medium">表情</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            {!isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
              >
                更多选项
              </button>
            )}
            
            <button
              onClick={handlePublish}
              disabled={!canPublish() || isPublishing}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105 disabled:transform-none"
            >
              {isPublishing && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{isPublishing ? '发布中...' : '发布'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPublisher;