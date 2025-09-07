// 生成示例帖子数据 - 更真实的小红书风格内容
export const generateSamplePosts = () => {
  const sampleImages = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'
  ];

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1494790108755-2616b612f0c6?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face'
  ];

  return [
    {
      id: 1,
      username: '小红书美食家Lisa',
      avatar: sampleAvatars[0],
      content: '今天在新开的网红咖啡店发现了这款超好看的彩虹拿铁☕️ 颜值真的太高了！拍照打卡必备～味道也很不错，奶泡绵密，咖啡香浓，店内装修也是ins风满满💕',
      image: sampleImages[0],
      time: '2小时前',
      likes: 1248,
      views: 8932,
      location: '上海·静安区',
      comments: [
        {
          id: 1,
          username: '咖啡控小仙女',
          content: '哇塞！这颜值也太高了吧！请问是哪家店呀？我也想去打卡～',
          avatar: sampleAvatars[1],
          time: '1小时前',
          likes: 23,
          replies: [
            {
              id: 11,
              username: '小红书美食家Lisa',
              content: '是静安区的Rainbow Café，就在地铁站附近很好找的！',
              time: '30分钟前',
              likes: 5
            }
          ]
        },
        {
          id: 2,
          username: '拍照达人阿俊',
          content: '这个光线拍得真好！能分享一下拍照技巧吗？',
          avatar: sampleAvatars[2],
          time: '45分钟前',
          likes: 18
        }
      ],
      tags: ['美食', '咖啡', '打卡', '上海美食', 'ins风']
    },
    {
      id: 2,
      username: '时尚博主小慧',
      avatar: sampleAvatars[1],
      content: '分享一个超实用的秋冬穿搭！🍂 这件毛衣是我今年买的最满意的单品，颜色温柔质感也很好。搭配这条阔腿裤显腿长又显瘦，包包是vintage款超有质感～整体look既温暖又时髦！',
      image: sampleImages[1],
      time: '5小时前',
      likes: 2156,
      views: 15678,
      location: '北京·朝阳区',
      comments: [
        {
          id: 3,
          username: '穿搭小白兔',
          content: '好好看！请问毛衣是什么牌子的呀？价位大概多少？',
          avatar: sampleAvatars[3],
          time: '3小时前',
          likes: 45
        },
        {
          id: 4,
          username: '购物狂魔',
          content: '这套搭配我已经截图保存了！太适合秋天了～',
          avatar: sampleAvatars[4],
          time: '2小时前',
          likes: 32,
          image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=150&fit=crop'
        }
      ],
      tags: ['穿搭', '秋冬时尚', 'OOTD', '毛衣', '阔腿裤']
    },
    {
      id: 3,
      username: '旅行摄影师Mark',
      avatar: sampleAvatars[2],
      content: '日落时分的海边真的太治愈了🌅 这次旅行最难忘的就是这个moment，海风轻拂，夕阳西下，一切都慢下来了。虽然路上遇到了一些小困难，但看到这样的美景一切都值得了！',
      image: sampleImages[2],
      time: '1天前',
      likes: 3421,
      views: 28956,
      location: '三亚·海棠湾',
      comments: [
        {
          id: 5,
          username: '旅行爱好者',
          content: '太美了！这是什么时候拍的？我下个月也要去三亚！',
          avatar: sampleAvatars[5],
          time: '18小时前',
          likes: 67
        },
        {
          id: 6,
          username: '摄影小白',
          content: '请教一下这是用什么设备拍的？参数能分享吗？',
          avatar: sampleAvatars[0],
          time: '12小时前',
          likes: 34
        }
      ],
      tags: ['旅行', '摄影', '日落', '三亚', '治愈系']
    },
    {
      id: 4,
      username: '健身教练Annie',
      avatar: sampleAvatars[3],
      content: '今天的训练真的把我累坏了💪 不过看到镜子里的自己还是很满意的！坚持健身一年多，从最开始的小白到现在能够独立完成各种训练动作，真的很有成就感～分享给大家我的健身心得：consistency is key！',
      image: sampleImages[3],
      time: '3天前',
      likes: 987,
      views: 12345,
      location: '广州·天河区',
      comments: [
        {
          id: 7,
          username: '健身新手小李',
          content: '教练太厉害了！我也想开始健身，有什么建议吗？',
          avatar: sampleAvatars[4],
          time: '2天前',
          likes: 28
        },
        {
          id: 8,
          username: '减肥中的小美',
          content: '身材太好了！能分享一下训练计划吗？',
          avatar: sampleAvatars[1],
          time: '1天前',
          likes: 45
        }
      ],
      tags: ['健身', '训练', '坚持', '马甲线', '健康生活']
    },
    {
      id: 5,
      username: '学霸小王同学',
      avatar: sampleAvatars[4],
      content: '图书馆学习的一天📚 最近在准备期末考试，虽然压力很大但还是要保持积极的心态！今天又学会了好多新知识，感觉很充实。有时候会想一些不当的方法来应付考试，但最终还是选择踏实学习💪',
      time: '1周前',
      likes: 567,
      views: 4321,
      location: '北京·海淀区',
      comments: [
        {
          id: 9,
          username: '同窗好友',
          content: '一起加油！期末考试我们都能顺利通过的！',
          avatar: sampleAvatars[5],
          time: '6天前',
          likes: 12
        },
        {
          id: 10,
          username: '学长学姐',
          content: '踏实学习才是王道，加油！',
          avatar: sampleAvatars[2],
          time: '5天前',
          likes: 8
        }
      ],
      tags: ['学习', '考试', '图书馆', '努力', '大学生活']
    },
    {
      id: 6,
      username: '美妆达人Coco',
      avatar: sampleAvatars[5],
      content: '今天试了这个新的口红色号💄 是今年很火的"枫叶红"，显白效果真的绝了！质地也很滋润不拔干，持久度也不错。配上这个妆容整个人气色都提亮了好多～',
      image: sampleImages[4],
      time: '4天前',
      likes: 1876,
      views: 23456,
      comments: [
        {
          id: 11,
          username: '口红收集者',
          content: '这个色号真的太美了！是哪个牌子的呀？',
          avatar: sampleAvatars[0],
          time: '3天前',
          likes: 34
        }
      ],
      tags: ['美妆', '口红', '显白', '秋冬妆容', '种草']
    },
    {
      id: 7,
      username: '居家生活家',
      avatar: sampleAvatars[0],
      content: '分享一下我的周末routine🏠 在家做了超好吃的提拉米苏，还整理了房间，点上香薰蜡烛，整个空间都变得温馨起来。简单的生活也可以很精致～',
      image: sampleImages[5],
      time: '2天前',
      likes: 1234,
      views: 8765,
      comments: [
        {
          id: 12,
          username: '烘焙爱好者',
          content: '提拉米苏看起来好诱人！能分享制作方法吗？',
          avatar: sampleAvatars[3],
          time: '1天前',
          likes: 67
        }
      ],
      tags: ['居家', '烘焙', '生活方式', '精致生活', '周末时光']
    }
  ];
};

// 生成随机头像URL
export const generateAvatar = (seed = '') => {
  const avatars = [
    'https://images.unsplash.com/photo-1494790108755-2616b612f0c6?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
  ];
  return avatars[Math.floor(Math.random() * avatars.length)];
};

// 生成随机用户名 - 小红书风格
export const generateUsername = () => {
  const prefixes = ['小红书', '时尚', '美食', '旅行', '健身', '美妆', '摄影', '生活', '学习', '工作'];
  const types = ['达人', '博主', '爱好者', '专家', '控', '分享者', '记录者', '探索者'];
  const names = ['Lisa', 'Amy', 'Coco', 'Luna', 'Mia', 'Nina', '小慧', '小美', '小李', '小王', '小张', '小陈'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const type = types[Math.floor(Math.random() * types.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  
  // 随机选择组合方式
  const combinations = [
    `${prefix}${type}${name}`,
    `${type}${name}`,
    `${name}的${prefix}日记`,
    `${name}${prefix}记录`
  ];
  
  return combinations[Math.floor(Math.random() * combinations.length)];
};

// 生成随机内容 - 小红书风格
export const generateRandomContent = () => {
  const contents = [
    '今天心情特别好，想和大家分享一下这个美好的时刻！✨',
    '刚刚尝试了一个新的方法，效果出乎意料的好，必须安利给大家～',
    '生活中总是充满了惊喜，每天都有新的发现💕',
    '最近在学习新的技能，虽然有些困难但很有成就感！',
    '和姐妹们一起度过了愉快的时光，友谊真的很珍贵🥰',
    '看到这个场景时，忍不住想要记录下来分享给大家📸',
    '经过一段时间的努力，终于达到了预期的目标！',
    '今天的outfit分享，这套搭配我超级喜欢～',
    '新发现的宝藏店铺，必须推荐给大家！',
    '周末在家的悠闲时光，简单的快乐就是这样💫'
  ];
  
  return contents[Math.floor(Math.random() * contents.length)];
};

// 生成随机标签 - 小红书热门标签
export const generateRandomTags = () => {
  const allTags = [
    // 生活类
    '生活', '分享', '日常', '记录', '治愈', '精致生活', '慢生活', '居家',
    // 美食类
    '美食', '探店', '打卡', '网红店', '甜品', '咖啡', '烘焙', '下午茶',
    // 时尚美妆类
    '穿搭', 'OOTD', '时尚', '美妆', '护肤', '口红', '显白', '种草',
    // 旅行类
    '旅行', '风景', '摄影', '打卡地', '度假', '海边', '日落', '治愈系',
    // 学习工作类
    '学习', '读书', '笔记', '效率', '自律', '成长', '工作', '职场',
    // 运动健康类
    '健身', '运动', '瑜伽', '跑步', '健康', '减肥', '马甲线', '打卡',
    // 兴趣爱好类
    '摄影', '手工', '绘画', '音乐', '电影', '书籍', '花艺', '收纳',
    // 情感类
    '心情', '感悟', '励志', '正能量', '温柔', '治愈', '小确幸', '美好'
  ];
  
  const numTags = Math.floor(Math.random() * 4) + 2; // 2-5个标签
  const shuffled = allTags.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numTags);
};

// 时间格式化 - 小红书风格
export const formatTime = (date) => {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  if (days < 365) return `${Math.floor(days / 30)}个月前`;
  
  return `${Math.floor(days / 365)}年前`;
};

// 格式化数字显示 - 小红书风格
export const formatNumber = (num) => {
  if (num < 1000) return num.toString();
  if (num < 10000) return `${(num / 1000).toFixed(1)}k`;
  if (num < 100000) return `${Math.floor(num / 1000)}k`;
  if (num < 1000000) return `${(num / 10000).toFixed(1)}w`;
  return `${Math.floor(num / 10000)}w`;
};

// 内容长度截取
export const truncateContent = (content, maxLength = 120) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};

// 验证内容是否为空
export const isContentEmpty = (content) => {
  return !content || content.trim().length === 0;
};

// 提取内容中的标签
export const extractHashtags = (content) => {
  const hashtagRegex = /#[\u4e00-\u9fa5\w]+/g;
  const matches = content.match(hashtagRegex);
  return matches ? matches.map(tag => tag.substring(1)) : [];
};

// 提取@用户
export const extractMentions = (content) => {
  const mentionRegex = /@[\u4e00-\u9fa5\w]+/g;
  const matches = content.match(mentionRegex);
  return matches ? matches.map(mention => mention.substring(1)) : [];
};

// 高亮显示标签和@用户
export const highlightHashtags = (content) => {
  return content
    .replace(/#([\u4e00-\u9fa5\w]+)/g, '<span class="text-blue-600 font-medium cursor-pointer hover:text-blue-700">#$1</span>')
    .replace(/@([\u4e00-\u9fa5\w]+)/g, '<span class="text-green-600 font-medium cursor-pointer hover:text-green-700">@$1</span>');
};

// 生成随机位置信息
export const generateRandomLocation = () => {
  const cities = ['上海', '北京', '广州', '深圳', '杭州', '成都', '重庆', '西安', '南京', '武汉'];
  const districts = ['静安区', '朝阳区', '天河区', '福田区', '西湖区', '锦江区', '渝中区', '雁塔区', '玄武区', '江汉区'];
  
  const city = cities[Math.floor(Math.random() * cities.length)];
  const district = districts[Math.floor(Math.random() * districts.length)];
  
  return `${city}·${district}`;
};

// 生成随机emoji
export const generateRandomEmoji = () => {
  const emojis = ['✨', '💕', '🥰', '😍', '🌟', '💖', '🎉', '🌈', '🦄', '💫', '🌸', '🍃', '🌺', '🌙', '☀️'];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

// 检查内容是否包含敏感词汇
export const containsSensitiveContent = (content) => {
  const sensitiveWords = ['敏感', '违规', '政治', '极端', '暴力', '不当'];
  const lowerContent = content.toLowerCase();
  return sensitiveWords.some(word => lowerContent.includes(word));
};

// 生成内容摘要
export const generateContentSummary = (content, maxLength = 50) => {
  // 移除emoji和特殊字符
  const cleanContent = content.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
  
  if (cleanContent.length <= maxLength) return cleanContent;
  
  // 尝试在句号处截断
  const sentences = cleanContent.split(/[。！？.!?]/);
  let summary = '';
  
  for (const sentence of sentences) {
    if ((summary + sentence).length > maxLength) break;
    summary += sentence + '。';
  }
  
  return summary || cleanContent.substring(0, maxLength) + '...';
};