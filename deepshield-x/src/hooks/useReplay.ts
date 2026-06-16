import { useQuery } from '@tanstack/react-query';
import { replayApi } from '../api/replay.api';

export function useReplay() {
  const historyQuery = useQuery({
    queryKey: ['replay', 'history'],
    queryFn: async () => {
      return replayApi.getHistory();
    }
  });

  const getTradeQuery = (tradeId: string) => useQuery({
    queryKey: ['replay', tradeId],
    queryFn: async () => {
      return replayApi.getTrade(tradeId);
    },
    enabled: !!tradeId
  });

  return {
    history: historyQuery,
    getTrade: getTradeQuery
  };
}
