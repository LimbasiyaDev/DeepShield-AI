import { apiClient } from '../lib/api';

export const guardianApi = {
  chat: async (message: string, context?: any) => {
    return apiClient.post<any, any>('/guardian/chat', { question: message, context });
  }
};
