import { apiClient } from '../lib/api';

export const replayApi = {
  getHistory: async () => {
    return apiClient.get<any, any>('/replay/history');
  },
  getTrade: async (tradeId: string) => {
    return apiClient.get<any, any>(`/replay/${tradeId}`);
  }
};
