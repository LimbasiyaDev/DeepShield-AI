import { apiClient } from '../lib/api';

export const analyticsApi = {
  getDashboard: async () => {
    return apiClient.get<any, any>('/analytics/dashboard');
  }
};
