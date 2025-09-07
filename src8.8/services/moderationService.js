import { apiClient } from './apiClient';

// 敏感词库（模拟）
const SENSITIVE_WORDS = [
  '敏感', '违规', '不当', '极端', '暴力', '政治', '色情', '赌博',
  '毒品', '恐怖', '仇恨', '歧视', '诈骗', '传销', '邪教'
];

// 模拟AI内容审核服务
export const moderateContent = async (content, type) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

  if (type === 'text') {
    return moderateText(content);
  } else if (type === 'image') {
    return moderateImage(content);
  }
  
  throw new Error('不支持的内容类型');
};

// 文本内容审核
const moderateText = async (text) => {
  const lowerText = text.toLowerCase();
  const foundSensitive = SENSITIVE_WORDS.some(word => 
    lowerText.includes(word.toLowerCase())
  );
  
  const isSafe = !foundSensitive;
  let summary = '';
  let reason = '';
  
  if (!isSafe) {
    summary = generateTextSummary(text);
    reason = '检测到可能的敏感词汇';
  }
  
  return {
    isSafe,
    confidence: isSafe ? 0.92 + Math.random() * 0.08 : 0.75 + Math.random() * 0.15,
    summary,
    reason,
    detectedWords: foundSensitive ? SENSITIVE_WORDS.filter(word => 
      lowerText.includes(word.toLowerCase())
    ) : []
  };
};

// 图片内容审核
const moderateImage = async (imageData) => {
  // 模拟图片分析
  const random = Math.random();
  const isSafe = random > 0.3; // 70% 概率通过
  
  let summary = '';
  let reason = '';
  
  if (!isSafe) {
    summary = generateImageSummary();
    reason = '检测到可能包含敏感视觉内容';
  }
  
  return {
    isSafe,
    confidence: isSafe ? 0.88 + Math.random() * 0.12 : 0.70 + Math.random() * 0.20,
    summary,
    reason,
    detectedObjects: ['person', 'object', 'scene'], // 模拟检测到的对象
    categories: isSafe ? ['safe'] : ['potentially_sensitive']
  };
};

// 生成文本摘要
const generateTextSummary = (text) => {
  const summaries = [
    '这是一段关于日常生活的分享内容',
    '作者表达了一些个人观点和想法',
    '内容包含了一些需要注意的话题',
    '这是一段情感表达类的文字内容',
    '作者在描述某个事件或经历',
    '内容涉及社会话题的讨论',
    '这是一段产品或服务的介绍文字'
  ];
  
  return summaries[Math.floor(Math.random() * summaries.length)];
};

// 生成图片描述
const generateImageSummary = () => {
  const summaries = [
    '这张图片显示了一个日常生活场景',
    '图片内容包含人物和环境元素', 
    '这是一张包含多个对象的生活照片',
    '图片展示了某个特定的场景或活动',
    '这张照片记录了一个特殊的时刻',
    '图片中包含了一些需要注意的视觉元素',
    '这是一张风景或建筑类的照片'
  ];
  
  return summaries[Math.floor(Math.random() * summaries.length)];
};

// 批量审核内容
export const moderateBatch = async (contents) => {
  const results = await Promise.all(
    contents.map(({ content, type, id }) => 
      moderateContent(content, type).then(result => ({
        id,
        ...result
      }))
    )
  );
  
  return results;
};

// 获取审核统计
export const getModerationStats = async () => {
  // 模拟获取审核统计数据
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    totalModerated: 1250,
    safeContent: 1125,
    flaggedContent: 125,
    accuracy: 0.94,
    lastUpdated: new Date().toISOString()
  };
};