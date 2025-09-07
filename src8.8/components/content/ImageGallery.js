import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

const ImageGallery = ({ images, initialIndex = 0, alt = '图片' }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // ✅ 所有 useEffect 必须在组件顶部，任何条件判断之前

  // 重置状态当图片改变时
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setImageDimensions({ width: 0, height: 0 });
  }, [currentIndex]);

  // 重置初始索引
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!images || images.length === 0) return;
      
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [images]);

  // 拖拽鼠标事件处理
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && zoom > 1) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, zoom]);

  // ✅ 条件判断放在所有 hooks 之后
  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  // 上一张图片
  const goToPrevious = () => {
    if (hasMultipleImages) {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  // 下一张图片
  const goToNext = () => {
    if (hasMultipleImages) {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  // 图片加载处理
  const handleImageLoad = (e) => {
    setIsLoaded(true);
    setIsError(false);
    // 获取图片的原始尺寸
    const img = e.target;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  };

  const handleImageError = () => {
    setIsError(true);
    setIsLoaded(false);
  };

  // 缩放控制
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // 拖拽处理
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  // 计算容器的动态高度
  const getContainerStyle = () => {
    if (!isLoaded || !imageDimensions.width || !imageDimensions.height) {
      return { minHeight: '400px' }; // 加载时的默认高度
    }

    // 计算图片的显示尺寸，保持宽高比
    const containerMaxWidth = 800; // 最大宽度
    const containerMaxHeight = 600; // 最大高度
    
    const aspectRatio = imageDimensions.width / imageDimensions.height;
    
    let displayWidth, displayHeight;
    
    if (aspectRatio > containerMaxWidth / containerMaxHeight) {
      // 图片较宽，以宽度为准
      displayWidth = Math.min(containerMaxWidth, imageDimensions.width);
      displayHeight = displayWidth / aspectRatio;
    } else {
      // 图片较高，以高度为准
      displayHeight = Math.min(containerMaxHeight, imageDimensions.height);
      displayWidth = displayHeight * aspectRatio;
    }

    return {
      width: `${displayWidth}px`,
      height: `${displayHeight}px`,
      minHeight: `${displayHeight}px`
    };
  };

  return (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
      {/* 主图片容器 - 动态高度 */}
      <div 
        className="relative flex items-center justify-center bg-gray-50"
        style={getContainerStyle()}
      >
        {/* 加载状态 */}
        {!isLoaded && !isError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
          </div>
        )}

        {/* 错误状态 */}
        {isError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">📷</span>
            </div>
            <p className="text-sm">图片加载失败</p>
            <button 
              onClick={() => {
                setIsError(false);
                setIsLoaded(false);
                // 重新加载图片
                const img = new Image();
                img.onload = () => handleImageLoad({ target: img });
                img.onerror = handleImageError;
                img.src = currentImage;
              }}
              className="mt-2 text-xs text-blue-500 hover:text-blue-600"
            >
              重新加载
            </button>
          </div>
        )}

        {/* 主图片 */}
        <img
          src={currentImage}
          alt={`${alt} ${currentIndex + 1}`}
          className={`max-w-full max-h-full object-contain transition-all duration-300 ${
            zoom > 1 ? 'cursor-move' : 'cursor-zoom-in'
          } ${isDragging ? 'cursor-grabbing' : ''}`}
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            transformOrigin: 'center center',
            width: 'auto',
            height: 'auto'
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          onMouseDown={handleMouseDown}
          onClick={(e) => {
            if (zoom === 1) {
              handleZoomIn();
            }
          }}
          draggable={false}
        />

        {/* 导航箭头 - 只在多图时显示 */}
        {hasMultipleImages && isLoaded && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 z-10"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* 图片计数器 */}
        {hasMultipleImages && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm z-10">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* 缩放控制 */}
        {isLoaded && (
          <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black bg-opacity-50 rounded-lg p-1 z-10">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="text-white p-1 hover:bg-white hover:bg-opacity-20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-white text-xs px-2">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="text-white p-1 hover:bg-white hover:bg-opacity-20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={handleResetZoom}
              className="text-white p-1 hover:bg-white hover:bg-opacity-20 rounded ml-1"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 缩略图导航 - 只在多图时显示 */}
      {hasMultipleImages && (
        <div className="p-3 border-t border-gray-200">
          <div className="flex space-x-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <img
                  src={image}
                  alt={`缩略图 ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/64x64/f0f0f0/999999?text=图片';
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 操作提示 */}
      {hasMultipleImages && isLoaded && (
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10">
          ← → 翻页 | 点击放大 | ESC 重置
        </div>
      )}
    </div>
  );
};

export default ImageGallery;