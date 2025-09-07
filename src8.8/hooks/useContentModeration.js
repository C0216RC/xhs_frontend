import { useState, useEffect } from 'react';
import { moderateContent } from '../services/moderationService';

export const useContentModeration = (textContent, imageContent) => {
  const [textModeration, setTextModeration] = useState(null);
  const [imageModeration, setImageModeration] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzeContent = async () => {
      if (!textContent && !imageContent) {
        setTextModeration(null);
        setImageModeration(null);
        return;
      }

      setIsAnalyzing(true);
      setError(null);

      try {
        const promises = [];
        
        if (textContent && textContent.trim()) {
          promises.push(
            moderateContent(textContent, 'text').then(result => ({
              type: 'text',
              result
            }))
          );
        }
        
        if (imageContent) {
          promises.push(
            moderateContent(imageContent, 'image').then(result => ({
              type: 'image', 
              result
            }))
          );
        }

        const results = await Promise.all(promises);
        
        results.forEach(({ type, result }) => {
          if (type === 'text') {
            setTextModeration(result);
          } else if (type === 'image') {
            setImageModeration(result);
          }
        });

      } catch (err) {
        console.error('内容审核失败:', err);
        setError(err.message);
      } finally {
        setIsAnalyzing(false);
      }
    };

    // 防抖处理，避免频繁调用
    const timeoutId = setTimeout(analyzeContent, 500);
    return () => clearTimeout(timeoutId);
  }, [textContent, imageContent]);

  return {
    textModeration,
    imageModeration,
    isAnalyzing,
    error
  };
};