import { useQuery } from '@tanstack/react-query';
import { marketApi } from '../api/market.api';

export function useMarketAnalysis(tokenPair: string) {
  return useQuery({
    queryKey: ['marketAnalysis', tokenPair],
    queryFn: async () => {
      const [marketData, aiSentiment] = await Promise.all([
        marketApi.getMarketData(tokenPair),
        marketApi.getMarketAnalysis(tokenPair)
      ]);

      return {
        chartData: marketData,
        aiAnalysis: aiSentiment?.aiAnalysis || aiSentiment,
        verification: aiSentiment?.verification
      };
    },
    enabled: !!tokenPair,
  });
}
