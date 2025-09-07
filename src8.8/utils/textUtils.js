// 文本长度限制
export const TEXT_LIMITS = {
  POST_CONTENT: 2000,
  COMMENT: 500,
  USERNAME: 50,
  TAG: 20
};

// 验证文本内容
export const validateText = (text, maxLength = TEXT_LIMITS.POST_CONTENT) => {
  const errors = [];
  
  if (!text || !text.trim()) {
    errors.push('内容不能为空');
    return { isValid: false, errors };
  }
  
  if (text.length > maxLength) {
    errors.push(`内容长度不能超过 ${maxLength} 个字符`);
  }
  
  // 检查特殊字符
  const dangerousChars = /<script|javascript:|data:/i;
  if (dangerousChars.test(text)) {
    errors.push('内容包含不安全字符');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 清理文本内容
export const sanitizeText = (text) => {
  if (!text) return '';
  
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// 提取标签
export const extractHashtags = (text) => {
  if (!text) return [];
  
  const hashtagRegex = /#[\u4e00-\u9fa5\w]+/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map(tag => tag.substring(1)) : [];
};

// 提取@用户
export const extractMentions = (text) => {
  if (!text) return [];
  
  const mentionRegex = /@[\u4e00-\u9fa5\w]+/g;
  const matches = text.match(mentionRegex);
  return matches ? matches.map(mention => mention.substring(1)) : [];
};

// 高亮标签和@用户
export const highlightText = (text) => {
  if (!text) return '';
  
  return text
    .replace(/#([\u4e00-\u9fa5\w]+)/g, '<span class="text-blue-600 font-medium">#$1</span>')
    .replace(/@([\u4e00-\u9fa5\w]+)/g, '<span class="text-green-600 font-medium">@$1</span>');
};

// 截断文本
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + suffix;
};

// 计算文本统计信息
export const getTextStats = (text) => {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      paragraphs: 0
    };
  }
  
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split(/\r\n|\r|\n/).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
  
  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs
  };
};

// 格式化文本显示
export const formatText = (text) => {
  if (!text) return '';
  
  return text
    .replace(/\n/g, '<br>')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

// 移除HTML标签
export const stripHtml = (html) => {
  if (!html) return '';
  
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// 转义HTML字符
export const escapeHtml = (text) => {
  if (!text) return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// 检查是否包含敏感词
export const containsSensitiveWords = (text, sensitiveWords = []) => {
  if (!text || !sensitiveWords.length) return false;
  
  const textLower = text.toLowerCase();
  return sensitiveWords.some(word => textLower.includes(word.toLowerCase()));
};

// 替换敏感词
export const replaceSensitiveWords = (text, sensitiveWords = [], replacement = '*') => {
  if (!text || !sensitiveWords.length) return text;
  
  let result = text;
  sensitiveWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    result = result.replace(regex, replacement.repeat(word.length));
  });
  
  return result;
};

// 生成文本摘要
export const generateSummary = (text, maxLength = 100) => {
  if (!text) return '';
  
  // 简单的摘要生成：取前几句话
  const sentences = text.split(/[。！？.!?]/).filter(s => s.trim());
  let summary = '';
  
  for (const sentence of sentences) {
    if ((summary + sentence).length > maxLength) break;
    summary += sentence + '。';
  }
  
  return summary || truncateText(text, maxLength);
};

// 检查文本相似度（简单实现）
export const calculateSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;
  
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

// 检测文本语言（简单实现）
export const detectLanguage = (text) => {
  if (!text) return 'unknown';
  
  const chineseRegex = /[\u4e00-\u9fa5]/;
  const englishRegex = /[a-zA-Z]/;
  
  const chineseCount = (text.match(chineseRegex) || []).length;
  const englishCount = (text.match(englishRegex) || []).length;
  
  if (chineseCount > englishCount) return 'zh';
  if (englishCount > chineseCount) return 'en';
  return 'mixed';
};

// 生成阅读时间估算
export const estimateReadingTime = (text, wordsPerMinute = 200) => {
  if (!text) return 0;
  
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return minutes;
};