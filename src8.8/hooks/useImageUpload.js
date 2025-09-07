import { useState } from 'react';

export const useImageUpload = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 文件类型验证
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    // 文件大小验证 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('图片大小不能超过10MB');
      return;
    }

    setError(null);
    setIsUploading(true);
    setImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setError('图片读取失败');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    setError(null);
  };

  return {
    image,
    imagePreview,
    isUploading,
    error,
    handleImageUpload,
    clearImage
  };
};