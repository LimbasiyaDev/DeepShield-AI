import { apiClient } from '../lib/api';

export const marketApi = {
  getMarketData: async (token: string) => {
    return apiClient.get<any, any>(`/market/${encodeURIComponent(token)}`);
  },
  getMarketAnalysis: async (token: string) => {
    return apiClient.get<any, any>(`/market/${encodeURIComponent(token)}/analysis`);
  }
};
