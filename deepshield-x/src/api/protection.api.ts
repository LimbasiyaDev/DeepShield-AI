import { apiClient } from '../lib/api';

export const protectionApi = {
  analyze: async (tradeData: any) => {
    return apiClient.post<any, any>('/protection/analyze', tradeData);
  },
  execute: async (executionData: any) => {
    return apiClient.post<any, any>('/protection/execute', executionData);
  }
};
