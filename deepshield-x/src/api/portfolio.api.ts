import { apiClient } from '../lib/api';

export const portfolioApi = {
  analyze: async (portfolioData?: any) => {
    return apiClient.post<any, any>('/portfolio/analyze', portfolioData);
  }
};
