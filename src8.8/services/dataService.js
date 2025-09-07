// src/services/dataService.js
import imageUtils from '../utils/imageUtils';

class DataService {
  constructor() {
    this.posts = [];
    this.statistics = null;
    this.isLoaded = false;
    this.cache = new Map(); // 缓存加载的数据
    this.imageCache = new Map(); // 缓存每个帖子的图片数组
  }

  async getAllPosts() {
    if (!this.isLoaded) {
      await this.loadData();
    }
    return this.posts;
  }

  async getStatistics() {
    if (!this.isLoaded) {
      await this.loadData();
    }
    return this.statistics;
  }

  async loadData() {
    try {
      console.log('🔄 DataService: 开始加载数据文件...');
      
      const startTime = performance.now();
      
      // 根据实际文件结构加载数据
      const [part1Data, part2Data, partNormalData, part1LLM, part2LLM, partNormalLLM] = await Promise.all([
        this.loadJsonFile('/data/part1_data/part1_posts.json'),
        this.loadJsonFile('/data/part2_data/part2_posts.json'), 
        this.loadJsonFile('/data/partnormal_data/partnormal_posts.json'),
        this.loadJsonFile('/data/part1_data/part1_llm_responses.json'),
        this.loadJsonFile('/data/part2_data/part2_llm_responses.json'),
        this.loadJsonFile('/data/partnormal_data/partnormal_llm_responses.json')
      ]);

      console.log('📊 原始数据统计:');
      console.log(`  - Part1帖子: ${part1Data?.length || 0} 条`);
      console.log(`  - Part2帖子: ${part2Data?.length || 0} 条`);
      console.log(`  - PartNormal帖子: ${partNormalData?.length || 0} 条`);
      console.log(`  - Part1 LLM: ${Object.keys(part1LLM || {}).length} 条`);
      console.log(`  - Part2 LLM: ${Object.keys(part2LLM || {}).length} 条`);
      console.log(`  - PartNormal LLM: ${Object.keys(partNormalLLM || {}).length} 条`);

      // 合并所有帖子数据
      let allPosts = [];
      
      if (part1Data && Array.isArray(part1Data)) {
        allPosts = allPosts.concat(part1Data.map((post, index) => ({
          ...post,
          source: 'Part1',
          id: post.note_id || post.id || `part1_${index}`,
          originalIndex: index
        })));
      }
      
      if (part2Data && Array.isArray(part2Data)) {
        allPosts = allPosts.concat(part2Data.map((post, index) => ({
          ...post,
          source: 'Part2', 
          id: post.note_id || post.id || `part2_${index}`,
          originalIndex: index
        })));
      }
      
      if (partNormalData && Array.isArray(partNormalData)) {
        allPosts = allPosts.concat(partNormalData.map((post, index) => ({
          ...post,
          source: 'PartNormal',
          id: post.note_id || post.id || `normal_${index}`,
          originalIndex: index
        })));
      }

      console.log(`🔗 合并后总数据量: ${allPosts.length} 条`);

      // 合并所有LLM响应
      const allLLMData = {
        ...part1LLM,
        ...part2LLM, 
        ...partNormalLLM
      };

      // 处理数据
      const processedPosts = await this.processPosts(allPosts, allLLMData);
      this.posts = processedPosts;
      
      // 生成统计信息
      this.statistics = this.generateStatistics(processedPosts);
      
      const endTime = performance.now();
      console.log(`✅ DataService: 数据处理完成，耗时 ${Math.round(endTime - startTime)}ms`);
      console.log(`📊 最终数据: ${processedPosts.length} 条有效帖子`);
      
      this.isLoaded = true;
      
    } catch (error) {
      console.error('❌ DataService: 数据加载失败:', error);
      throw new Error(`数据加载失败: ${error.message}`);
    }
  }

  async loadJsonFile(path) {
    // 检查缓存
    if (this.cache.has(path)) {
      console.log(`📋 从缓存加载: ${path}`);
      return this.cache.get(path);
    }

    try {
      console.log(`📄 加载文件: ${path}`);
      const response = await fetch(path);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`⚠️ 文件不存在: ${path}`);
          return null;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ 文件加载成功: ${path} (${Array.isArray(data) ? data.length : Object.keys(data || {}).length} 条记录)`);
      
      // 缓存数据
      this.cache.set(path, data);
      return data;
      
    } catch (error) {
      console.error(`❌ 文件加载失败: ${path}`, error);
      return null;
    }
  }

  async processPosts(posts, llmData) {
    console.log('🔄 开始处理帖子数据...');
    
    // 首先同步处理所有帖子的基本信息
    const processedPosts = posts
      .map(post => this.processPost(post, llmData))
      .filter(post => post !== null);
    
    console.log(`✅ 基础帖子处理完成: ${processedPosts.length}/${posts.length} 条有效`);
    
    // 异步处理图片信息（批量处理提高性能）
    console.log('🖼️ 开始处理图片信息...');
    await this.processPostImages(processedPosts);
    console.log('✅ 图片信息处理完成');
      
    return processedPosts;
  }

  processPost(post, llmData) {
    try {
      // 基本数据结构化
      const processed = {
        // 基本信息
        id: post.id || post.note_id || `unknown_${Date.now()}`,
        noteId: post.note_id || post.id,
        source: post.source,
        originalIndex: post.originalIndex,
        
        // 内容信息
        title: post.title || '',
        content: post.desc || post.content || '',
        type: post.type || 'normal',
        
        // 用户信息
        userId: post.user_id || '',
        nickname: post.nickname || '匿名用户',
        avatar: post.avatar || '',
        
        // 图片信息 - 新的处理逻辑
        image: null, // 将在后面异步设置
        images: [], // 将在后面异步设置
        imageCount: 0, // 将在后面异步设置
        imageFolder: post.image_folder_path || '',
        originalImageList: post.image_list || post.image || '',
        
        // 互动数据
        likedCount: this.safeParseInt(post.liked_count) || 0,
        collectedCount: this.safeParseInt(post.collected_count) || 0,
        commentCount: this.safeParseInt(post.comment_count) || 0,
        shareCount: this.safeParseInt(post.share_count) || 0,
        
        // 时间信息
        time: this.safeParseInt(post.time) || Date.now(),
        lastModifyTs: post.last_modify_ts || 0,
        lastUpdateTime: post.last_update_time || 0,
        
        // 位置和标签
        location: post.ip_location || '',
        tags: this.parseTags(post.tag_list),
        sourceKeyword: post.source_keyword || '',
        
        // 评论数据
        comments: this.processComments(post.all_comments || []),
        
        // 其他
        noteUrl: post.note_url || '',
        videoUrl: post.video_url || ''
      };

      // 添加审核信息
      processed.moderation = this.createModerationResult(llmData, processed);
      
      return processed;
      
    } catch (error) {
      console.error('❌ 处理帖子失败:', error, post);
      return null;
    }
  }

  processComments(comments) {
    if (!Array.isArray(comments)) return [];
    
    return comments
      .map(comment => ({
        id: comment.id || comment.comment_id || Date.now(),
        content: comment.content || comment.text || '',
        userId: comment.user_id || '',
        nickname: comment.nickname || '匿名用户',
        avatar: comment.avatar || '',
        time: this.safeParseInt(comment.create_time) || Date.now(),
        likedCount: this.safeParseInt(comment.liked_count) || 0,
        parentId: comment.parent_comment_id || '0',
        replies: comment.replies || []
      }))
      .filter(comment => comment.content.trim().length > 0);
  }

  parseTags(tagList) {
    if (!tagList) return [];
    
    try {
      if (typeof tagList === 'string') {
        // 尝试解析JSON
        if (tagList.startsWith('[') || tagList.startsWith('{')) {
          return JSON.parse(tagList);
        }
        // 按分隔符拆分
        return tagList.split(/[,，、;；]/).map(tag => tag.trim()).filter(tag => tag);
      }
      
      if (Array.isArray(tagList)) {
        return tagList.map(tag => String(tag).trim()).filter(tag => tag);
      }
      
      return [];
    } catch (error) {
      console.warn('标签解析失败:', tagList, error);
      return [];
    }
  }

  safeParseInt(value, defaultValue = 0) {
    if (typeof value === 'number') return Math.floor(value);
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  }

  /**
   * 批量处理帖子图片信息
   * @param {Array} posts - 帖子数组
   */
  async processPostImages(posts) {
    const batchSize = 10; // 批量处理大小
    
    for (let i = 0; i < posts.length; i += batchSize) {
      const batch = posts.slice(i, i + batchSize);
      const batchPromises = batch.map(post => this.processSinglePostImages(post));
      
      try {
        await Promise.all(batchPromises);
        console.log(`📸 图片批次处理完成: ${Math.floor(i / batchSize) + 1}/${Math.ceil(posts.length / batchSize)}`);
      } catch (error) {
        console.error('图片批次处理失败:', error);
        // 如果批量失败，逐个处理
        for (const post of batch) {
          try {
            await this.processSinglePostImages(post);
          } catch (individualError) {
            console.error(`图片处理失败 (帖子 ${post.id}):`, individualError);
          }
        }
      }
    }
  }

  /**
   * 处理单个帖子的图片信息
   * @param {Object} post - 帖子对象
   */
  async processSinglePostImages(post) {
    if (!post.id) {
      post.image = null;
      post.images = [];
      post.imageCount = 0;
      return;
    }

    try {
      const cacheKey = `${post.source}_${post.userId}`;
      
      // 检查缓存
      let allImages;
      if (this.imageCache.has(cacheKey)) {
        allImages = this.imageCache.get(cacheKey);
      } else {
        // 获取该用户的所有图片路径
        allImages = await imageUtils.getAllImagePaths(post.id, post.source);
        this.imageCache.set(cacheKey, allImages);
      }
      
      // 更新帖子的图片信息
      post.images = allImages;
      post.imageCount = allImages.length;
      post.image = allImages.length > 0 ? allImages[0] : null; // 保持向后兼容

    } catch (error) {
      console.warn(`处理帖子图片失败 (${post.id}):`, error);
      post.image = null;
      post.images = [];
      post.imageCount = 0;
    }
  }

  // 图片路径处理 - 使用imageUtils
  getImagePath(imageName, source = 'Part1', noteIdId = null) {
    return imageUtils.getImagePath(imageName, source, noteIdId);
  }

  // 头像路径处理 - 使用imageUtils
  getAvatarPath(avatarPath, userId = '', source = 'Part1') {
    return imageUtils.getAvatarPath(avatarPath, userId, source);
  }

  // 时间格式化
  formatTime(timeValue) {
    if (!timeValue) return '刚刚';
    
    try {
      let date;
      
      // 处理时间戳
      if (typeof timeValue === 'string' && /^\d+$/.test(timeValue)) {
        const timestamp = parseInt(timeValue);
        date = new Date(timestamp > 1e10 ? timestamp : timestamp * 1000);
      } else if (typeof timeValue === 'number') {
        date = new Date(timeValue > 1e10 ? timeValue : timeValue * 1000);
      } else {
        date = new Date(timeValue);
      }
      
      if (isNaN(date.getTime())) {
        return String(timeValue);
      }
      
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      
      if (minutes < 1) return '刚刚';
      if (minutes < 60) return `${minutes}分钟前`;
      if (hours < 24) return `${hours}小时前`;
      if (days < 7) return `${days}天前`;
      
      return date.toLocaleDateString('zh-CN', {
        month: 'numeric',
        day: 'numeric'
      });
      
    } catch (error) {
      return String(timeValue);
    }
  }

  createModerationResult(llmData, post) {
    const defaultModeration = {
      isSafe: true,
      needsReview: false,
      isBlocked: false,
      reasons: [],
      confidence: 0.95,
      commentsBlocked: false,
      results: {
        overall: {
          decision: 'safe',
          hasViolentContent: false,
          hasInappropriateContent: false,
          hasEmotionalContent: false,
          hasExcessiveSlang: false
        },
        text: { isSafe: true, reasons: [] },
        image: { isSafe: true, reasons: [] },
        comments: { isSafe: true, reasons: [], blockedCount: 0 }
      }
    };

    if (!llmData || typeof llmData !== 'object') {
      return defaultModeration;
    }

    try {
      // 尝试多种方式匹配LLM结果
      let llmResult = null;
      
      // 方式1: 直接用note_id匹配
      const noteId = post.id.replace(/^(part1_|part2_|normal_)/, '');
      if (llmData[noteId]) {
        llmResult = llmData[noteId];
      }
      
      // 方式2: 用完整ID匹配
      if (!llmResult && llmData[post.id]) {
        llmResult = llmData[post.id];
      }
      
      // 方式3: 用原始索引匹配
      if (!llmResult && post.originalIndex !== undefined) {
        const indexKey = `${post.source}_${post.originalIndex}`;
        llmResult = llmData[indexKey] || llmData[post.originalIndex];
      }

      if (!llmResult) {
        return defaultModeration;
      }

      // 解析LLM结果 - 支持多种格式
      return this.parseLLMResult(llmResult);
      
    } catch (error) {
      console.warn('审核数据解析失败:', error, post.id);
      return defaultModeration;
    }
  }

  parseLLMResult(llmResult) {
    try {
      // 处理不同格式的LLM结果
      let analysis = llmResult;
      
      // 如果有analysis字段，使用它
      if (llmResult.analysis) {
        analysis = llmResult.analysis;
      }
      
      // 如果有overall字段，使用它
      if (llmResult.overall && llmResult.overall.analysis) {
        analysis = llmResult.overall.analysis;
      }

      // 确定总体决策
      let decision = 'safe';
      let isSafe = true;
      let needsReview = false;
      let isBlocked = false;
      
      if (analysis.final_decision) {
        decision = analysis.final_decision;
      } else if (analysis.decision) {
        decision = analysis.decision;
      } else if (analysis.is_safe === false) {
        decision = 'block';
      } else if (analysis.needs_review === true) {
        decision = 'review';
      }
      
      // 根据决策设置状态
      switch (decision.toLowerCase()) {
        case 'block':
        case 'blocked':
          isBlocked = true;
          isSafe = false;
          break;
        case 'review':
        case 'needs_review':
          needsReview = true;
          isSafe = false;
          break;
        case 'safe':
          isSafe = true;
          break;
        default:
          // 默认为安全状态
          isSafe = true;
          break;
      }

      // 构建详细结果
      const moderation = {
        isSafe: isSafe,
        needsReview: needsReview,
        isBlocked: isBlocked,
        reasons: analysis.reasons || analysis.issues || [],
        confidence: analysis.confidence || 0.8,
        commentsBlocked: isBlocked,
        results: {
          overall: {
            decision: decision,
            hasViolentContent: analysis.violent_content || false,
            hasInappropriateContent: analysis.inappropriate_content || false,
            hasEmotionalContent: analysis.emotional_content || false,
            hasExcessiveSlang: analysis.excessive_slang || false
          },
          text: this.parseContentResult(llmResult.text || analysis.text),
          image: this.parseContentResult(llmResult.image || analysis.image),
          comments: this.parseCommentsResult(llmResult.comments || analysis.comments)
        }
      };

      return moderation;
      
    } catch (error) {
      console.warn('LLM结果解析失败:', error);
      return {
        isSafe: true,
        needsReview: false,
        isBlocked: false,
        reasons: [],
        confidence: 0.5,
        commentsBlocked: false,
        results: {
          overall: { decision: 'safe' },
          text: { isSafe: true, reasons: [] },
          image: { isSafe: true, reasons: [] },
          comments: { isSafe: true, reasons: [], blockedCount: 0 }
        }
      };
    }
  }

  parseContentResult(contentResult) {
    if (!contentResult) {
      return { isSafe: true, reasons: [] };
    }

    const result = {
      isSafe: contentResult.is_safe !== false,
      reasons: contentResult.reasons || contentResult.issues || [],
      confidence: contentResult.confidence || 0.8
    };

    // 如果有违规内容，设置为不安全
    if (contentResult.has_violation || contentResult.violation || contentResult.blocked) {
      result.isSafe = false;
    }

    return result;
  }

  parseCommentsResult(commentsResult) {
    if (!commentsResult) {
      return { isSafe: true, reasons: [], blockedCount: 0 };
    }

    return {
      isSafe: commentsResult.is_safe !== false,
      reasons: commentsResult.reasons || commentsResult.issues || [],
      blockedCount: commentsResult.blocked_count || 0,
      confidence: commentsResult.confidence || 0.8
    };
  }

  generateStatistics(posts) {
    const stats = {
      totalPosts: posts.length,
      totalUsers: 0,
      safeContent: 0,
      blockedContent: 0,
      reviewContent: 0,
      withImages: 0,
      withComments: 0,
      avgInteractions: 0,
      sourcesBreakdown: {},
      timeRange: { earliest: null, latest: null }
    };

    const userSet = new Set();
    let totalInteractions = 0;
    let earliestTime = Infinity;
    let latestTime = 0;

    posts.forEach(post => {
      // 用户统计
      if (post.userId) {
        userSet.add(post.userId);
      }

      // 安全性统计
      if (post.moderation.isSafe) {
        stats.safeContent++;
      } else if (post.moderation.isBlocked) {
        stats.blockedContent++;
      } else if (post.moderation.needsReview) {
        stats.reviewContent++;
      }

      // 内容类型统计
      if (post.image) {
        stats.withImages++;
      }

      if (post.comments && post.comments.length > 0) {
        stats.withComments++;
      }

      // 互动统计
      const interactions = (post.likedCount || 0) + (post.commentCount || 0) + (post.collectedCount || 0);
      totalInteractions += interactions;

      // 来源统计
      if (!stats.sourcesBreakdown[post.source]) {
        stats.sourcesBreakdown[post.source] = 0;
      }
      stats.sourcesBreakdown[post.source]++;

      // 时间范围
      const postTime = post.time || 0;
      if (postTime > 0) {
        if (postTime < earliestTime) earliestTime = postTime;
        if (postTime > latestTime) latestTime = postTime;
      }
    });

    stats.totalUsers = userSet.size;
    stats.avgInteractions = posts.length > 0 ? Math.round(totalInteractions / posts.length) : 0;
    
    if (earliestTime !== Infinity) {
      stats.timeRange.earliest = new Date(earliestTime > 1e10 ? earliestTime : earliestTime * 1000);
    }
    if (latestTime > 0) {
      stats.timeRange.latest = new Date(latestTime > 1e10 ? latestTime : latestTime * 1000);
    }

    return stats;
  }

  // 分页支持方法
  async getPostsPage(page = 1, pageSize = 20, filters = {}) {
    const allPosts = await this.getAllPosts();
    
    // 应用过滤器
    let filteredPosts = allPosts;
    
    if (filters.search) {
      const keyword = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title?.toLowerCase().includes(keyword) ||
        post.content?.toLowerCase().includes(keyword) ||
        post.nickname?.toLowerCase().includes(keyword)
      );
    }
    
    if (filters.type && filters.type !== 'all') {
      switch (filters.type) {
        case 'safe':
          filteredPosts = filteredPosts.filter(post => post.moderation.isSafe);
          break;
        case 'blocked':
          filteredPosts = filteredPosts.filter(post => post.moderation.isBlocked);
          break;
        case 'review':
          filteredPosts = filteredPosts.filter(post => post.moderation.needsReview);
          break;
        case 'image':
          filteredPosts = filteredPosts.filter(post => post.image);
          break;
        case 'text':
          filteredPosts = filteredPosts.filter(post => !post.image);
          break;
        default:
          // 保持原有的filteredPosts，不做额外过滤
          break;
      }
    }

    // 分页计算
    const totalItems = filteredPosts.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredPosts.slice(startIndex, endIndex);

    return {
      data: pageData,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalItems: totalItems,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  // 清理缓存
  clearCache() {
    this.cache.clear();
    this.isLoaded = false;
    this.posts = [];
    this.statistics = null;
  }

  // 获取帖子详情（包含完整评论数据）
  async getPostDetail(postId) {
    const allPosts = await this.getAllPosts();
    return allPosts.find(post => post.id === postId || post.noteId === postId);
  }

  // 搜索相关帖子
  async searchPosts(query, limit = 10) {
    if (!query || typeof query !== 'string') return [];
    
    const allPosts = await this.getAllPosts();
    const keyword = query.toLowerCase().trim();
    
    return allPosts
      .filter(post => 
        post.title?.toLowerCase().includes(keyword) ||
        post.content?.toLowerCase().includes(keyword) ||
        post.nickname?.toLowerCase().includes(keyword) ||
        post.tags?.some(tag => tag.toLowerCase().includes(keyword))
      )
      .slice(0, limit);
  }

  // 获取用户的所有帖子
  async getUserPosts(userId, limit = 20) {
    if (!userId) return [];
    
    const allPosts = await this.getAllPosts();
    return allPosts
      .filter(post => post.userId === userId)
      .slice(0, limit);
  }

  // 获取热门标签
  async getPopularTags(limit = 20) {
    const allPosts = await this.getAllPosts();
    const tagCounts = new Map();
    
    allPosts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (tag) {
            const count = tagCounts.get(tag) || 0;
            tagCounts.set(tag, count + 1);
          }
        });
      }
    });
    
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));
  }
}

export default DataService;