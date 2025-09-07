import { apiClient } from './apiClient';

class AIService {
  // 文本内容审核
  async moderateText(text) {
    try {
      const response = await apiClient.post('/moderation/text', { text });
      return response.data;
    } catch (error) {
      console.error('文本审核失败:', error);
      throw new Error('文本审核服务暂时不可用');
    }
  }

  // 图片内容审核
  async moderateImage(imageFile) {
    try {
      const response = await apiClient.uploadFile('/moderation/image', imageFile);
      return response.data;
    } catch (error) {
      console.error('图片审核失败:', error);
      throw new Error('图片审核服务暂时不可用');
    }
  }

  // 批量内容审核
  async moderateBatch(items) {
    try {
      const response = await apiClient.post('/moderation/batch', { items });
      return response.results;
    } catch (error) {
      console.error('批量审核失败:', error);
      throw new Error('批量审核服务暂时不可用');
    }
  }

  // 获取审核统计
  async getModerationStats() {
    try {
      const response = await apiClient.get('/moderation/stats');
      return response.data;
    } catch (error) {
      console.error('获取统计失败:', error);
      throw new Error('统计服务暂时不可用');
    }
  }

  // 提交审核反馈
  async submitFeedback(contentId, moderationResult, userFeedback, feedbackType) {
    try {
      const response = await apiClient.post('/moderation/feedback', {
        content_id: contentId,
        moderation_result: moderationResult,
        user_feedback: userFeedback,
        feedback_type: feedbackType
      });
      return response;
    } catch (error) {
      console.error('提交反馈失败:', error);
      throw new Error('反馈提交失败');
    }
  }

  // 健康检查
  async healthCheck() {
    try {
      const response = await apiClient.get('/moderation/health');
      return response;
    } catch (error) {
      console.error('健康检查失败:', error);
      return { status: 'unhealthy' };
    }
  }
}

export const aiService = new AIService();