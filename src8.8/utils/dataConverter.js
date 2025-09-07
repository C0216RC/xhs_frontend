// src/utils/dataConverter.js

export const formatTime = (timeStr) => {
  if (!timeStr) return '刚刚';
  
  try {
    let time;
    
    if (timeStr.includes('前')) {
      return timeStr;
    }
    
    if (timeStr.includes('-') || timeStr.includes('/')) {
      time = new Date(timeStr);
    } else {
      const timestamp = parseInt(timeStr);
      if (!isNaN(timestamp)) {
        time = new Date(timestamp > 1e10 ? timestamp : timestamp * 1000);
      } else {
        return timeStr;
      }
    }
    
    if (isNaN(time.getTime())) {
      return timeStr;
    }
    
    const now = new Date();
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    if (months < 12) return `${months}个月前`;
    return `${years}年前`;
    
  } catch (error) {
    console.warn('时间格式化失败:', error);
    return timeStr || '刚刚';
  }
};

export const formatCount = (count) => {
  if (!count || count === 0) return '0';
  
  const num = typeof count === 'string' ? parseInt(count.replace(/[^\d]/g, ''), 10) : count;
  
  if (isNaN(num) || num <= 0) return '0';
  if (num < 1000) return num.toString();
  if (num < 10000) return (num / 1000).toFixed(1).replace('.0', '') + 'k';
  if (num < 100000) return Math.round(num / 1000) + 'k';
  if (num < 1000000) return Math.round(num / 10000) + 'w';
  return Math.round(num / 1000000) + 'M';
};

export const extractImageInfo = (imagePath, post) => {
  if (!imagePath) return null;
  
  return {
    originalPath: imagePath,
    source: post.source,
    fileName: imagePath.split('/').pop(),
    directory: imagePath.substring(0, imagePath.lastIndexOf('/')),
    extension: imagePath.substring(imagePath.lastIndexOf('.') + 1),
    isValid: imagePath.includes('/data/')
  };
};

export const buildImagePaths = (post) => {
  if (!post.image) return [];
  
  const baseName = post.image.replace(/\.[^/.]+$/, '');
  const originalName = post.image;
  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  const paths = [];
  
  const sourceConfigs = [
    { source: 'Part1', path: '/data/Part1/images/' },
    { source: 'Part2', path: '/data/Part2/images/' },
    { source: 'PartNormal', path: '/data/PartNormal/' }
  ];
  
  const preferredSource = sourceConfigs.find(config => config.source === post.source);
  if (preferredSource) {
    extensions.forEach(ext => {
      paths.push(preferredSource.path + baseName + ext);
      paths.push(preferredSource.path + originalName);
    });
    
    if (post.id) {
      extensions.forEach(ext => {
        paths.push(preferredSource.path + post.id + ext);
      });
    }
    
    if (post.originalIndex !== undefined) {
      extensions.forEach(ext => {
        paths.push(preferredSource.path + post.originalIndex + ext);
        paths.push(preferredSource.path + post.source + '_' + post.originalIndex + ext);
      });
    }
  }
  
  sourceConfigs.forEach(config => {
    if (config.source !== post.source) {
      extensions.forEach(ext => {
        paths.push(config.path + baseName + ext);
        paths.push(config.path + originalName);
        
        if (post.id) {
          paths.push(config.path + post.id + ext);
        }
        
        if (post.originalIndex !== undefined) {
          paths.push(config.path + post.originalIndex + ext);
          paths.push(config.path + config.source + '_' + post.originalIndex + ext);
        }
      });
    }
  });
  
  return [...new Set(paths)];
};

export const validateImagePath = async (imagePath) => {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const findValidImagePath = async (post) => {
  const possiblePaths = buildImagePaths(post);
  
  for (const path of possiblePaths) {
    const isValid = await validateImagePath(path);
    if (isValid) {
      console.log(`✅ 找到有效图片路径: ${path}`);
      return path;
    }
  }
  
  console.warn(`❌ 未找到有效图片路径，帖子ID: ${post.id}, 图片: ${post.image}`);
  return null;
};

export const debugImagePaths = (post) => {
  const paths = buildImagePaths(post);
  console.log(`🔍 帖子 ${post.id} 的所有可能图片路径:`, paths);
  return paths;
};

export const cleanAndValidatePost = (rawPost, source, index) => {
  if (!rawPost) return null;
  
  const possibleTitles = [
    rawPost.title,
    rawPost.Title,
    rawPost.content?.substring(0, 50),
    rawPost.text?.substring(0, 50)
  ].filter(Boolean);
  
  const possibleContents = [
    rawPost.content,
    rawPost.Content,
    rawPost.text,
    rawPost.description,
    rawPost.desc
  ].filter(Boolean);
  
  const possibleImages = [
    rawPost.image,
    rawPost.Image,
    rawPost.imageUrl,
    rawPost.img,
    rawPost.photo,
    rawPost.picture
  ].filter(Boolean);
  
  const possibleAuthors = [
    rawPost.author,
    rawPost.user,
    rawPost.username,
    rawPost.authorName,
    rawPost.authorNickname,
    rawPost.nickname
  ].filter(Boolean);
  
  const post = {
    id: rawPost.id || `${source}_${index}`,
    title: possibleTitles[0] || '',
    content: possibleContents[0] || '',
    image: possibleImages[0] || null,
    source: source,
    originalIndex: index,
    
    author: {
      id: rawPost.authorId || rawPost.userId || `user_${source}_${index}`,
      nickname: typeof possibleAuthors[0] === 'string' 
        ? possibleAuthors[0] 
        : (possibleAuthors[0]?.nickname || possibleAuthors[0]?.name || '小红薯用户'),
      avatar: rawPost.authorAvatar || rawPost.avatar || null
    },
    
    stats: {
      likes: parseInt(rawPost.likes || rawPost.likeCount || rawPost.like_count || 0) || 0,
      comments: parseInt(rawPost.comments || rawPost.commentCount || rawPost.comment_count || 0) || 0,
      shares: parseInt(rawPost.shares || rawPost.shareCount || rawPost.share_count || 0) || 0,
      collections: parseInt(rawPost.collections || rawPost.collectCount || rawPost.collect_count || 0) || 0
    },
    
    tags: extractTags(rawPost.tags || rawPost.hashtags || rawPost.topics || []),
    publishTime: rawPost.publishTime || rawPost.createTime || rawPost.time || '刚刚',
    location: rawPost.location || rawPost.place || null
  };
  
  if (!post.title && !post.content) {
    console.warn(`⚠️ 跳过空内容帖子: ${post.id}`);
    return null;
  }
  
  return post;
};

const extractTags = (tags) => {
  if (!tags) return [];
  
  let tagArray = [];
  
  if (Array.isArray(tags)) {
    tagArray = tags;
  } else if (typeof tags === 'string') {
    tagArray = tags.split(/[,，#\s]+/).filter(t => t.trim());
  } else if (typeof tags === 'object') {
    tagArray = Object.values(tags).filter(t => typeof t === 'string');
  }
  
  return tagArray
    .map(tag => {
      const cleanTag = String(tag).replace(/^#/, '').trim();
      return cleanTag;
    })
    .filter(tag => tag.length > 0 && tag.length < 20)
    .slice(0, 5);
};

export const generateTestImageUrls = (post) => {
  const testUrls = [
    `https://picsum.photos/400/600?random=${post.id}`,
    `https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=600&fit=crop`,
    `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop`,
    `https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=600&fit=crop`
  ];
  
  const hash = post.id?.toString().split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return testUrls[Math.abs(hash) % testUrls.length];
};

export const logDataStructure = (data, name) => {
  if (!data) {
    console.log(`📊 ${name}: null 或 undefined`);
    return;
  }
  
  if (Array.isArray(data)) {
    console.log(`📊 ${name}: 数组，长度 ${data.length}`);
    if (data.length > 0) {
      console.log(`📋 ${name} 示例数据:`, {
        first: Object.keys(data[0]),
        sample: data[0]
      });
    }
  } else if (typeof data === 'object') {
    console.log(`📊 ${name}: 对象，键数量 ${Object.keys(data).length}`);
    const keys = Object.keys(data).slice(0, 5);
    console.log(`📋 ${name} 前5个键:`, keys);
    if (keys.length > 0) {
      console.log(`📋 ${name} 示例值:`, data[keys[0]]);
    }
  } else {
    console.log(`📊 ${name}: ${typeof data}, 值: ${data}`);
  }
};