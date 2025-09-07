class ImageUtils {
  constructor() {
    this.defaultAvatars = [
      'https://images.unsplash.com/photo-1494790108755-2616b612f0c6?w=80&h=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face'
    ];
    
    // 图片缓存，避免重复检测
    this.imageCache = new Map();
  }

  /**
   * 检测单张图片是否存在
   * @param {string} imagePath - 图片路径
   * @returns {Promise<boolean>} 图片是否存在
   */
  async checkImageExists(imagePath) {
    if (this.imageCache.has(imagePath)) {
      return this.imageCache.get(imagePath);
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(imagePath, true);
        resolve(true);
      };
      img.onerror = () => {
        this.imageCache.set(imagePath, false);
        resolve(false);
      };
      // 设置超时，避免长时间等待
      setTimeout(() => {
        this.imageCache.set(imagePath, false);
        resolve(false);
      }, 3000);
      
      img.src = imagePath;
    });
  }

  /**
   * 获取帖子的所有图片路径（按序号递增检测）
   * @param {string} noteId - 帖子ID
   * @param {string} source - 数据源 (Part1, Part2, PartNormal)
   * @param {number} maxImages - 最大图片数量限制（默认20）
   * @returns {Promise<string[]>} 所有存在的图片路径数组
   */
  async getAllImagePaths(noteId, source = 'Part1', maxImages = 20) {
    if (!noteId) {
      console.warn('缺少帖子ID，无法获取图片路径');
      return [];
    }

    const basePath = `/data/${source}/images/${noteId}`;
    const imagePaths = [];
    
    console.log(`🔍 开始检测帖子 ${noteId} 的图片...`);

    // 从0.jpg开始递增检测
    for (let i = 0; i < maxImages; i++) {
      const imagePath = `${basePath}/${i}.jpg`;
      
      try {
        const exists = await this.checkImageExists(imagePath);
        if (exists) {
          imagePaths.push(imagePath);
          console.log(`✅ 找到图片: ${imagePath}`);
        } else {
          console.log(`❌ 图片不存在: ${imagePath}`);
          // 连续3张图片不存在就停止检测
          if (i >= 3) {
            let consecutiveNotFound = 0;
            for (let j = Math.max(0, i - 2); j <= i; j++) {
              const checkPath = `${basePath}/${j}.jpg`;
              if (!this.imageCache.get(checkPath)) {
                consecutiveNotFound++;
              }
            }
            if (consecutiveNotFound >= 3) {
              console.log(`🛑 连续3张图片不存在，停止检测 (最后检测: ${i}.jpg)`);
              break;
            }
          }
        }
      } catch (error) {
        console.warn(`检测图片失败: ${imagePath}`, error);
        break;
      }
    }

    console.log(`📊 帖子 ${noteId} 共找到 ${imagePaths.length} 张图片`);
    return imagePaths;
  }

  /**
   * 获取单张图片路径（主要用于向后兼容）
   * @param {string} originalImageUrl - 原始图片URL（可能是HTTP URL）
   * @param {string} source - 数据源
   * @param {string} noteId - 帖子ID
   * @returns {string} 第一张图片的路径
   */
  getImagePath(originalImageUrl, source = 'Part1', noteId = null) {
    if (!noteId) {
      console.warn('缺少帖子ID，无法构建图片路径');
      return null;
    }

    // 直接返回第一张图片的路径
    const firstImagePath = `/data/${source}/images/${noteId}/0.jpg`;
    
    console.log('构建图片路径:', {
      original: originalImageUrl,
      noteId: noteId,
      source: source,
      result: firstImagePath
    });

    return firstImagePath;
  }

  /**
   * 预加载图片数组
   * @param {string[]} srcArray - 图片路径数组
   * @returns {Promise[]} Promise数组
   */
  preloadImages(srcArray) {
    if (!Array.isArray(srcArray)) return [];
    
    return srcArray.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ src, loaded: true });
        img.onerror = () => resolve({ src, loaded: false });
        img.src = src;
      });
    });
  }

  /**
   * 判断是否有图片扩展名
   * @param {string} path - 文件路径
   * @returns {boolean} 是否有图片扩展名
   */
  hasImageExtension(path) {
    if (!path || typeof path !== 'string') return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const lowerPath = path.toLowerCase();
    return imageExtensions.some(ext => lowerPath.endsWith(ext));
  }

  /**
   * 获取头像路径
   * @param {string} avatar - 头像文件名
   * @param {string} identifier - 用户标识符
   * @param {string} source - 数据源
   * @returns {string} 头像路径
   */
  getAvatarPath(avatar, identifier, source) {
    if (avatar && this.isValidImageUrl(avatar)) {
      return avatar;
    }

    // 根据用户标识符生成默认头像
    const hash = this.hashCode(identifier || 'anonymous');
    const index = Math.abs(hash) % this.defaultAvatars.length;
    return this.defaultAvatars[index];
  }

  /**
   * 简单的字符串哈希函数
   * @param {string} str - 输入字符串
   * @returns {number} 哈希值
   */
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * 获取图片真实尺寸
   * @param {string} src - 图片路径
   * @returns {Promise} Promise对象，resolve包含width和height
   */
  getImageDimensions(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * 判断是否为有效的图片URL
   * @param {string} url - 图片URL
   * @returns {boolean} 是否为有效图片URL
   */
  isValidImageUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    // 检查是否为data URL
    if (url.startsWith('data:image/')) return true;
    
    // 检查是否为HTTP(S) URL
    if (url.startsWith('http://') || url.startsWith('https://')) return true;
    
    // 检查是否为相对路径且有图片扩展名
    return this.hasImageExtension(url);
  }
}

// 创建单例实例
const imageUtils = new ImageUtils();

export default imageUtils;