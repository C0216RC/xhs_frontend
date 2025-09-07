// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, RefreshCw, XCircle, TrendingUp, Users, FileText, AlertTriangle } from 'lucide-react';
import ContentCard from './components/content/ContentCard';
import PostDetail from './components/PostDetail';
import Pagination from './components/common/Pagination';
import DataService from './services/dataService';
import './index.css';

function App() {
  // 状态管理
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPagePosts, setCurrentPagePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // 搜索和筛选状态
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(20); // 每页20个帖子
  const [totalPages, setTotalPages] = useState(0);
  
  // 统计信息
  const [statistics, setStatistics] = useState({
    totalPosts: 0,
    totalUsers: 0,
    safeContent: 0,
    blockedContent: 0
  });

  const dataService = new DataService();

  // 数据加载
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 App: 开始加载数据...');
      
      // 加载所有帖子数据
      const allPosts = await dataService.getAllPosts();
      const stats = await dataService.getStatistics();
      
      if (!allPosts || allPosts.length === 0) {
        throw new Error('没有找到有效的帖子数据，请检查数据文件是否存在');
      }

      console.log(`✅ App: 数据加载完成`);
      console.log(`📊 总帖子数: ${allPosts.length}`);
      console.log(`📊 统计信息:`, stats);

      // 数据预处理和调试 - 修改为使用新的图片结构
      if (process.env.NODE_ENV === 'development') {
        console.log('\n🔍 数据预览 (前5条):');
        allPosts.slice(0, 5).forEach((post, index) => {
          const imageInfo = post.images && post.images.length > 0 
            ? `${post.images.length}张图片: ${post.images[0]}` 
            : '无图片';
          console.log(`${index + 1}. ID: ${post.id}, 用户: ${post.userId}, 来源: ${post.source}, 图片: ${imageInfo}`);
        });
      }
      
      setPosts(allPosts);
      setStatistics(stats);
      
    } catch (error) {
      console.error('❌ App: 数据加载失败:', error);
      setError(error.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 搜索和筛选逻辑
  const filterPosts = useCallback(() => {
    let result = posts;

    // 搜索过滤
    if (searchQuery.trim()) {
      const keyword = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title?.toLowerCase().includes(keyword) ||
        post.content?.toLowerCase().includes(keyword) ||
        post.desc?.toLowerCase().includes(keyword) ||
        post.nickname?.toLowerCase().includes(keyword) ||
        post.tags?.some(tag => tag.toLowerCase().includes(keyword))
      );
    }

    // 类型过滤
    if (filterType !== 'all') {
      switch (filterType) {
        case 'text':
          result = result.filter(post => post.content && (!post.images || post.images.length === 0));
          break;
        case 'image':
          result = result.filter(post => post.images && post.images.length > 0);
          break;
        case 'safe':
          result = result.filter(post => post.moderation?.isSafe);
          break;
        case 'blocked':
          result = result.filter(post => post.moderation?.isBlocked);
          break;
        case 'review':
          result = result.filter(post => post.moderation?.needsReview);
          break;
        default:
          break;
      }
    }

    setFilteredPosts(result);
    
    // 重新计算分页
    const newTotalPages = Math.ceil(result.length / postsPerPage);
    setTotalPages(newTotalPages);
    
    // 如果当前页超出范围，重置到第一页
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(1);
    }
    
    console.log(`🔍 筛选结果: ${result.length} 条 (搜索: "${searchQuery}", 类型: ${filterType}, 总页数: ${newTotalPages})`);
  }, [posts, searchQuery, filterType, currentPage, postsPerPage]);

  // 分页逻辑 - 计算当前页的帖子
  const updateCurrentPagePosts = useCallback(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const pageData = filteredPosts.slice(startIndex, endIndex);
    
    setCurrentPagePosts(pageData);
    
    console.log(`📄 当前第${currentPage}页: ${pageData.length} 条帖子 (${startIndex + 1}-${Math.min(endIndex, filteredPosts.length)})`);
  }, [filteredPosts, currentPage, postsPerPage]);

  // 页面跳转处理
  const handlePageChange = (page) => {
    console.log(`📄 跳转到第 ${page} 页`);
    setCurrentPage(page);
    
    // 平滑滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 帖子点击处理
  const handlePostClick = (post) => {
    console.log('🔍 查看帖子详情:', post.id);
    setSelectedPost(post);
    setIsDetailOpen(true);
  };

  const closePostDetail = () => {
    setIsDetailOpen(false);
    setSelectedPost(null);
  };

  // Effect Hooks
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  useEffect(() => {
    updateCurrentPagePosts();
  }, [updateCurrentPagePosts]);

  // 渲染逻辑
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-red-500" size={48} />
          <p className="text-gray-600 text-lg mb-2">加载中...</p>
          <p className="text-gray-500 text-sm">正在加载小红书内容</p>
          <div className="mt-4 text-xs text-gray-400">
            <p>正在加载数据文件和LLM审核结果...</p>
            <p>预计需要几秒钟时间</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">数据加载失败</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-3">
            <button
              onClick={loadData}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              重新加载
            </button>
            <p className="text-sm text-gray-500">
              请确保数据文件已正确放置在 public/data/ 目录中
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">小</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">小红书数据分析</h1>
              </div>
              
              {/* 统计信息 */}
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <FileText size={16} />
                  <span>总帖子: {statistics.totalPosts}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>用户: {statistics.totalUsers}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp size={16} className="text-green-500" />
                  <span>安全: {statistics.safeContent}</span>
                </div>
                {statistics.blockedContent > 0 && (
                  <div className="flex items-center space-x-1">
                    <AlertTriangle size={16} className="text-red-500" />
                    <span>待审核: {statistics.blockedContent}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 页面信息 */}
            <div className="text-sm text-gray-600">
              第 {currentPage} 页，共 {totalPages} 页 (总计 {filteredPosts.length} 条)
            </div>
          </div>

          {/* 搜索和筛选 */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索内容、用户名或标签..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>

            {/* 筛选下拉 */}
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                <option value="all">全部内容</option>
                <option value="text">纯文字</option>
                <option value="image">有图片</option>
                <option value="safe">安全内容</option>
                <option value="blocked">被屏蔽</option>
                <option value="review">待审核</option>
              </select>
            </div>

            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
              <span>刷新</span>
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {currentPagePosts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">没有找到匹配的内容</h3>
            <p className="text-gray-600">尝试调整搜索条件或筛选器</p>
          </div>
        ) : (
          <>
            {/* 内容网格 */}
            <div className="masonry-container">
              {currentPagePosts.map((post, index) => (
                <div key={`${post.id}-${currentPage}-${index}`} className="masonry-item">
                  <ContentCard 
                    post={post} 
                    onClick={() => handlePostClick(post)}
                    dataService={dataService}
                  />
                </div>
              ))}
            </div>

            {/* 翻页组件 */}
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredPosts.length}
                itemsPerPage={postsPerPage}
              />
            </div>
          </>
        )}
      </main>

      {/* 帖子详情弹窗 */}
      {isDetailOpen && selectedPost && (
        <PostDetail
          post={selectedPost}
          isOpen={isDetailOpen}
          onClose={closePostDetail}
          dataService={dataService}
        />
      )}
    </div>
  );
}

export default App;