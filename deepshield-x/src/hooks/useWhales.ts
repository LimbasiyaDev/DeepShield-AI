import { useQuery } from '@tanstack/react-query';
import { whalesApi } from '../api/whales.api';

export function useWhales() {
  const liveQuery = useQuery({
    queryKey: ['whales', 'live'],
    queryFn: async () => {
      return whalesApi.getLive();
    },
    refetchInterval: 5000, // Refetch every 5 seconds for live data
  });

  const historyQuery = useQuery({
    queryKey: ['whales', 'history'],
    queryFn: async () => {
      return whalesApi.getHistory();
    }
  });

  return {
    live: liveQuery,
    history: historyQuery
  };
}
