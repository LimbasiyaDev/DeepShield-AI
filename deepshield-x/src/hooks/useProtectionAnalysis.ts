import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export function useProtectionAnalysis() {
  return useMutation({
    mutationFn: async (data: { pair: string; amount: number; slippage: number; wallet: string }) => {
      return apiClient.post('/protection/analyze', data);
    }
  });
}

export function useTradeExecution() {
  return useMutation({
    mutationFn: async (tradeData: any) => {
      return apiClient.post('/protection/execute', tradeData);
    }
  });
}
