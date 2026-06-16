import { useMutation } from '@tanstack/react-query';
import { protectionApi } from '../api/protection.api';

export function useProtection() {
  const analyzeMutation = useMutation({
    mutationFn: async (tradeData: any) => {
      return protectionApi.analyze(tradeData);
    }
  });

  const executeMutation = useMutation({
    mutationFn: async (executionData: any) => {
      return protectionApi.execute(executionData);
    }
  });

  return {
    analyze: analyzeMutation,
    execute: executeMutation
  };
}
