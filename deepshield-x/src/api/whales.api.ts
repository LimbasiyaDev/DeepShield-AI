import { apiClient } from '../lib/api';

export const whalesApi = {
  getLive: async () => {
    return apiClient.get<any, any>('/whales/live');
  },
  getHistory: async () => {
    return apiClient.get<any, any>('/whales/history');
  }
};
