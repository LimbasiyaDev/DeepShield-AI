import { apiClient } from '../lib/api';

export const simulationApi = {
  run: async (simData: any) => {
    return apiClient.post<any, any>('/simulation/run', simData);
  }
};
