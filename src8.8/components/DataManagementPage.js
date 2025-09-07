// src/components/DataManagementPage.js
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  BarChart3, 
  Shield, 
  AlertTriangle, 
  Eye,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { dataService } from '../services/dataService.js';
import ModeratedPostCard from './ModeratedPostCard.js';

const DataManagementPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [statistics, setStatistics] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('📊 DataManagementPage: 开始加载数据...');
      
      const [postsData, statsData] = await Promise.all([
        dataService.getAllPosts(),
        dataService.getStatistics()
      ]);
      
      setPosts(postsData);
      setStatistics(statsData);
      console.log('✅ DataManagementPage: 数据加载完成');
    } catch (error) {
      console.error('❌ DataManagementPage: 数据加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = async () => {
    let result = posts;

    // 根据状态过滤
    if (filterStatus !== 'all') {
      switch (filterStatus) {
        case 'safe':
          result = posts.filter(post => post.moderation.isSafe);
          break;
        case 'review':
          result = posts.filter(post => post.moderation.needsReview);
          break;
        case 'blocked':
          result = posts.filter(post => !post.moderation.isSafe);
          break;
        default:
          result = posts;
      }
    }

    // 根据搜索关键词过滤
    if (searchQuery.trim()) {
      const lowerKeyword = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(lowerKeyword) ||
        post.content.toLowerCase().includes(lowerKeyword) ||
        post.author.nickname.toLowerCase().includes(lowerKeyword) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)) ||
        (post.sourceKeyword && post.sourceKeyword.toLowerCase().includes(lowerKeyword))
      );
    }

    setFilteredPosts(result);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    loadData();
  };

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  const FilterButton = ({ status, label, count, isActive, onClick }) => (
    <button
      onClick={() => onClick(status)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label} {count !== undefined && `(${count.toLocaleString()})`}
    </button>
  );

  // 分页逻辑
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
          <p className="text-gray-600 text-lg mb-2">正在加载数据管理页面...</p>
          <p className="text-gray-500 text-sm">处理中，请稍候...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">数据管理中心</h1>
              <p className="text-gray-600 mt-1">智能内容审核与数据分析平台</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw size={16} />
                刷新数据
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download size={16} />
                导出数据
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 统计卡片 */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="总帖子数"
              value={statistics.total.toLocaleString()}
              icon={BarChart3}
              color="bg-blue-500"
              description="已处理的帖子总数"
            />
            <StatCard
              title="安全内容"
              value={statistics.safe.toLocaleString()}
              icon={Shield}
              color="bg-green-500"
              description={`${statistics.safePercentage}% 通过审核`}
            />
            <StatCard
              title="需要审核"
              value={statistics.needsReview.toLocaleString()}
              icon={AlertTriangle}
              color="bg-yellow-500"
              description={`${statistics.reviewPercentage}% 待处理`}
            />
            <StatCard
              title="评论屏蔽"
              value={statistics.commentsBlocked.toLocaleString()}
              icon={Eye}
              color="bg-red-500"
              description="评论区被屏蔽的帖子"
            />
          </div>
        )}

        {/* 搜索和过滤 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="搜索帖子内容、作者或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={20} className="text-gray-500" />
              <FilterButton
                status="all"
                label="全部"
                count={posts.length}
                isActive={filterStatus === 'all'}
                onClick={setFilterStatus}
              />
              <FilterButton
                status="safe"
                label="安全"
                count={statistics?.safe}
                isActive={filterStatus === 'safe'}
                onClick={setFilterStatus}
              />
              <FilterButton
                status="review"
                label="待审核"
                count={statistics?.needsReview}
                isActive={filterStatus === 'review'}
                onClick={setFilterStatus}
              />
              <FilterButton
                status="blocked"
                label="已屏蔽"
                count={statistics ? statistics.total - statistics.safe : 0}
                isActive={filterStatus === 'blocked'}
                onClick={setFilterStatus}
              />
            </div>
          </div>
          
          {/* 搜索结果统计 */}
          <div className="mt-4 text-sm text-gray-600">
            {searchQuery && (
              <p>搜索 "{searchQuery}" 的结果: {filteredPosts.length} 个帖子</p>
            )}
            {filterStatus !== 'all' && !searchQuery && (
              <p>筛选结果: {filteredPosts.length} 个帖子</p>
            )}
          </div>
        </div>

        {/* 帖子列表 */}
        <div className="space-y-6">
          {currentPosts.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <BarChart3 className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无数据</h3>
              <p className="text-gray-600">
                {searchQuery || filterStatus !== 'all' 
                  ? '没有找到符合条件的帖子，请尝试调整搜索条件' 
                  : '还没有加载任何帖子数据，请检查数据文件是否正确放置'
                }
              </p>
              {(searchQuery || filterStatus !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  清除筛选条件
                </button>
              )}
            </div>
          ) : (
            currentPosts.map((post) => (
              <ModeratedPostCard 
                key={post.id} 
                post={post} 
                showModerationInfo={true}
              />
            ))
          )}
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              上一页
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* 页面底部信息 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          显示第 {indexOfFirstPost + 1} - {Math.min(indexOfLastPost, filteredPosts.length)} 条，
          共 {filteredPosts.length.toLocaleString()} 条结果
          {filteredPosts.length !== posts.length && (
            <span className="ml-2">
              (从 {posts.length.toLocaleString()} 条总数据中筛选)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataManagementPage;