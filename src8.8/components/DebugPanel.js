// src/components/DebugPanel.js
import React, { useState, useEffect } from 'react';
import { 
  Bug, 
  Database, 
  Image, 
  FileText, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react';
import { dataService } from '../services/dataService.js';

const DebugPanel = ({ posts, statistics }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [imageValidation, setImageValidation] = useState(null);
  const [testing, setTesting] = useState(false);

  const testImagePaths = async () => {
    setTesting(true);
    try {
      const result = await dataService.validateImagePaths();
      setImageValidation(result);
    } catch (error) {
      console.error('图片路径测试失败:', error);
    } finally {
      setTesting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('已复制到剪贴板');
    });
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
      >
        <Bug size={20} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">数据调试面板</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <EyeOff size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* 数据统计 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="text-blue-500" size={20} />
                <span className="font-medium">数据概览</span>
              </div>
              <div className="text-sm space-y-1">
                <p>总帖子数: {posts?.length || 0}</p>
                <p>安全内容: {statistics?.safe || 0}</p>
                <p>需审核: {statistics?.needsReview || 0}</p>
                <p>有图片: {statistics?.withImages || 0}</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Image className="text-green-500" size={20} />
                <span className="font-medium">图片状态</span>
              </div>
              <div className="text-sm space-y-1">
                {imageValidation ? (
                  <>
                    <p>有效: {imageValidation.validCount}</p>
                    <p>测试总数: {imageValidation.totalTested}</p>
                    <p>成功率: {Math.round((imageValidation.validCount / imageValidation.totalTested) * 100)}%</p>
                  </>
                ) : (
                  <p>未测试</p>
                )}
              </div>
              <button
                onClick={testImagePaths}
                disabled={testing}
                className="mt-2 flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50"
              >
                {testing ? <RefreshCw className="animate-spin" size={12} /> : <CheckCircle size={12} />}
                测试图片路径
              </button>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-yellow-500" size={20} />
                <span className="font-medium">内容分析</span>
              </div>
              <div className="text-sm space-y-1">
                <p>纯文字: {posts?.filter(p => !p.image).length || 0}</p>
                <p>图文混合: {posts?.filter(p => p.image && p.content).length || 0}</p>
                <p>有标签: {posts?.filter(p => p.tags?.length > 0).length || 0}</p>
              </div>
            </div>
          </div>

          {/* 帖子示例 */}
          <div>
            <h3 className="font-medium mb-3">帖子示例分析</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts?.slice(0, 4).map((post, index) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">帖子 #{index + 1}</span>
                    <button
                      onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                      className="text-blue-500 hover:text-blue-600 text-xs"
                    >
                      {selectedPost === post.id ? '收起' : '详情'}
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>ID:</strong> {post.id}</p>
                    <p><strong>来源:</strong> {post.source}</p>
                    <p><strong>标题:</strong> {post.title?.substring(0, 30)}...</p>
                    <p><strong>图片:</strong> {post.image ? '有' : '无'}</p>
                    <p><strong>安全:</strong> {post.moderation?.isSafe ? '是' : '否'}</p>
                    
                    {post.image && (
                      <div className="mt-2">
                        <p><strong>图片路径:</strong></p>
                        <code className="text-xs bg-gray-100 p-1 rounded block mt-1 break-all">
                          {dataService.buildImagePath(post)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(dataService.buildImagePath(post))}
                          className="mt-1 text-blue-500 hover:text-blue-600 text-xs flex items-center gap-1"
                        >
                          <Copy size={10} />
                          复制路径
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {selectedPost === post.id && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs space-y-2">
                        <div>
                          <strong>完整数据:</strong>
                          <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                            {JSON.stringify(post, null, 2)}
                          </pre>
                        </div>
                        
                        {post.image && (
                          <div>
                            <strong>所有可能图片路径:</strong>
                            <div className="bg-gray-100 p-2 rounded mt-1 max-h-40 overflow-y-auto">
                              {dataService.getAllPossibleImagePaths(post).map((path, i) => (
                                <div key={i} className="text-xs mb-1 flex items-center justify-between">
                                  <code>{path}</code>
                                  <button
                                    onClick={() => copyToClipboard(path)}
                                    className="text-blue-500 hover:text-blue-600 ml-2"
                                  >
                                    <Copy size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 图片验证结果 */}
          {imageValidation && (
            <div>
              <h3 className="font-medium mb-3">图片路径验证结果</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{imageValidation.validCount}</div>
                    <div className="text-sm text-gray-600">有效路径</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {imageValidation.totalTested - imageValidation.validCount}
                    </div>
                    <div className="text-sm text-gray-600">无效路径</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((imageValidation.validCount / imageValidation.totalTested) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">成功率</div>
                  </div>
                </div>
                
                {imageValidation.invalidPosts?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">失败示例:</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {imageValidation.invalidPosts.slice(0, 5).map((item, index) => (
                        <div key={index} className="text-xs bg-white p-2 rounded border">
                          <p><strong>帖子:</strong> {item.post.id}</p>
                          <p><strong>路径:</strong> <code>{item.imagePath}</code></p>
                          <p><strong>错误:</strong> {item.status || item.error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => console.log('Posts:', posts)}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                打印Posts到控制台
              </button>
              <button
                onClick={() => console.log('Statistics:', statistics)}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                打印Statistics
              </button>
              <button
                onClick={testImagePaths}
                disabled={testing}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                {testing ? '测试中...' : '重新测试图片'}
              </button>
            </div>
            
            <button
              onClick={() => setIsVisible(false)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;